/**
 * DOCUMENTACION PARA DEFENDER
 * Archivo: ejercicios/ejercicio4/ejercicio4.js
 * Rol: contiene la solucion principal de un ejercicio y puede exportar datos para usarla desde servidor o navegador.
 * Idea clave: mantener este codigo separado ayuda a explicar que hace cada parte sin mezclar responsabilidades.
 * Como defenderlo: explicar primero que datos entran, que proceso se aplica y que salida produce.
 * Validacion: remarcar donde se controlan errores para que la app no falle con datos incorrectos.
 */
import { pathToFileURL } from "node:url";

import { dividir, multiplicar, restar, sumar } from "./calculos.js";

export const resultadosEjercicio4 = [
  { expresion: "5 + 3", resultado: sumar(5, 3) },
  { expresion: "8 - 6", resultado: restar(8, 6) },
  { expresion: "3 * 11", resultado: multiplicar(3, 11) },
  { expresion: "30 / 5", resultado: dividir(30, 5) }
];

const esEjecucionDirecta =
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href;

if (esEjecucionDirecta) {
  for (const operacion of resultadosEjercicio4) {
    console.log(`${operacion.expresion} = ${operacion.resultado}`);
  }
}
