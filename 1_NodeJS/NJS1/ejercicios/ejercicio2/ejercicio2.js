/**
 * DOCUMENTACION PARA DEFENDER
 * Archivo: ejercicios/ejercicio2/ejercicio2.js
 * Rol: contiene la solucion principal de un ejercicio y puede exportar datos para usarla desde servidor o navegador.
 * Idea clave: mantener este codigo separado ayuda a explicar que hace cada parte sin mezclar responsabilidades.
 * Como defenderlo: explicar primero que datos entran, que proceso se aplica y que salida produce.
 * Validacion: remarcar donde se controlan errores para que la app no falle con datos incorrectos.
 */
import { pathToFileURL } from "node:url";

export const resultadosEjercicio2 = [
  { expresion: "4 + 5", resultado: 4 + 5 },
  { expresion: "3 - 6", resultado: 3 - 6 },
  { expresion: "2 * 7", resultado: 2 * 7 },
  { expresion: "20 / 4", resultado: 20 / 4 }
];

const esEjecucionDirecta =
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href;

if (esEjecucionDirecta) {
  for (const operacion of resultadosEjercicio2) {
    console.log(operacion.resultado);
  }
}
