/**
 * DOCUMENTACION PARA DEFENDER
 * Archivo: ejercicios/ejercicio1/server.js
 * Rol: configura el servidor visual de este ejercicio NJS1.
 * Idea clave: la logica repetida del servidor fue atomizada en ejercicios/shared/terminalServer.js.
 * Como defenderlo: este archivo solo aporta puerto, textos y datos que se muestran en pantalla.
 * Validacion: rutas, CSS, 404 y render HTML quedan centralizados en el helper compartido.
 */
import { fileURLToPath } from "node:url";
import { startTerminalServer } from "../shared/terminalServer.js";
import { mensajesEjercicio1 } from "./ejercicio1.js";

const PORT = 3001;
const BASE_DIR = fileURLToPath(new URL(".", import.meta.url));
const lines = mensajesEjercicio1;

startTerminalServer({
  port: PORT,
  baseDir: BASE_DIR,
  label: "Ejercicio 1",
  page: {
    pageTitle: "Node.js | Ejercicio 1",
    heading: "Ejercicio 1",
    subtitle: `Servidor Independiente en <strong>Puerto ${PORT}</strong>`,
    terminalTitle: "bash - node ejercicio1.js",
    lines
  }
});