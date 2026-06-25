import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { loginUser } from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.username.trim() || !form.password.trim()) {
      setError('USERNAME AND PASSWORD REQUIRED')
      return
    }
    setLoading(true)
    setError('')
    try {
      const data = await loginUser(form)
      const token = data.token || data.jwt || data.accessToken || data
      const user = data.username || form.username
      if (!token || typeof token !== 'string') throw new Error('Invalid token received')
      login(token, user)
      navigate('/chat', { replace: true })
    } catch (err) {
      const msg = err?.response?.data?.message || err?.response?.data || err?.message || 'AUTHENTICATION FAILED'
      setError(String(msg).toUpperCase())
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-terminal-bg flex items-center justify-center scanlines p-4">
      <div className="w-full max-w-sm">
        <div className="border border-terminal-border bg-terminal-surface p-6">

          {/* Header */}
          <div className="text-center mb-6">
            <pre className="text-terminal-cyan text-xs leading-tight select-none">
{`╔════════════════════╗
║   TERM-COMM v2.4   ║
║   SECURE TERMINAL  ║
╚════════════════════╝`}
            </pre>
            <p className="text-terminal-text-dim text-xs mt-3 tracking-widest">
              IDENTITY VERIFICATION REQUIRED
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-terminal-cyan text-xs mb-1 tracking-wider uppercase">
                Username
              </label>
              <input
                type="text"
                name="username"
                className="terminal-input"
                value={form.username}
                onChange={handleChange}
                placeholder="enter callsign..."
                disabled={loading}
                autoComplete="username"
              />
            </div>

            <div>
              <label className="block text-terminal-cyan text-xs mb-1 tracking-wider uppercase">
                Password
              </label>
              <input
                type="password"
                name="password"
                className="terminal-input"
                value={form.password}
                onChange={handleChange}
                placeholder="enter cipher key..."
                disabled={loading}
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div className="border border-terminal-error px-3 py-2 text-terminal-error-bright text-xs bg-terminal-surface">
                [ERROR] {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="terminal-btn terminal-btn-primary w-full disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? 'AUTHENTICATING...' : 'AUTHENTICATE'}
            </button>
          </form>

          <div className="mt-4 border-t border-terminal-border pt-4 text-center">
            <span className="text-terminal-text-muted text-xs">NO ACCESS CREDENTIALS? </span>
            <Link to="/register" className="text-terminal-cyan-bright text-xs hover:text-terminal-cyan-text transition-colors">
              REQUEST ACCESS
            </Link>
          </div>
        </div>

        <div className="border-x border-b border-terminal-border px-4 py-2 bg-terminal-surface">
          <p className="text-terminal-text-muted text-xs text-center">
            UNAUTHORIZED ACCESS PROHIBITED // ALL ACTIVITY LOGGED
          </p>
        </div>
      </div>
    </div>
  )
}
