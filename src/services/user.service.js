/**
 * Servicio de usuarios
 * Centraliza todas las llamadas a la API relacionadas con usuarios
 */
import api from '../api/axios'

const UserService = {
  /**
   * Obtiene todos los usuarios (solo admin)
   * @returns {Promise<User[]>}
   */
  getAll: async () => {
    const { data } = await api.get('/user')
    return data
  },

  /**
   * Obtiene un usuario por ID
   * @param {number} id
   * @returns {Promise<User>}
   */
  getById: async (id) => {
    const { data } = await api.get(`/user/${id}`)
    return data
  },

  /**
   * Crea un nuevo usuario
   * @param {object} user - { name, lastname, username, password, rol_id }
   * @returns {Promise<User>}
   */
  create: async (user) => {
    const { data } = await api.post('/user', user)
    return data
  },

  /**
   * Actualiza un usuario existente
   * @param {number} id
   * @param {object} user - { name, lastname, username, password?, rol_id }
   * @returns {Promise<User>}
   */
  update: async (id, user) => {
    const { data } = await api.put(`/user/${id}`, user)
    return data
  },

  /**
   * Elimina un usuario por ID
   * Solo permite eliminar usuarios sin tareas pendientes
   * @param {number} id
   * @returns {Promise<boolean>}
   */
  remove: async (id) => {
    const { data } = await api.delete(`/user/${id}`)
    return data
  },
}

export default UserService
