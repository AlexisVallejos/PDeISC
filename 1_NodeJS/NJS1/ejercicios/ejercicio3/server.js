/**
 * DOCUMENTACION PARA DEFENDER
 * Archivo: ejercicios/ejercicio3/server.js
 * Rol: configura el servidor visual de este ejercicio NJS1.
 * Idea clave: la logica repetida del servidor fue atomizada en ejercicios/shared/terminalServer.js.
 * Como defenderlo: este archivo solo aporta puerto, textos y datos que se muestran en pantalla.
 * Validacion: rutas, CSS, 404 y render HTML quedan centralizados en el helper compartido.
 */
import { fileURLToPath } from "node:url";
import { startTerminalServer } from "../shared/terminalServer.js";
import { resultadosEjercicio3 } from "./ejercicio3.js";

const PORT = 3003;
const BASE_DIR = fileURLToPath(new URL(".", import.meta.url));
const lines = resultadosEjercicio3.map((operacion) => operacion.resultado);

startTerminalServer({
  port: PORT,
  baseDir: BASE_DIR,
  label: "Ejercicio 3",
  page: {
    pageTitle: "Node.js | Ejercicio 3",
    heading: "Ejercicio 3",
    subtitle: `Funciones Exportadas en <strong>Puerto ${PORT}</strong>`,
    terminalTitle: "bash - node ejercicio3.js",
    lines
  }
});