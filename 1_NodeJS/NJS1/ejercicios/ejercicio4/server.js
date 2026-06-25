/**
 * DOCUMENTACION PARA DEFENDER
 * Archivo: ejercicios/ejercicio4/server.js
 * Rol: configura el servidor visual de este ejercicio NJS1.
 * Idea clave: la logica repetida del servidor fue atomizada en ejercicios/shared/terminalServer.js.
 * Como defenderlo: este archivo solo aporta puerto, textos y datos que se muestran en pantalla.
 * Validacion: rutas, CSS, 404 y render HTML quedan centralizados en el helper compartido.
 */
import { fileURLToPath } from "node:url";
import { startTerminalServer } from "../shared/terminalServer.js";
import { resultadosEjercicio4 } from "./ejercicio4.js";

const PORT = 3004;
const BASE_DIR = fileURLToPath(new URL(".", import.meta.url));
const lines = resultadosEjercicio4.map((operacion) => `${operacion.expresion} = ${operacion.resultado}`);

startTerminalServer({
  port: PORT,
  baseDir: BASE_DIR,
  label: "Ejercicio 4",
  page: {
    pageTitle: "Node.js | Ejercicio 4",
    heading: "Ejercicio 4",
    subtitle: `Modulos Externos en <strong>Puerto ${PORT}</strong>`,
    terminalTitle: "bash - node ejercicio4.js",
    lines
  }
});