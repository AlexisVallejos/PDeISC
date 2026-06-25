/**
 * DOCUMENTACION PARA DEFENDER
 * Archivo: ejercicios/ejercicio2/server.js
 * Rol: configura el servidor visual de este ejercicio NJS1.
 * Idea clave: la logica repetida del servidor fue atomizada en ejercicios/shared/terminalServer.js.
 * Como defenderlo: este archivo solo aporta puerto, textos y datos que se muestran en pantalla.
 * Validacion: rutas, CSS, 404 y render HTML quedan centralizados en el helper compartido.
 */
import { fileURLToPath } from "node:url";
import { startTerminalServer } from "../shared/terminalServer.js";
import { resultadosEjercicio2 } from "./ejercicio2.js";

const PORT = 3002;
const BASE_DIR = fileURLToPath(new URL(".", import.meta.url));
const lines = resultadosEjercicio2.map((operacion) => operacion.resultado);

startTerminalServer({
  port: PORT,
  baseDir: BASE_DIR,
  label: "Ejercicio 2",
  page: {
    pageTitle: "Node.js | Ejercicio 2",
    heading: "Ejercicio 2",
    subtitle: `Calculadora Simple en <strong>Puerto ${PORT}</strong>`,
    terminalTitle: "bash - node ejercicio2.js",
    lines
  }
});