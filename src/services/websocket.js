const WS_BASE_URL = import.meta.env.VITE_WS_BASE_URL || 'ws://localhost:8080'
class WebSocketService {
  constructor() {
    this.ws = null
    this.listeners = new Set()
    this.reconnectTimer = null
    this.token = null
    this.shouldReconnect = false
    this.reconnectDelay = 2000
  }

  connect(token) {
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return
    }
    this.token = token
    this.shouldReconnect = true
    this._createSocket()
  }

  _createSocket() {
    const url = `${WS_BASE_URL}/chat?token=${this.token}`
    this.ws = new WebSocket(url)

    this.ws.onopen = () => {
      this.reconnectDelay = 2000
      this._emit({ type: 'CONNECTED' })
    }

    this.ws.onmessage = (event) => {
      // Always emit as RAW — let the hook handle all parsing and routing
      this._emit({ type: 'RAW', payload: event.data })
    }

    this.ws.onclose = (event) => {
      this._emit({ type: 'DISCONNECTED', code: event.code })
      if (this.shouldReconnect) {
        this.reconnectTimer = setTimeout(() => {
          this.reconnectDelay = Math.min(this.reconnectDelay * 1.5, 30000)
          this._createSocket()
        }, this.reconnectDelay)
      }
    }

    this.ws.onerror = () => {
      this._emit({ type: 'ERROR' })
    }
  }

  send(payload) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(payload))
    }
  }

  disconnect() {
    this.shouldReconnect = false
    clearTimeout(this.reconnectTimer)
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }

  subscribe(listener) {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  _emit(event) {
    this.listeners.forEach(fn => fn(event))
  }

  isConnected() {
    return this.ws && this.ws.readyState === WebSocket.OPEN
  }
}

const wsService = new WebSocketService()
export default wsService
