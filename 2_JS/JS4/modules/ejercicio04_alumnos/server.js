/**
 * DOCUMENTACION PARA DEFENDER
 * Archivo: modules/ejercicio04_alumnos/server.js
 * Rol: publica la API propia de alumnos usada por Fetch y Axios.
 * Idea clave: este punto no depende de una API externa, sino de una ruta controlada por el propio proyecto.
 * Como defenderlo: explicar que la misma respuesta JSON sirve para comparar dos clientes HTTP.
 * Validacion: /api/alumnos devuelve un arreglo estable y tipado para la pantalla del punto 4.
 */
import path from "path";
import { fileURLToPath } from "url";
import { createExerciseServer } from "../shared/serverFactory.js";

// Resolve the exercise folder so the shared server factory can serve it.
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Static list used by the local API.
const alumnos = [
  { id: 1, nombre: "Ana Gomez", email: "ana.gomez@escuela.com" },
  { id: 2, nombre: "Luis Perez", email: "luis.perez@escuela.com" },
  { id: 3, nombre: "Sofia Torres", email: "sofia.torres@escuela.com" },
  { id: 4, nombre: "Martin Lopez", email: "martin.lopez@escuela.com" }
];

// Launch point 4 and register the /api/alumnos endpoint.
createExerciseServer({
  port: 3404,
  title: "Punto 4 - Alumnos",
  exerciseRoot: __dirname,
  registerRoutes(app) {
    // Return the in-memory student list as JSON.
    app.get("/api/alumnos", (_req, res) => {
      res.json(alumnos);
    });
  }
});
