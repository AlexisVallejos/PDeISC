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
