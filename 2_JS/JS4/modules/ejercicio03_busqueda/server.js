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

// Resuelve la carpeta del ejercicio para que la fabrica compartida pueda servirla.
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Levanta el punto 3 usando la infraestructura compartida del servidor.
createExerciseServer({
  port: 3403,
  title: "Punto 3 - Busqueda",
  exerciseRoot: __dirname
});
