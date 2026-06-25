import path from "path";
import { fileURLToPath } from "url";
import { createExerciseServer } from "../shared/serverFactory.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

createExerciseServer({
  port: 3401,
  title: "Punto 1 - Fetch y Axios",
  exerciseRoot: __dirname
});
