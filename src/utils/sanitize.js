/**
 * Utilidades de sanitización — prevención XSS, SQL Injection y normalización
 */

/**
 * Elimina caracteres peligrosos para prevenir XSS
 */
export const sanitizeString = (value) => {
  if (typeof value !== 'string') return ''
  return value
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim()
}

/**
 * Sanitiza un objeto completo
 */
export const sanitizeObject = (obj) => {
  const sanitized = {}
  for (const key in obj) {
    if (typeof obj[key] === 'string') {
      sanitized[key] = sanitizeString(obj[key])
    } else {
      sanitized[key] = obj[key]
    }
  }
  return sanitized
}

/**
 * Previene inyección de scripts en inputs
 */
export const containsScript = (value) => {
  const scriptPattern = /<script|javascript:|on\w+=/i
  return scriptPattern.test(value)
}

/**
 * Normaliza espacios múltiples entre palabras
 * Ej: "Juan   Antonio" → "Juan Antonio"
 */
export const normalizeSpaces = (value) => {
  if (typeof value !== 'string') return ''
  return value.replace(/\s+/g, ' ').trim()
}

/**
 * Sanitiza y normaliza un formulario completo antes de enviarlo a la API
 * Aplica: trim, normalización de espacios y escape de caracteres peligrosos
 */
export const sanitizeForm = (form) => {
  const result = {}
  for (const key in form) {
    if (typeof form[key] === 'string') {
      result[key] = normalizeSpaces(sanitizeString(form[key]))
    } else {
      result[key] = form[key]
    }
  }
  return result
}