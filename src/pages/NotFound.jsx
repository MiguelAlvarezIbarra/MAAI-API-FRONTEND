import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function NotFound() {
  const navigate = useNavigate()
  const { user, isAdmin } = useAuth()

  const handleBack = () => {
    if (!user) navigate('/login')
    else navigate(isAdmin() ? '/users' : '/tasks')
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center animate-fade-in">
        {/* Número decorativo */}
        <div className="relative mb-6">
          <p className="font-display text-[10rem] leading-none text-navy-800 select-none">404</p>
          <p className="font-display text-[10rem] leading-none text-gold-500/10 select-none absolute inset-0 blur-sm">404</p>
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="font-display text-[10rem] leading-none text-gold-500/20 select-none">404</p>
          </div>
        </div>

        <div className="w-16 h-px bg-gold-500/40 mx-auto mb-6" />

        <h2 className="font-display text-3xl text-slate-200 mb-3">Página no encontrada</h2>
        <p className="text-slate-500 text-sm mb-8 max-w-xs mx-auto">
          La ruta que intentas acceder no existe o no tienes permisos para verla.
        </p>

        <button onClick={handleBack} className="btn-primary">
          Volver al inicio
        </button>
      </div>
    </div>
  )
}