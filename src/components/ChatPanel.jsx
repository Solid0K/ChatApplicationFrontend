import { useChat } from '../context/ChatContext'
import MessageList from './MessageList'
import MessageInput from './MessageInput'
import TerminalHeader from './TerminalHeader'

export default function ChatPanel({ loading, wsConnected, onMenuOpen }) {
  const { activeChat, messageMap } = useChat()
  const messages = messageMap[activeChat] || []

  const channelLabel = activeChat === 'public'
    ? 'PUBLIC BROADCAST'
    : `PM // ${activeChat.toUpperCase()}`

  const subtitle = activeChat === 'public'
    ? `${messages.length} transmissions`
    : `direct link to ${activeChat}`

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-terminal-bg min-w-0">
      <TerminalHeader
        title={channelLabel}
        subtitle={subtitle}
        status={wsConnected ? 'LIVE' : 'RECONNECTING'}
        onMenuOpen={onMenuOpen}
      />
      <MessageList messages={messages} loading={loading} />
      <MessageInput disabled={!wsConnected && !loading} />
    </div>
  )
}
