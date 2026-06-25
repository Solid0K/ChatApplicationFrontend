import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useWebSocket } from '../hooks/useWebSocket'
import { useMessages } from '../hooks/useMessages'
import Sidebar from '../components/Sidebar'
import ChatPanel from '../components/ChatPanel'
import wsService from '../services/websocket'

export default function ChatPage() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const { loading } = useMessages()
  const [wsConnected, setWsConnected] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useWebSocket()

  useEffect(() => {
    const unsub = wsService.subscribe((event) => {
      if (event.type === 'CONNECTED') setWsConnected(true)
      if (event.type === 'DISCONNECTED' || event.type === 'ERROR') setWsConnected(false)
    })
    setWsConnected(wsService.isConnected())
    return unsub
  }, [])

  // Close sidebar on desktop resize
  useEffect(() => {
    const handler = () => {
      if (window.innerWidth >= 768) setSidebarOpen(false)
    }
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  const handleLogout = () => {
    wsService.disconnect()
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="h-screen flex overflow-hidden bg-terminal-bg scanlines">
      <Sidebar
        onLogout={handleLogout}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <ChatPanel
        loading={loading}
        wsConnected={wsConnected}
        onMenuOpen={() => setSidebarOpen(true)}
      />
    </div>
  )
}
