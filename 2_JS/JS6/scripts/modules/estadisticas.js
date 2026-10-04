// ARCHIVO: scripts/modules/estadisticas.js
// QUÉ HACE: lleva las estadísticas personales (ganadas, perdidas, racha y mejor racha) y las guarda
// en localStorage del navegador. Son solo del usuario en ese navegador: no pasan por el servidor.

const CLAVE = "js6-estadisticas"; // Nombre bajo el cual se guarda el objeto en localStorage.
const VACIAS = { ganadas: 0, perdidas: 0, racha: 0, mejorRacha: 0 }; // Valores iniciales de las estadísticas.

// Leo las estadísticas del navegador; si localStorage falla arranco de cero.
export function leerEstadisticas() {
  try {
    return { ...VACIAS, ...JSON.parse(localStorage.getItem(CLAVE) || "{}") }; // Mezclo los valores iniciales con lo guardado (por si falta algún campo).
  } catch {
    return { ...VACIAS }; // JSON dañado o localStorage bloqueado: empiezo de cero.
  }
}

// Sumo el resultado de una partida y actualizo la racha.
export function registrarResultado(gano) {
  const datos = leerEstadisticas(); // Parto de lo que ya había.
  if (gano) {
    datos.ganadas += 1; // Una victoria más.
    datos.racha += 1; // La racha de victorias seguidas crece.
    datos.mejorRacha = Math.max(datos.mejorRacha, datos.racha); // La mejor racha es la mayor que alcancé.
  } else {
    datos.perdidas += 1; // Una derrota más.
    datos.racha = 0; // Perder corta la racha.
  }
  try {
    localStorage.setItem(CLAVE, JSON.stringify(datos)); // localStorage solo guarda texto: convierto el objeto a JSON.
  } catch {
    // Sin almacenamiento las estadísticas valen solo para esta visita.
  }
  return datos; // Devuelvo los datos nuevos para redibujar los contadores.
}
