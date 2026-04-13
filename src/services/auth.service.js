/**
 * Servicio de autenticación
 * Centraliza todas las llamadas a la API relacionadas con auth
 */
import api from '../api/axios'

const AuthService = {
  /**
   * Inicia sesión con username y password
   * @param {string} username
   * @param {string} password
   * @returns {Promise<{accessToken, refreshToken}>}
   */
  login: async (username, password) => {
  await api.post('/auth/login', { username, password })
  },

  /**
   * Cierra la sesión del usuario
   * @returns {Promise}
   */
  logout: async () => {
    await api.post('/auth/logout')
  },

  /**
   * Refresca el access token usando el refresh token
   * @returns {Promise<{accessToken, refreshToken}>}
   */
  refresh: async () => {
    const { data } = await api.post('/auth/refresh-token')
    return data
  },
}

export default AuthService
