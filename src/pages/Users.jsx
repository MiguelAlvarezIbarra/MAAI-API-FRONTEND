import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import UserService from '../services/user.service'
import { validateUser, isValid } from '../utils/validators'
import { containsScript, sanitizeObject } from '../utils/sanitize'

const emptyForm = { name: '', lastname: '', username: '', password: '', rol_id: null }

export default function Users() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [editId, setEditId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [apiError, setApiError] = useState('')
  const [deleteError, setDeleteError] = useState('')

  const fetchUsers = async () => {
    try {
      const data = await UserService.getAll()
      setUsers(data)
    } catch {
      setApiError('Error al cargar los usuarios')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchUsers() }, [])

  const openCreate = () => {
    setForm(emptyForm)
    setErrors({})
    setEditId(null)
    setApiError('')
    setShowModal(true)
  }

  const openEdit = (user) => {
    setForm({ name: user.name, lastname: user.lastname || '', username: user.username, password: '', rol_id: user.rol_id ?? null })
    setErrors({})
    setEditId(user.id)
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
    const { name, value } = e.target

    // Prevenir scripts maliciosos
    if (containsScript(value)) return

    const updated = { ...form, [name]: value }
    setForm(updated)

    // Limpiar error al corregir
    if (errors[name]) {
      const newErrors = { ...errors }
      delete newErrors[name]
      setErrors(newErrors)
    }
  }

  // Validar al perder foco
  const handleBlur = (e) => {
    const { name } = e.target
    const fieldErrors = validateUser(form, !!editId)
    if (fieldErrors[name]) {
      setErrors(prev => ({ ...prev, [name]: fieldErrors[name] }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validar formulario completo
    const formErrors = validateUser(form, !!editId)
    if (!isValid(formErrors)) {
      setErrors(formErrors)
      return
    }

    setSaving(true)
    setApiError('')

    try {
      // Sanitizar datos antes de enviar
      const sanitized = sanitizeObject(form)

      if (editId) {
        const payload = {
          name: sanitized.name,
          lastname: sanitized.lastname,
          username: sanitized.username,
          rol_id: form.rol_id ? Number(form.rol_id) : null
        }
        if (form.password) payload.password = form.password
        await UserService.update(editId, payload)
      } else {
        await UserService.create({
          ...sanitized,
          rol_id: form.rol_id ? Number(form.rol_id) : null
        })
      }
      await fetchUsers()
      closeModal()
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.message
      setApiError(Array.isArray(msg) ? msg[0] : msg || 'Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    setDeleteError('')
    if (!confirm('¿Eliminar este usuario?')) return
    try {
      await UserService.remove(id)
      setUsers(users.filter(u => u.id !== id))
    } catch (err) {
      const msg = err.response?.data?.error
      setDeleteError(Array.isArray(msg) ? msg[0] : msg || 'Error al eliminar el usuario')
      setTimeout(() => setDeleteError(''), 5000)
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
            <h2 className="font-display text-3xl text-slate-100">Usuarios</h2>
            <p className="text-slate-500 text-sm mt-1">
              {users.length} usuario{users.length !== 1 ? 's' : ''} registrado{users.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button onClick={openCreate} className="btn-primary flex items-center gap-2">
            <span className="text-lg leading-none">+</span>
            Nuevo usuario
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
          ) : users.length === 0 ? (
            <div className="text-center py-20 text-slate-500">
              <p className="text-4xl mb-3">👤</p>
              <p>No hay usuarios registrados</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-navy-700">
                  <th className="text-left px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Usuario</th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Nombre completo</th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Rol</th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Creado</th>
                  <th className="px-6 py-4" />
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id} className="table-row">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-navy-700 border border-navy-600 flex items-center justify-center flex-shrink-0">
                          <span className="text-gold-400 text-xs font-semibold font-display">
                            {user.name?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="text-slate-300 text-sm font-medium">@{user.username}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-300 text-sm">{user.name} {user.lastname}</td>
                    <td className="px-6 py-4">
                      <span className={user.rol_id === 1 ? 'badge-admin' : 'badge-user'}>
                        {user.rol_id === 1 ? 'Administrador' : 'Empleado'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-sm">{formatDate(user.created_dt)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 justify-end">
                        <button onClick={() => openEdit(user)} className="btn-secondary px-3 py-1.5 text-xs">
                          Editar
                        </button>
                        <button onClick={() => handleDelete(user.id)} className="btn-danger px-3 py-1.5 text-xs">
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
                {editId ? 'Editar usuario' : 'Nuevo usuario'}
              </h3>
              <button onClick={closeModal} className="text-slate-500 hover:text-slate-300 transition-colors text-xl leading-none">×</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {/* Nombre y Apellido */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5 tracking-wider uppercase">Nombre</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`input-field ${errors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-500/30' : ''}`}
                    placeholder="Nombre"
                    maxLength={150}
                  />
                  {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5 tracking-wider uppercase">Apellido</label>
                  <input
                    type="text"
                    name="lastname"
                    value={form.lastname}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`input-field ${errors.lastname ? 'border-red-500 focus:border-red-500 focus:ring-red-500/30' : ''}`}
                    placeholder="Apellido"
                    maxLength={400}
                  />
                  {errors.lastname && <p className="text-red-400 text-xs mt-1">{errors.lastname}</p>}
                </div>
              </div>

              {/* Username */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5 tracking-wider uppercase">Username</label>
                <input
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`input-field ${errors.username ? 'border-red-500 focus:border-red-500 focus:ring-red-500/30' : ''}`}
                  placeholder="usuario123"
                  maxLength={100}
                />
                {errors.username && <p className="text-red-400 text-xs mt-1">{errors.username}</p>}
              </div>

              {/* Rol */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5 tracking-wider uppercase">Rol</label>
                <select
                  name="rol_id"
                  value={form.rol_id ?? ''}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="">Sin rol (Empleado)</option>
                  <option value="1">Administrador</option>
                </select>
              </div>

              {/* Contraseña */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5 tracking-wider uppercase">
                  Contraseña{' '}
                  {editId && <span className="text-slate-500 normal-case font-normal">(dejar vacío para no cambiar)</span>}
                </label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`input-field ${errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500/30' : ''}`}
                  placeholder="••••••••"
                  maxLength={100}
                />
                {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
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
                    : (editId ? 'Guardar cambios' : 'Crear usuario')
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
