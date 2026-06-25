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
