import api from '../api/axios'
import { sanitizeForm } from '../utils/sanitize'
import { validateUser, isValid } from '../utils/validators'

const UserService = {
  getAll: async () => {
    const { data } = await api.get('/user')
    return data
  },

  getById: async (id) => {
    const { data } = await api.get(`/user/${id}`)
    return data
  },

  create: async (user) => {
    const errors = validateUser(user, false)
    if (!isValid(errors)) throw { validationErrors: errors }
    const sanitized = sanitizeForm(user)
    const { data } = await api.post('/user', {
      ...sanitized,
      rol_id: user.rol_id ? Number(user.rol_id) : null
    })
    return data
  },

  update: async (id, user) => {
    const errors = validateUser(user, true)
    if (!isValid(errors)) throw { validationErrors: errors }
    const sanitized = sanitizeForm(user)
    const payload = {
      name: sanitized.name,
      lastname: sanitized.lastname,
      rol_id: user.rol_id ? Number(user.rol_id) : null
    }
    if (user.password) payload.password = user.password
    const { data } = await api.put(`/user/${id}`, payload)
    return data
  },

  remove: async (id) => {
    const { data } = await api.delete(`/user/${id}`)
    return data
  },
}

export default UserService