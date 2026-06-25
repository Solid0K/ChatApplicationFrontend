import { useChat } from '../context/ChatContext'
import { useAuth } from '../context/AuthContext'

export default function Sidebar({ onLogout, isOpen, onClose }) {
  const { onlineUsers, activeChat, setActiveChat, messageMap, unread } = useChat()
  const { username } = useAuth()

  const privateChats = Object.keys(messageMap).filter(k => k !== 'public')

  const handleChatSelect = (chatKey) => {
    setActiveChat(chatKey)
    onClose?.()
  }

  const NavItem = ({ chatKey, label, count }) => {
    const isActive = activeChat === chatKey
    const unreadCount = unread[chatKey] || 0
    return (
      <button
        onClick={() => handleChatSelect(chatKey)}
        className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between transition-colors
          ${isActive
            ? 'bg-terminal-cyan-dim text-terminal-cyan-bright border-l-2 border-terminal-cyan-bright'
            : 'text-terminal-text-dim hover:text-terminal-text hover:bg-terminal-surface border-l-2 border-transparent'
          }`}
      >
        <span className="truncate">{label}</span>
        <span className="flex items-center gap-1 shrink-0">
          {unreadCount > 0 && !isActive && (
            <span className="bg-terminal-cyan-dim text-terminal-cyan-bright text-xs px-1 min-w-[1.2rem] text-center border border-terminal-cyan">
              {unreadCount}
            </span>
          )}
          {count !== undefined && (
            <span className="text-terminal-text-muted text-xs">[{count}]</span>
          )}
        </span>
      </button>
    )
  }

  const UserItem = ({ user }) => {
    const isSelf = user === username
    return (
      <div
        onClick={() => !isSelf && handleChatSelect(user)}
        className={`px-3 py-1.5 flex items-center gap-2 text-xs transition-colors
          ${isSelf
            ? 'text-terminal-cyan-bright cursor-default'
            : 'text-terminal-text-dim cursor-pointer hover:bg-terminal-surface hover:text-terminal-cyan-text'
          }`}
      >
        <span className={`shrink-0 text-xs ${isSelf ? 'text-terminal-cyan-bright' : 'text-terminal-green-bright'}`}>●</span>
        <span className="truncate">{user}{isSelf ? ' [you]' : ''}</span>
      </div>
    )
  }

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 z-20 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed md:relative z-30 md:z-auto
        top-0 left-0 h-full
        w-64 md:w-52 shrink-0
        flex flex-col
        border-r border-terminal-border bg-terminal-bg
        transition-transform duration-200 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>

        {/* Brand */}
        <div className="px-3 py-3 border-b border-terminal-border bg-terminal-surface flex items-center justify-between">
          <div>
            <div className="text-terminal-cyan-bright text-xs tracking-widest uppercase">TERM-COMM</div>
            <div className="text-terminal-text-muted text-xs">v2.4.1 // SECURE</div>
          </div>
          <button
            onClick={onClose}
            className="md:hidden text-terminal-text-dim hover:text-terminal-cyan-bright text-lg leading-none px-1 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Channels */}
        <div className="border-b border-terminal-border py-2">
          <div className="px-3 py-1 text-terminal-cyan text-xs tracking-widest uppercase">// Channels</div>
          <NavItem chatKey="public" label="#PUBLIC-BROADCAST" count={onlineUsers.length} />
        </div>

        {/* Private conversations */}
        {privateChats.length > 0 && (
          <div className="border-b border-terminal-border py-2">
            <div className="px-3 py-1 text-terminal-cyan text-xs tracking-widest uppercase">// Direct</div>
            {privateChats.map(user => (
              <NavItem key={user} chatKey={user} label={`@ ${user}`} />
            ))}
          </div>
        )}

        {/* Online users */}
        <div className="flex-1 overflow-y-auto py-2">
          <div className="px-3 py-1 text-terminal-cyan text-xs tracking-widest uppercase">
            // Online [{onlineUsers.length}]
          </div>
          {onlineUsers.length === 0 && (
            <div className="px-3 py-1 text-terminal-text-muted text-xs">No users detected</div>
          )}
          {onlineUsers.map(user => (
            <UserItem
              key={typeof user === 'string' ? user : user.username}
              user={typeof user === 'string' ? user : user.username}
            />
          ))}
        </div>

        {/* Identity + logout */}
        <div className="border-t border-terminal-border p-3 bg-terminal-surface">
          <div className="text-terminal-text-dim text-xs mb-2 truncate">
            IDENT: <span className="text-terminal-cyan-bright">{username}</span>
          </div>
          <button onClick={onLogout} className="terminal-btn terminal-btn-danger w-full text-xs py-1.5">
            DISCONNECT
          </button>
        </div>
      </div>
    </>
  )
}
