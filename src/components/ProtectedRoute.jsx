import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Protege rutas que requieren autenticación
export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (!user) return <Navigate to="/login" replace />
  return children
}

// Protege rutas exclusivas de administrador
export function AdminRoute({ children }) {
  const { user, loading, isAdmin } = useAuth()

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (!user) return <Navigate to="/login" replace />
  if (!isAdmin()) return <Navigate to="/tasks" replace />
  return children
}
