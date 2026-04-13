/**
 * Servicio de tareas
 * Centraliza todas las llamadas a la API relacionadas con tareas
 */
import api from '../api/axios'

const TaskService = {
  /**
   * Obtiene todas las tareas del usuario en sesión
   * @returns {Promise<Task[]>}
   */
  getAll: async () => {
    const { data } = await api.get('/task')
    return data
  },

  /**
   * Obtiene una tarea por ID
   * @param {number} id
   * @returns {Promise<Task>}
   */
  getById: async (id) => {
    const { data } = await api.get(`/task/${id}`)
    return data
  },

  /**
   * Crea una nueva tarea
   * @param {object} task - { name, description, priority }
   * @returns {Promise<Task>}
   */
  create: async (task) => {
    const { data } = await api.post('/task', task)
    return data
  },

  /**
   * Actualiza una tarea existente
   * @param {number} id
   * @param {object} task - { name, description, priority }
   * @returns {Promise<Task>}
   */
  update: async (id, task) => {
    const { data } = await api.put(`/task/${id}`, task)
    return data
  },

  /**
   * Elimina una tarea por ID
   * @param {number} id
   * @returns {Promise<boolean>}
   */
  remove: async (id) => {
    const { data } = await api.delete(`/task/${id}`)
    return data
  },
}

export default TaskService
