/**
 * DOCUMENTACION PARA DEFENDER
 * Archivo: ejercicios/ejercicio1/ejercicio1.js
 * Rol: contiene la solucion principal de un ejercicio y puede exportar datos para usarla desde servidor o navegador.
 * Idea clave: mantener este codigo separado ayuda a explicar que hace cada parte sin mezclar responsabilidades.
 * Como defenderlo: explicar primero que datos entran, que proceso se aplica y que salida produce.
 * Validacion: remarcar donde se controlan errores para que la app no falle con datos incorrectos.
 */
import { pathToFileURL } from "node:url";

export const mensajesEjercicio1 = [
  "Hola mundo desde Node.js",
  "Fin"
];

const esEjecucionDirecta =
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href;

if (esEjecucionDirecta) {
  for (const mensaje of mensajesEjercicio1) {
    console.log(mensaje);
  }
}
