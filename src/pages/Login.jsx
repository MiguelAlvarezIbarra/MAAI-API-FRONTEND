import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, isAdmin } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { data } = await api.post('/auth/login', form)
      login(data.accessToken, data.refreshToken)
      // Redirigir según rol
      navigate(data.accessToken ? '/tasks' : '/login')
    } catch (err) {
      setError(err.response?.data?.message || 'Credenciales incorrectas')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Panel izquierdo decorativo */}
      <div className="hidden lg:flex w-1/2 bg-navy-900 border-r border-navy-700 flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 30% 40%, rgba(212,168,83,0.08) 0%, transparent 50%),
                              radial-gradient(circle at 70% 80%, rgba(22,41,82,0.6) 0%, transparent 40%)`
          }}
        />
        {/* Decoración geométrica */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 border border-gold-500/10 rounded-full" />
        <div className="absolute top-1/4 left-1/4 w-48 h-48 border border-gold-500/10 rounded-full translate-x-8 translate-y-8" />
        <div className="relative z-10 text-center px-12">
          <h1 className="font-display text-6xl text-gold-400 tracking-widest mb-4">MAAI</h1>
          <div className="w-16 h-px bg-gold-500/50 mx-auto mb-6" />
          <p className="text-slate-400 text-lg font-body leading-relaxed">
            Sistema de Gestión<br />
            <span className="text-slate-500 text-sm">Tareas y Usuarios</span>
          </p>
        </div>
        {/* Grid decorativo */}
        <div className="absolute bottom-0 left-0 right-0 h-32 opacity-5"
          style={{
            backgroundImage: 'linear-gradient(rgba(212,168,83,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(212,168,83,0.5) 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      {/* Panel de login */}
      <div className="flex-1 flex items-center justify-center px-8">
        <div className="w-full max-w-sm">
          <div className="mb-10">
            <h2 className="font-display text-4xl text-slate-100 mb-2">Bienvenido</h2>
            <p className="text-slate-500 text-sm">Ingresa tus credenciales para continuar</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5 tracking-wider uppercase">
                Usuario
              </label>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                className="input-field"
                placeholder="tu_usuario"
                autoComplete="username"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5 tracking-wider uppercase">
                Contraseña
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="input-field"
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
            </div>

            {error && (
              <div className="bg-red-900/30 border border-red-800/50 text-red-300 text-sm px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-navy-950 border-t-transparent rounded-full animate-spin" />
              ) : 'Iniciar sesión'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
