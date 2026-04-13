import { createContext, useContext, useState, useEffect } from 'react'
import api from '../api/axios'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verificar sesión activa al cargar la app
    api.get('/auth/me')
      .then(({ data }) => setUser(data))
      .catch(() => {
        setUser(null)
      })
      .finally(() => setLoading(false))
  }, [])

  const login = (userData) => setUser(userData)

  const logout = async () => {
    try {
      await api.post('/auth/logout')
    } catch {
      // Ignorar errores al cerrar sesión
    } finally {
      setUser(null)
    }
  }

  const isAdmin = () => user?.rol_id === 1

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)