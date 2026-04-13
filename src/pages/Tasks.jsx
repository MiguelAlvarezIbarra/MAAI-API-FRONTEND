import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import TaskService from '../services/task.service'
import { validateTask, isValid } from '../utils/validators'
import { containsScript, sanitizeObject } from '../utils/sanitize'

const emptyForm = { name: '', description: '', priority: false }

export default function Tasks() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [editId, setEditId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [apiError, setApiError] = useState('')
  const [deleteError, setDeleteError] = useState('')

  const fetchTasks = async () => {
    try {
      const data = await TaskService.getAll()
      setTasks(data)
    } catch {
      setApiError('Error al cargar las tareas')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchTasks() }, [])

  const openCreate = () => {
    setForm(emptyForm)
    setErrors({})
    setEditId(null)
    setApiError('')
    setShowModal(true)
  }

  const openEdit = (task) => {
    setForm({ name: task.name, description: task.description, priority: task.priority })
    setErrors({})
    setEditId(task.id)
    setApiError('')
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setForm(emptyForm)
    setErrors({})
    setEditId(null)
    setApiError('')
  }

  // Validación en tiempo real
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    const newValue = type === 'checkbox' ? checked : value

    // Prevenir scripts en inputs de texto
    if (type !== 'checkbox' && containsScript(value)) return

    const updated = { ...form, [name]: newValue }
    setForm(updated)

    // Limpiar error del campo al corregir
    if (errors[name]) {
      const newErrors = { ...errors }
      delete newErrors[name]
      setErrors(newErrors)
    }
  }

  // Validar al perder foco
  const handleBlur = (e) => {
    const { name } = e.target
    const fieldErrors = validateTask(form)
    if (fieldErrors[name]) {
      setErrors(prev => ({ ...prev, [name]: fieldErrors[name] }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validar formulario completo
    const formErrors = validateTask(form)
    if (!isValid(formErrors)) {
      setErrors(formErrors)
      return
    }

    setSaving(true)
    setApiError('')

    try {
      // Sanitizar datos antes de enviar
      const sanitized = sanitizeObject(form)
      const payload = { ...sanitized, priority: form.priority }

      if (editId) {
        await TaskService.update(editId, payload)
      } else {
        await TaskService.create(payload)
      }
      await fetchTasks()
      closeModal()
    } catch (err) {
      setApiError(err.response?.data?.message || 'Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    setDeleteError('')
    if (!confirm('¿Eliminar esta tarea?')) return
    try {
      await TaskService.remove(id)
      setTasks(tasks.filter(t => t.id !== id))
    } catch (err) {
      const msg = err.response?.data?.error
      setDeleteError(Array.isArray(msg) ? msg[0] : msg || 'Error al eliminar la tarea')
      setTimeout(() => setDeleteError(''), 4000)
    }
  }

  const formatDate = (d) => d
    ? new Date(d).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })
    : '—'

  return (
    <Layout>
      <div className="animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-display text-3xl text-slate-100">Tareas</h2>
            <p className="text-slate-500 text-sm mt-1">
              {tasks.length} tarea{tasks.length !== 1 ? 's' : ''} registrada{tasks.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button onClick={openCreate} className="btn-primary flex items-center gap-2">
            <span className="text-lg leading-none">+</span>
            Nueva tarea
          </button>
        </div>

        {/* Error de eliminación */}
        {deleteError && (
          <div className="mb-4 bg-red-900/30 border border-red-800/50 text-red-300 text-sm px-4 py-3 rounded-lg animate-fade-in">
            {deleteError}
          </div>
        )}

        {/* Tabla */}
        <div className="card p-0 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-20 text-slate-500">
              <p className="text-4xl mb-3">📋</p>
              <p>No hay tareas registradas</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-navy-700">
                  <th className="text-left px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Nombre</th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Descripción</th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Prioridad</th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Creada</th>
                  <th className="px-6 py-4" />
                </tr>
              </thead>
              <tbody>
                {tasks.map(task => (
                  <tr key={task.id} className="table-row">
                    <td className="px-6 py-4 text-slate-200 font-medium text-sm">{task.name}</td>
                    <td className="px-6 py-4 text-slate-400 text-sm max-w-xs truncate">{task.description}</td>
                    <td className="px-6 py-4">
                      <span className={task.priority
                        ? 'bg-amber-500/20 text-amber-400 text-xs px-2.5 py-1 rounded-full border border-amber-500/30'
                        : 'bg-slate-700/50 text-slate-400 text-xs px-2.5 py-1 rounded-full border border-slate-600/30'
                      }>
                        {task.priority ? 'Alta' : 'Normal'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-sm">{formatDate(task.created_dt)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 justify-end">
                        <button onClick={() => openEdit(task)} className="btn-secondary px-3 py-1.5 text-xs">
                          Editar
                        </button>
                        <button onClick={() => handleDelete(task.id)} className="btn-danger px-3 py-1.5 text-xs">
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="card w-full max-w-md animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-xl text-slate-100">
                {editId ? 'Editar tarea' : 'Nueva tarea'}
              </h3>
              <button onClick={closeModal} className="text-slate-500 hover:text-slate-300 transition-colors text-xl leading-none">×</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {/* Nombre */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5 tracking-wider uppercase">
                  Nombre
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`input-field ${errors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-500/30' : ''}`}
                  placeholder="Nombre de la tarea"
                  maxLength={250}
                />
                {errors.name && <p className="text-red-400 text-xs mt-1.5">{errors.name}</p>}
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5 tracking-wider uppercase">
                  Descripción
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`input-field resize-none ${errors.description ? 'border-red-500 focus:border-red-500 focus:ring-red-500/30' : ''}`}
                  rows={3}
                  placeholder="Descripción breve"
                  maxLength={200}
                />
                <div className="flex justify-between items-center mt-1">
                  {errors.description
                    ? <p className="text-red-400 text-xs">{errors.description}</p>
                    : <span />
                  }
                  {/* Contador de caracteres */}
                  <span className={`text-xs ${form.description.length > 180 ? 'text-amber-400' : 'text-slate-600'}`}>
                    {form.description.length}/200
                  </span>
                </div>
              </div>

              {/* Prioridad */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="priority"
                  name="priority"
                  checked={form.priority}
                  onChange={handleChange}
                  className="w-4 h-4 accent-yellow-500 cursor-pointer"
                />
                <label htmlFor="priority" className="text-sm text-slate-300 cursor-pointer">
                  Prioridad alta
                </label>
              </div>

              {/* Error de API */}
              {apiError && (
                <div className="bg-red-900/30 border border-red-800/50 text-red-300 text-sm px-4 py-3 rounded-lg">
                  {apiError}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeModal} className="btn-secondary flex-1">Cancelar</button>
                <button type="submit" disabled={saving} className="btn-primary flex-1 flex items-center justify-center gap-2">
                  {saving
                    ? <div className="w-4 h-4 border-2 border-navy-950 border-t-transparent rounded-full animate-spin" />
                    : (editId ? 'Guardar cambios' : 'Crear tarea')
                  }
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  )
}
