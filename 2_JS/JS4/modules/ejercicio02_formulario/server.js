/**
 * DOCUMENTACION PARA DEFENDER
 * Archivo: modules/ejercicio02_formulario/server.js
 * Rol: arranca el servidor del formulario sin exponer una API propia.
 * Idea clave: la pagina se sirve localmente, pero el envio real ocurre contra JSONPlaceholder.
 * Como defenderlo: explicar que este modulo solo define el puerto y la pagina del ejercicio.
 * Validacion: el ID mostrado en pantalla es simulado y proviene de la respuesta fake de la API externa.
 */
import path from "path";
import { fileURLToPath } from "url";
import { createExerciseServer } from "../shared/serverFactory.js";

// Resuelve la carpeta del ejercicio para que la fabrica compartida pueda servirla.
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Levanta el punto 2 como pagina local sin rutas propias.
createExerciseServer({
  port: 3402,
  title: "Punto 2 - Formulario",
  exerciseRoot: __dirname
});
