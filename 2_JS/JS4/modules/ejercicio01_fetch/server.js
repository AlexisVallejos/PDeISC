/**
 * DOCUMENTACION PARA DEFENDER
 * Archivo: modules/ejercicio01_fetch/server.js
 * Rol: arranca el servidor especifico del punto 1 sin repetir infraestructura comun.
 * Idea clave: este archivo solo define puerto, titulo y raiz del ejercicio.
 * Como defenderlo: explicar que la configuracion queda separada de la logica compartida.
 * Validacion: el servidor compartido publica la pagina y las rutas del ejercicio.
 */
import path from "path";
import { fileURLToPath } from "url";
import { createExerciseServer } from "../shared/serverFactory.js";

// Resolve the exercise folder so the shared server factory can serve it.
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Launch point 1 using the shared server infrastructure.
createExerciseServer({
  port: 3401,
  title: "Punto 1 - Fetch y Axios",
  exerciseRoot: __dirname
});
