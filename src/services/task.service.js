import api from '../api/axios'
import { sanitizeForm } from '../utils/sanitize'
import { validateTask, isValid } from '../utils/validators'

const TaskService = {
  getAll: async () => {
    const { data } = await api.get('/task')
    return data
  },

  getById: async (id) => {
    const { data } = await api.get(`/task/${id}`)
    return data
  },

  create: async (task) => {
    const errors = validateTask(task)
    if (!isValid(errors)) throw { validationErrors: errors }
    const { data } = await api.post('/task', sanitizeForm(task))
    return data
  },

  update: async (id, task) => {
    const errors = validateTask(task)
    if (!isValid(errors)) throw { validationErrors: errors }
    const { data } = await api.put(`/task/${id}`, sanitizeForm(task))
    return data
  },

  remove: async (id) => {
    const { data } = await api.delete(`/task/${id}`)
    return data
  },
}

export default TaskService