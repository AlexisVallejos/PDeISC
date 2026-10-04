// funciones para manejar fechas en formato DD/MM/AA

// devuelve la fecha de hoy ya formateada, la uso cuando se crea una tarea nueva
export function obtenerFechaHoy() {
  const hoy = new Date();
  return formatearFecha(hoy);
}

// recibe un objeto Date y lo devuelve como texto DD/MM/AA
export function formatearFecha(fecha) {
  const dia = String(fecha.getDate()).padStart(2, "0");
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  // uso los ultimos 2 digitos del año, como pide la consigna
  const anio = String(fecha.getFullYear()).slice(-2);

  return `${dia}/${mes}/${anio}`;
}
