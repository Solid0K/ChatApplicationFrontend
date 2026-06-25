import { useState } from 'react'
import wsService from '../services/websocket'
import { useAuth } from '../context/AuthContext'
import { useChat } from '../context/ChatContext'

export default function MessageInput({ disabled }) {
  const [text, setText] = useState('')
  const { username } = useAuth()
  const { activeChat } = useChat()

  const handleSend = () => {
    const trimmed = text.trim()
    if (!trimmed || disabled) return

    const isPrivate = activeChat !== 'public'

    // No optimistic echo — server broadcasts back to all including sender
    const payload = isPrivate
      ? { type: 'private', receiver: activeChat, message: trimmed, username }
      : { type: 'public', message: trimmed, username }

    wsService.send(payload)
    setText('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const prefix = activeChat === 'public'
    ? `[${username}@PUBLIC]>`
    : `[${username}@PM:${activeChat}]>`

  return (
    <div className="border-t border-terminal-border px-4 py-3 flex items-center gap-2">
      <span className="text-terminal-green-dim text-xs shrink-0 select-none">{prefix}</span>
      <input
        type="text"
        className="terminal-input flex-1 text-sm py-1.5 px-2"
        value={text}
        onChange={e => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="ENTER TRANSMISSION..."
        disabled={disabled}
        maxLength={1000}
        autoFocus
      />
      <button
        onClick={handleSend}
        disabled={disabled || !text.trim()}
        className="terminal-btn terminal-btn-primary shrink-0 py-1.5 px-3 disabled:opacity-30 disabled:cursor-not-allowed"
      >
        SEND
      </button>
    </div>
  )
}
