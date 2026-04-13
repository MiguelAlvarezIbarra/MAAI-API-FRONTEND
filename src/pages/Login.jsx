import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AuthService from '../services/auth.service'
import api from '../api/axios'
import { validateLogin, isValid } from '../utils/validators'
import { containsScript } from '../utils/sanitize'

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' })
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    if (containsScript(value)) return
    const updated = { ...form, [name]: value }
    setForm(updated)
    setApiError('')
    if (errors[name]) {
      const newErrors = { ...errors }
      delete newErrors[name]
      setErrors(newErrors)
    }
  }

  const handleBlur = (e) => {
    const { name } = e.target
    const fieldErrors = validateLogin(form)
    if (fieldErrors[name]) {
      setErrors(prev => ({ ...prev, [name]: fieldErrors[name] }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formErrors = validateLogin(form)
    if (!isValid(formErrors)) { setErrors(formErrors); return }

    setLoading(true)
    setApiError('')

    try {
      // Paso 1 — Login (guarda cookies en el navegador)
      await AuthService.login(form.username.trim(), form.password)
    } catch (err) {
      setApiError(err.response?.data?.message || 'Credenciales incorrectas')
      setLoading(false)
      return
    }

    try {
      // Paso 2 — Obtener datos del usuario con la cookie recién guardada
      const { data } = await api.get('/auth/me')
      login(data)
      navigate(data.rol_id === 1 ? '/users' : '/tasks')
    } catch (err) {
      console.error('Error al obtener perfil:', err)
      setApiError('Error al obtener datos del usuario, intenta de nuevo')
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

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5 tracking-wider uppercase">
                Usuario
              </label>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`input-field ${errors.username ? 'border-red-500 focus:border-red-500 focus:ring-red-500/30' : ''}`}
                placeholder="tu_usuario"
                autoComplete="username"
                maxLength={150}
              />
              {errors.username && (
                <p className="text-red-400 text-xs mt-1.5">{errors.username}</p>
              )}
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
                onBlur={handleBlur}
                className={`input-field ${errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500/30' : ''}`}
                placeholder="••••••••"
                autoComplete="current-password"
                maxLength={100}
              />
              {errors.password && (
                <p className="text-red-400 text-xs mt-1.5">{errors.password}</p>
              )}
            </div>

            {apiError && (
              <div className="bg-red-900/30 border border-red-800/50 text-red-300 text-sm px-4 py-3 rounded-lg">
                {apiError}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 mt-2"
            >
              {loading
                ? <div className="w-4 h-4 border-2 border-navy-950 border-t-transparent rounded-full animate-spin" />
                : 'Iniciar sesión'
              }
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}