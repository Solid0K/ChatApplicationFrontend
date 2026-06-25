import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT to every request if present
api.interceptors.request.use(config => {
  const token = localStorage.getItem('jwt_token')
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
})

// ── Auth ──────────────────────────────────────────────────────────────────────

export async function register({ username, password }) {
  const res = await api.post('/register', { username, password })
  return res.data
}

export async function loginUser({ username, password }) {
  const res = await api.post('/loginUser', { username, password })
  return res.data  // expected: { token: "...", username: "..." }
}

// ── Messages ──────────────────────────────────────────────────────────────────

export async function getMessages() {
  const res = await api.get('/getMessages')
  return res.data  // expected: array of message objects
}

// ── Users ─────────────────────────────────────────────────────────────────────

export async function getOnlineUsers() {
  const res = await api.get('/users/online')
  return res.data  // expected: array of username strings or user objects
}

export default api
