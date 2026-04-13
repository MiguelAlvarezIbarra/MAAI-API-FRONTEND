/**
 * Utilidades de sanitización para prevenir XSS e inyección de código
 */

/**
 * Elimina caracteres peligrosos de un string para prevenir XSS
 * @param {string} value - Valor a sanitizar
 * @returns {string} Valor sanitizado
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
 * Sanitiza un objeto completo recursivamente
 * @param {object} obj - Objeto a sanitizar
 * @returns {object} Objeto sanitizado
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
 * Previene que el usuario pegue scripts en inputs
 * @param {string} value
 * @returns {boolean}
 */
export const containsScript = (value) => {
  const scriptPattern = /<script|javascript:|on\w+=/i
  return scriptPattern.test(value)
}
