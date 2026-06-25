import { createContext, useContext, useState, useCallback } from 'react'

const ChatContext = createContext(null)

export function ChatProvider({ children }) {
  // 'public' or a username string for private chats
  const [activeChat, setActiveChat] = useState('public')
  // { public: [...messages], [username]: [...messages] }
  const [messageMap, setMessageMap] = useState({ public: [] })
  const [onlineUsers, setOnlineUsers] = useState([])
  // { [username]: number } unread counts
  const [unread, setUnread] = useState({})

  const addMessage = useCallback((chatKey, message) => {
    setMessageMap(prev => ({
      ...prev,
      [chatKey]: [...(prev[chatKey] || []), message],
    }))
  }, [])

  const setMessages = useCallback((chatKey, messages) => {
    setMessageMap(prev => ({ ...prev, [chatKey]: messages }))
  }, [])

  const openChat = useCallback((chatKey) => {
    setActiveChat(chatKey)
    setUnread(prev => ({ ...prev, [chatKey]: 0 }))
  }, [])

  const incrementUnread = useCallback((chatKey) => {
    setUnread(prev => ({ ...prev, [chatKey]: (prev[chatKey] || 0) + 1 }))
  }, [])

  return (
    <ChatContext.Provider value={{
      activeChat, setActiveChat: openChat,
      messageMap, addMessage, setMessages,
      onlineUsers, setOnlineUsers,
      unread, incrementUnread,
    }}>
      {children}
    </ChatContext.Provider>
  )
}

export function useChat() {
  const ctx = useContext(ChatContext)
  if (!ctx) throw new Error('useChat must be used within ChatProvider')
  return ctx
}
