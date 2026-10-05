export const TITULO_MIN = 3
export const TITULO_MAX = 80
export const DESCRIPCION_MIN = 10
export const DESCRIPCION_MAX = 300

export function validarTitulo(valor) {
  const texto = valor.trim()
  if (texto.length === 0) return 'El título es obligatorio.'
  if (texto.length < TITULO_MIN) return `El título debe tener al menos ${TITULO_MIN} caracteres.`
  if (texto.length > TITULO_MAX) return `El título no puede superar los ${TITULO_MAX} caracteres.`
  return ''
}

export function validarDescripcion(valor) {
  const texto = valor.trim()
  if (texto.length === 0) return 'La descripción es obligatoria.'
  if (texto.length < DESCRIPCION_MIN) return `La descripción debe tener al menos ${DESCRIPCION_MIN} caracteres.`
  if (texto.length > DESCRIPCION_MAX) return `La descripción no puede superar los ${DESCRIPCION_MAX} caracteres.`
  return ''
}
