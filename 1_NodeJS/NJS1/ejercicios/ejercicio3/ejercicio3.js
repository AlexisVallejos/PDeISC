import { pathToFileURL } from "node:url";

export function sumar(a, b) {
  return a + b;
}

export function restar(a, b) {
  return a - b;
}

export function multiplicar(a, b) {
  return a * b;
}

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
