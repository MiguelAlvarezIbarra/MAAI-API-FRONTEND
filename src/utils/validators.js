/**
 * Utilidades de validación para formularios
 */

/**
 * Valida campos del formulario de login
 * @param {object} form - { username, password }
 * @returns {object} errores encontrados
 */
export const validateLogin = ({ username, password }) => {
  const errors = {}

  if (!username || username.trim().length === 0) {
    errors.username = 'El usuario es requerido'
  } else if (username.trim().length < 3) {
    errors.username = 'El usuario debe tener al menos 3 caracteres'
  } else if (username.trim().length > 150) {
    errors.username = 'El usuario no puede exceder 150 caracteres'
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
 * @param {object} form - { name, description, priority }
 * @returns {object} errores encontrados
 */
export const validateTask = ({ name, description }) => {
  const errors = {}

  if (!name || name.trim().length === 0) {
    errors.name = 'El nombre es requerido'
  } else if (name.trim().length < 3) {
    errors.name = 'El nombre debe tener al menos 3 caracteres'
  } else if (name.trim().length > 250) {
    errors.name = 'El nombre no puede exceder 250 caracteres'
  }

  if (!description || description.trim().length === 0) {
    errors.description = 'La descripción es requerida'
  } else if (description.trim().length < 3) {
    errors.description = 'La descripción debe tener al menos 3 caracteres'
  } else if (description.trim().length > 200) {
    errors.description = 'La descripción no puede exceder 200 caracteres'
  }

  return errors
}

/**
 * Valida campos del formulario de usuario
 * @param {object} form - { name, lastname, username, password }
 * @param {boolean} isEdit - si es edición (password opcional)
 * @returns {object} errores encontrados
 */
export const validateUser = ({ name, lastname, username, password }, isEdit = false) => {
  const errors = {}

  if (!name || name.trim().length === 0) {
    errors.name = 'El nombre es requerido'
  } else if (name.trim().length < 3) {
    errors.name = 'El nombre debe tener al menos 3 caracteres'
  } else if (name.trim().length > 150) {
    errors.name = 'El nombre no puede exceder 150 caracteres'
  }

  if (!lastname || lastname.trim().length === 0) {
    errors.lastname = 'El apellido es requerido'
  } else if (lastname.trim().length > 400) {
    errors.lastname = 'El apellido no puede exceder 400 caracteres'
  }

  if (!username || username.trim().length === 0) {
    errors.username = 'El username es requerido'
  } else if (username.trim().length < 3) {
    errors.username = 'El username debe tener al menos 3 caracteres'
  } else if (username.trim().length > 100) {
    errors.username = 'El username no puede exceder 100 caracteres'
  } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    errors.username = 'El username solo puede contener letras, números y guiones bajos'
  }

  if (!isEdit && (!password || password.length === 0)) {
    errors.password = 'La contraseña es requerida'
  } else if (password && password.length > 0 && password.length < 6) {
    errors.password = 'La contraseña debe tener al menos 6 caracteres'
  }

  return errors
}

/**
 * Verifica si un objeto de errores está vacío
 * @param {object} errors
 * @returns {boolean}
 */
export const isValid = (errors) => Object.keys(errors).length === 0
