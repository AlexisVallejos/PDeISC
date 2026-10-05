export const FILTROS = ['todas', 'pendientes', 'completadas']

// Un ?estado= desconocido en la URL vuelve a "todas" en lugar de dejar la lista vacía.
export function leerFiltro(parametros) {
  const estado = parametros.get('estado')
  return FILTROS.includes(estado) ? estado : 'todas'
}
