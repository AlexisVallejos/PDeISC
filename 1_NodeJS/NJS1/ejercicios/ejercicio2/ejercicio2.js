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
