import path from "path";
import { fileURLToPath } from "url";
import { createExerciseServer } from "../shared/serverFactory.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const alumnos = [
  { id: 1, nombre: "Ana Gomez", email: "ana.gomez@escuela.com" },
  { id: 2, nombre: "Luis Perez", email: "luis.perez@escuela.com" },
  { id: 3, nombre: "Sofia Torres", email: "sofia.torres@escuela.com" },
  { id: 4, nombre: "Martin Lopez", email: "martin.lopez@escuela.com" }
];

createExerciseServer({
  port: 3404,
  title: "Punto 4 - Alumnos",
  exerciseRoot: __dirname,
  registerRoutes(app) {
    app.get("/api/alumnos", (_req, res) => {
      res.json(alumnos);
    });
  }
});
