/**
 * DOCUMENTACION PARA DEFENDER
 * Archivo: modules/shared/serverFactory.js
 * Rol: concentra la fabrica de servidores reutilizable para todos los puntos JS4.
 * Idea clave: cada ejercicio aporta solo su configuracion y la fabrica resuelve express, static y rutas comunes.
 * Como defenderlo: explicar que el servidor compartido evita duplicar middleware y setup de archivos.
 * Validacion: la misma capa sirve para lanzar cada punto con su propia raiz y sus rutas extras.
 */
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

// Resolve the shared public folder used by every exercise.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SHARED_PUBLIC = path.join(__dirname, "public");

// Validation rules reused by the form exercise.
const nameRegex = /^[A-Za-z\u00C1\u00C9\u00CD\u00D3\u00DA\u00E1\u00E9\u00ED\u00F3\u00FA\u00D1\u00F1' ]{3,}$/;
const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

// Validate a person name and return an empty string when it is valid.
export function validateName(nombre = "") {
  const limpio = nombre.trim();

  if (!limpio) {
    return "El nombre es obligatorio.";
  }

  if (limpio.length < 3) {
    return "El nombre debe tener al menos 3 caracteres.";
  }

  if (!nameRegex.test(limpio)) {
    return "El nombre solo puede tener letras, espacios y apostrofes.";
  }

  return "";
}

// Validate an email address and return an empty string when it is valid.
export function validateEmail(email = "") {
  const limpio = email.trim();

  if (!limpio) {
    return "El email es obligatorio.";
  }

  if (!emailRegex.test(limpio)) {
    return "El email no tiene un formato valido.";
  }

  if (limpio.includes("..")) {
    return "El email no puede tener puntos consecutivos.";
  }

  return "";
}

// Create an Express server configured for one exercise folder.
export function createExerciseServer({ port, title, exerciseRoot, registerRoutes }) {
  const app = express();
  const publicRoot = path.join(exerciseRoot, "public");

  // Parse JSON and urlencoded bodies, then expose shared assets.
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use("/shared", express.static(SHARED_PUBLIC));
  app.use(express.static(publicRoot));

  // Serve the exercise homepage.
  app.get("/", (_req, res) => {
    res.sendFile(path.join(publicRoot, "index.html"));
  });

  // Let each exercise register its own custom routes.
  if (registerRoutes) {
    registerRoutes(app);
  }

  // Start listening on the selected port.
  app.listen(port, () => {
    console.log(`${title} corriendo en http://localhost:${port}`);
  });
}
