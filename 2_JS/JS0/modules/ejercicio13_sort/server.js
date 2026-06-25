/**
 * DOCUMENTACION PARA DEFENDER
 * Archivo: modules/ejercicio13_sort/server.js
 * Rol: configura el servidor especifico de este ejercicio JS0.
 * Idea clave: la logica comun del servidor fue atomizada en modules/shared/exerciseServer.js.
 * Como defenderlo: este archivo solo declara METHOD, PORT y la carpeta raiz del ejercicio.
 * Validacion: la lectura de body, rutas API y archivos estaticos se validan en el servidor compartido.
 */
import path from "node:path";
import { fileURLToPath } from "node:url";
import { startExerciseServer } from "../shared/exerciseServer.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = 3013;
const METHOD = "sort";

startExerciseServer({ port: PORT, method: METHOD, exerciseRoot: __dirname });