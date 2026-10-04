// funciones de validacion para el formulario de tareas
// las separo aca para no llenar el componente de logica

export const TITULO_MIN = 3;
export const TITULO_MAX = 80;
export const DESCRIPCION_MIN = 10;
export const DESCRIPCION_MAX = 300;

// valida el titulo y devuelve un mensaje de error o cadena vacia si esta bien
export function validarTitulo(valor) {
  const limpio = valor.trim();

  if (limpio.length === 0) {
    return "El titulo es obligatorio.";
  }
  if (limpio.length < TITULO_MIN) {
    return `El titulo debe tener al menos ${TITULO_MIN} caracteres.`;
  }
  if (limpio.length > TITULO_MAX) {
    return `El titulo no puede superar los ${TITULO_MAX} caracteres.`;
  }
  return "";
}

// valida la descripcion, misma logica que el titulo pero con otros limites
export function validarDescripcion(valor) {
  const limpio = valor.trim();

  if (limpio.length === 0) {
    return "La descripcion es obligatoria.";
  }
  if (limpio.length < DESCRIPCION_MIN) {
    return `La descripcion debe tener al menos ${DESCRIPCION_MIN} caracteres.`;
  }
  if (limpio.length > DESCRIPCION_MAX) {
    return `La descripcion no puede superar los ${DESCRIPCION_MAX} caracteres.`;
  }
  return "";
}
