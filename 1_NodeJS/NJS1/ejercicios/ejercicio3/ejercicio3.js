/**
 * DOCUMENTACION PARA DEFENDER
 * Archivo: ejercicios/ejercicio3/ejercicio3.js
 * Rol: contiene la solucion principal de un ejercicio y puede exportar datos para usarla desde servidor o navegador.
 * Idea clave: mantener este codigo separado ayuda a explicar que hace cada parte sin mezclar responsabilidades.
 * Como defenderlo: explicar primero que datos entran, que proceso se aplica y que salida produce.
 * Validacion: remarcar donde se controlan errores para que la app no falle con datos incorrectos.
 */
import { pathToFileURL } from "node:url";

// sumar: Agrupa una parte de la logica para que el archivo sea mas facil de leer y defender.
export function sumar(a, b) {
  return a + b;
}

// restar: Agrupa una parte de la logica para que el archivo sea mas facil de leer y defender.
export function restar(a, b) {
  return a - b;
}

// multiplicar: Agrupa una parte de la logica para que el archivo sea mas facil de leer y defender.
export function multiplicar(a, b) {
  return a * b;
}

// dividir: Agrupa una parte de la logica para que el archivo sea mas facil de leer y defender.
export function dividir(a, b) {
  return a / b;
}

export const resultadosEjercicio3 = [
  { expresion: "sumar(4, 5)", resultado: sumar(4, 5) },
  { expresion: "restar(3, 6)", resultado: restar(3, 6) },
  { expresion: "multiplicar(2, 7)", resultado: multiplicar(2, 7) },
  { expresion: "dividir(20, 4)", resultado: dividir(20, 4) }
];

const esEjecucionDirecta =
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href;

if (esEjecucionDirecta) {
  for (const operacion of resultadosEjercicio3) {
    console.log(operacion.resultado);
  }
}
