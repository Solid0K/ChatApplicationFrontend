import { useAuth } from '../context/AuthContext'

export default function MessageBubble({ message }) {
  const { username } = useAuth()
  const isSystem = message.type === 'system'
  const isOwn = message.from === username

  if (isSystem) {
    return (
      <div className="py-0.5 text-center select-none">
        <span className="text-terminal-system-bright text-xs tracking-widest">
          ----- SYSTEM ----- [{message.time}] {message.text}
        </span>
      </div>
    )
  }

  return (
    <div className="py-0.5">
      {/* Timestamp */}
      <span className="text-terminal-text-dim text-xs">[{message.time}]</span>
      {' '}
      {/* Username — cyan for others, green-bright for own */}
      <span className={`font-bold ${isOwn ? 'text-terminal-cyan-bright' : 'text-terminal-amber-bright'}`}>
        [{message.from}]
      </span>
      {' '}
      {/* Message text */}
      <span className={isOwn ? 'text-terminal-cyan-text' : 'text-terminal-text'}>
        {message.text}
      </span>
    </div>
  )
}
