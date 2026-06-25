import { useEffect, useState } from 'react'
import { getMessages } from '../services/api'
import { useChat } from '../context/ChatContext'

export function useMessages() {
  const { setMessages } = useChat()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)

    getMessages()
      .then(data => {
        if (cancelled) return

        const publicMsgs = (data || [])
          .filter(msg => msg.message && msg.message.trim()) // drop null/empty
          .map(msg => ({
            id: msg.id,
            type: 'chat',
            from: msg.sender || 'unknown',
            text: msg.message.trim(),
            time: formatTimestamp(msg.timestamp),
            chatKey: 'public',
          }))
          .reverse() // API returns newest first → reverse to oldest first

        setMessages('public', publicMsgs)
        setLoading(false)
      })
      .catch(err => {
        if (cancelled) return
        setError(err?.response?.data?.message || 'Failed to load messages')
        setLoading(false)
      })

    return () => { cancelled = true }
  }, [setMessages])

  return { loading, error }
}

function formatTimestamp(raw) {
  if (!raw) return '--:--'
  try {
    const d = new Date(raw)
    if (isNaN(d.getTime())) return '--:--'
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
  } catch {
    return '--:--'
  }
}
