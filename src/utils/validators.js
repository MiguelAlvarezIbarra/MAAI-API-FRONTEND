/**
 * Utilidades de validación para formularios
 */

// Elimina espacios múltiples entre palabras
export const normalizeSpaces = (value) => value.replace(/\s+/g, ' ').trim()

// Solo letras y espacios simples (para nombre y apellido)
const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/

// Previene inyección SQL
const sqlInjectionRegex = /('|"|;|--|\/\*|\*\/|xp_|UNION|SELECT|INSERT|UPDATE|DELETE|DROP|ALTER|EXEC|EXECUTE)/i

/**
 * Valida si un valor contiene patrones de inyección SQL
 */
export const containsSQLInjection = (value) => sqlInjectionRegex.test(value)

/**
 * Valida campos del formulario de login
 */
export const validateLogin = ({ username, password }) => {
  const errors = {}

  if (!username || username.trim().length === 0) {
    errors.username = 'El usuario es requerido'
  } else if (username.trim().length < 3) {
    errors.username = 'El usuario debe tener al menos 3 caracteres'
  } else if (username.trim().length > 150) {
    errors.username = 'El usuario no puede exceder 150 caracteres'
  } else if (containsSQLInjection(username)) {
    errors.username = 'El usuario contiene caracteres no permitidos'
  }

  if (!password || password.length === 0) {
    errors.password = 'La contraseña es requerida'
  } else if (password.length < 6) {
    errors.password = 'La contraseña debe tener al menos 6 caracteres'
  }

  return errors
}

/**
 * Valida campos del formulario de tarea
 */
export const validateTask = ({ name, description }) => {
  const errors = {}

  if (!name || name.trim().length === 0) {
    errors.name = 'El nombre es requerido'
  } else if (normalizeSpaces(name).length < 3) {
    errors.name = 'El nombre debe tener al menos 3 caracteres'
  } else if (name.trim().length > 250) {
    errors.name = 'El nombre no puede exceder 250 caracteres'
  } else if (containsSQLInjection(name)) {
    errors.name = 'El nombre contiene caracteres no permitidos'
  }

  if (!description || description.trim().length === 0) {
    errors.description = 'La descripción es requerida'
  } else if (normalizeSpaces(description).length < 3) {
    errors.description = 'La descripción debe tener al menos 3 caracteres'
  } else if (description.trim().length > 200) {
    errors.description = 'La descripción no puede exceder 200 caracteres'
  } else if (containsSQLInjection(description)) {
    errors.description = 'La descripción contiene caracteres no permitidos'
  }

  return errors
}

/**
 * Valida campos del formulario de usuario
 */
export const validateUser = ({ name, lastname, username, password }, isEdit = false) => {
  const errors = {}

  // Nombre
  if (!name || name.trim().length === 0) {
    errors.name = 'El nombre es requerido'
  } else if (!nameRegex.test(name.trim())) {
    errors.name = 'El nombre solo puede contener letras'
  } else if (normalizeSpaces(name).length < 3) {
    errors.name = 'El nombre debe tener al menos 3 caracteres'
  } else if (name.trim().length > 150) {
    errors.name = 'El nombre no puede exceder 150 caracteres'
  } else if (containsSQLInjection(name)) {
    errors.name = 'El nombre contiene caracteres no permitidos'
  }

  // Apellido
  if (!lastname || lastname.trim().length === 0) {
    errors.lastname = 'El apellido es requerido'
  } else if (!nameRegex.test(lastname.trim())) {
    errors.lastname = 'El apellido solo puede contener letras'
  } else if (lastname.trim().length > 400) {
    errors.lastname = 'El apellido no puede exceder 400 caracteres'
  } else if (containsSQLInjection(lastname)) {
    errors.lastname = 'El apellido contiene caracteres no permitidos'
  }

  // Username
  if (!isEdit) {
    if (!username || username.trim().length === 0) {
      errors.username = 'El username es requerido'
    } else if (username.trim().length < 3) {
      errors.username = 'El username debe tener al menos 3 caracteres'
    } else if (username.trim().length > 100) {
      errors.username = 'El username no puede exceder 100 caracteres'
    } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      errors.username = 'El username solo puede contener letras, números y guiones bajos'
    } else if (containsSQLInjection(username)) {
      errors.username = 'El username contiene caracteres no permitidos'
    }
  }

  // Contraseña
  if (!isEdit && (!password || password.length === 0)) {
    errors.password = 'La contraseña es requerida'
  } else if (password && password.length > 0 && password.length < 6) {
    errors.password = 'La contraseña debe tener al menos 6 caracteres'
  }

  return errors
}

/**
 * Verifica si un objeto de errores está vacío
 */
export const isValid = (errors) => Object.keys(errors).length === 0