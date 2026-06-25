import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { register } from '../services/api'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const validate = () => {
    if (!form.username.trim()) return 'CALLSIGN REQUIRED'
    if (form.username.length < 3) return 'CALLSIGN MUST BE >= 3 CHARACTERS'
    if (!form.password) return 'CIPHER KEY REQUIRED'
    if (form.password.length < 6) return 'CIPHER KEY MUST BE >= 6 CHARACTERS'
    if (form.password !== form.confirm) return 'CIPHER KEYS DO NOT MATCH'
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationError = validate()
    if (validationError) { setError(validationError); return }
    setLoading(true)
    setError('')
    try {
      await register({ username: form.username, password: form.password })
      setSuccess(true)
      setTimeout(() => navigate('/login'), 2000)
    } catch (err) {
      const msg = err?.response?.data?.message || err?.response?.data || err?.message || 'REGISTRATION FAILED'
      setError(String(msg).toUpperCase())
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-terminal-bg flex items-center justify-center scanlines">
        <div className="border border-terminal-border bg-terminal-surface p-8 text-center max-w-sm">
          <div className="text-terminal-cyan-bright text-sm mb-2 tracking-widest">ACCESS GRANTED</div>
          <div className="text-terminal-text-dim text-xs">REDIRECTING TO LOGIN<span className="blink">_</span></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-terminal-bg flex items-center justify-center scanlines p-4">
      <div className="w-full max-w-sm">
        <div className="border border-terminal-border bg-terminal-surface p-6">

          <div className="text-center mb-6">
            <pre className="text-terminal-cyan text-xs leading-tight select-none">
{`╔════════════════════╗
║   REQUEST ACCESS   ║
║   NEW OPERATIVE    ║
╚════════════════════╝`}
            </pre>
            <p className="text-terminal-text-dim text-xs mt-3 tracking-widest">
              REGISTER NEW OPERATIVE
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-terminal-cyan text-xs mb-1 tracking-wider uppercase">
                Callsign (Username)
              </label>
              <input
                type="text"
                name="username"
                className="terminal-input"
                value={form.username}
                onChange={handleChange}
                placeholder="choose your callsign..."
                disabled={loading}
                autoComplete="username"
              />
            </div>

            <div>
              <label className="block text-terminal-cyan text-xs mb-1 tracking-wider uppercase">
                Cipher Key (Password)
              </label>
              <input
                type="password"
                name="password"
                className="terminal-input"
                value={form.password}
                onChange={handleChange}
                placeholder="choose cipher key..."
                disabled={loading}
                autoComplete="new-password"
              />
            </div>

            <div>
              <label className="block text-terminal-cyan text-xs mb-1 tracking-wider uppercase">
                Confirm Cipher Key
              </label>
              <input
                type="password"
                name="confirm"
                className="terminal-input"
                value={form.confirm}
                onChange={handleChange}
                placeholder="repeat cipher key..."
                disabled={loading}
                autoComplete="new-password"
              />
            </div>

            {error && (
              <div className="border border-terminal-error px-3 py-2 text-terminal-error-bright text-xs">
                [ERROR] {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="terminal-btn terminal-btn-primary w-full disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? 'PROCESSING...' : 'REGISTER OPERATIVE'}
            </button>
          </form>

          <div className="mt-4 border-t border-terminal-border pt-4 text-center">
            <span className="text-terminal-text-muted text-xs">ALREADY HAVE ACCESS? </span>
            <Link to="/login" className="text-terminal-cyan-bright text-xs hover:text-terminal-cyan-text transition-colors">
              AUTHENTICATE
            </Link>
          </div>
        </div>

        <div className="border-x border-b border-terminal-border px-4 py-2 bg-terminal-surface">
          <p className="text-terminal-text-muted text-xs text-center">
            ALL OPERATIVES SUBJECT TO MONITORING // CONDUCT ACCORDINGLY
          </p>
        </div>
      </div>
    </div>
  )
}
