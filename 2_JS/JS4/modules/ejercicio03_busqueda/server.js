/**
 * DOCUMENTACION PARA DEFENDER
 * Archivo: modules/ejercicio03_busqueda/server.js
 * Rol: arranca el servidor del punto 3 usando la infraestructura compartida.
 * Idea clave: la pagina y las rutas del ejercicio quedan separadas de la configuracion de arranque.
 * Como defenderlo: explicar que este modulo solo define puerto, titulo y raiz del ejercicio.
 * Validacion: el servidor compartido publica el HTML, los scripts y el contenido estatico necesario.
 */
import path from "path";
import { fileURLToPath } from "url";
import { createExerciseServer } from "../shared/serverFactory.js";

// Resolve the exercise folder so the shared server factory can serve it.
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Launch point 3 using the shared server infrastructure.
createExerciseServer({
  port: 3403,
  title: "Punto 3 - Busqueda",
  exerciseRoot: __dirname
});
