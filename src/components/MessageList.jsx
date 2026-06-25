import { useEffect, useRef } from 'react'
import MessageBubble from './MessageBubble'

export default function MessageList({ messages, loading }) {
  const bottomRef = useRef(null)
  const containerRef = useRef(null)

  useEffect(() => {
    // Always scroll to bottom when messages change
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'auto' })
    }
  }, [messages])

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <span className="text-terminal-text-dim text-sm">
          LOADING TRANSMISSION LOG<span className="blink">_</span>
        </span>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto px-4 py-3 flex flex-col"
    >
      {messages.length === 0 && (
        <div className="flex-1 flex items-center justify-center">
          <span className="text-terminal-text-muted text-xs text-center tracking-wider">
            -- NO TRANSMISSIONS ON RECORD --
          </span>
        </div>
      )}

      {/* Spacer pushes messages to bottom when few messages exist */}
      <div className="flex-1" />

      {messages.map((msg, i) => (
        <MessageBubble key={msg.id || i} message={msg} />
      ))}

      <div ref={bottomRef} />
    </div>
  )
}
