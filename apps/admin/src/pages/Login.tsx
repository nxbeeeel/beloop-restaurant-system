import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/auth'

export default function Login() {
  const [email, setEmail] = useState('beloopstore@gmail.com')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const setAuth = useAuthStore((s) => s.setAuth)
  const navigate = useNavigate()

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      // Simple dev login - replace with actual API call later
      if (email === 'beloopstore@gmail.com' && password === 'admin123') {
        setTimeout(() => {
          setAuth('dev-token', { name: 'Beloop Admin', role: 'admin' })
          setLoading(false)
          navigate('/')
        }, 600)
      } else {
        setError('Invalid email or password. Use: beloopstore@gmail.com / admin123')
        setLoading(false)
      }
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Login failed')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-sm border border-slate-200 shadow-xl rounded-2xl p-8">
        <div className="text-center mb-6">
          <div className="mx-auto h-12 w-12 rounded-xl bg-sky-500/10 flex items-center justify-center mb-3">
            <span className="text-sky-600 text-xl font-bold">B</span>
          </div>
          <h1 className="text-xl font-semibold text-slate-900">Beloop Admin</h1>
          <p className="text-sm text-slate-500">Sign in to continue</p>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              placeholder="admin@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              placeholder="••••••••"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center rounded-lg bg-sky-600 text-white font-medium py-2.5 hover:bg-sky-700 transition disabled:opacity-60"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}
