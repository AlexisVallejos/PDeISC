import path from "path";
import { fileURLToPath } from "url";
import { createExerciseServer } from "../shared/serverFactory.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

createExerciseServer({
  port: 3403,
  title: "Punto 3 - Busqueda",
  exerciseRoot: __dirname
});
