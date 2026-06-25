import { useEffect, useRef } from 'react'
import wsService from '../services/websocket'
import { useAuth } from '../context/AuthContext'
import { useChat } from '../context/ChatContext'
import { getOnlineUsers } from '../services/api'

export function useWebSocket() {
  const { token, username } = useAuth()
  const { addMessage, setOnlineUsers, activeChat, incrementUnread } = useChat()
  const activeChatRef = useRef(activeChat)

  useEffect(() => {
    activeChatRef.current = activeChat
  }, [activeChat])

  useEffect(() => {
    if (!token) return

    wsService.connect(token)

    const unsubscribe = wsService.subscribe((event) => {
      handleEvent(event, username, addMessage, setOnlineUsers, activeChatRef, incrementUnread)
    })

    const pollOnline = async () => {
      try {
        const users = await getOnlineUsers()
        setOnlineUsers(Array.isArray(users) ? users : [])
      } catch { /* silent */ }
    }
    pollOnline()
    const pollTimer = setInterval(pollOnline, 15000)

    return () => {
      unsubscribe()
      clearInterval(pollTimer)
    }
  }, [token, username, addMessage, setOnlineUsers, incrementUnread])
}

function handleEvent(event, username, addMessage, setOnlineUsers, activeChatRef, incrementUnread) {
  const now = formatTime(new Date())

  switch (event.type) {
    case 'CONNECTED':
      addMessage('public', { id: Date.now(), type: 'system', text: 'CONNECTION ESTABLISHED', time: now })
      break

    case 'DISCONNECTED':
      addMessage('public', { id: Date.now(), type: 'system', text: 'CONNECTION LOST — ATTEMPTING RECONNECT', time: now })
      break

    case 'USERS_ONLINE':
      setOnlineUsers(event.users || [])
      break

    case 'USER_JOINED':
      addMessage('public', { id: Date.now(), type: 'system', text: `${event.username} joined`, time: now })
      break

    case 'USER_LEFT':
      addMessage('public', { id: Date.now(), type: 'system', text: `${event.username} left`, time: now })
      break

    // All JSON from server comes as RAW since WebSocket service just parses and re-emits
    case 'RAW':
      try {
        const parsed = JSON.parse(event.payload)
        handleServerMessage(parsed, username, addMessage, activeChatRef, incrementUnread, now)
      } catch {
        if (event.payload && event.payload.trim()) {
          addMessage('public', { id: Date.now(), type: 'system', text: event.payload, time: now })
        }
      }
      break

    default:
      // Direct parsed objects (if ws service emits them)
      if (event.username || event.message) {
        handleServerMessage(event, username, addMessage, activeChatRef, incrementUnread, now)
      }
      break
  }
}

function handleServerMessage(data, username, addMessage, activeChatRef, incrementUnread, now) {
  const serverType = (data.type || '').toLowerCase()
  const text = data.message || data.text || data.content || ''
  const from = data.username || data.from || data.sender || 'unknown'

  // Error: offline user
  if (serverType === 'error') {
    addMessage('public', {
      id: Date.now(),
      type: 'system',
      text: `[OFFLINE] ${data.message || 'User is offline'}`,
      time: now,
    })
    return
  }

  // System: join/leave
  if (serverType === 'join') {
    addMessage('public', { id: Date.now(), type: 'system', text: `${from} joined`, time: now })
    return
  }
  if (serverType === 'leave') {
    addMessage('public', { id: Date.now(), type: 'system', text: `${from} left`, time: now })
    return
  }

  // Skip empty messages
  if (!text || !text.trim()) return

  // Private message
  if (serverType === 'private') {
    // The conversation key is always the OTHER person
    const chatKey = from === username ? data.receiver : from
    if (!chatKey) return
    addMessage(chatKey, {
      id: Date.now(),
      type: 'chat',
      from,
      text,
      time: now,
      chatKey,
    })
    if (activeChatRef.current !== chatKey) incrementUnread(chatKey)
    return
  }

  // Public message — show for everyone including own (server is source of truth)
  addMessage('public', {
    id: Date.now(),
    type: 'chat',
    from,
    text,
    time: now,
    chatKey: 'public',
  })
  if (activeChatRef.current !== 'public') incrementUnread('public')
}

function formatTime(date) {
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
}
