import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SHARED_PUBLIC = path.join(__dirname, "public");

const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ' ]{3,}$/;
const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

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

export function createExerciseServer({ port, title, exerciseRoot, registerRoutes }) {
  const app = express();
  const publicRoot = path.join(exerciseRoot, "public");

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use("/shared", express.static(SHARED_PUBLIC));
  app.use(express.static(publicRoot));

  app.get("/", (_req, res) => {
    res.sendFile(path.join(publicRoot, "index.html"));
  });

  if (registerRoutes) {
    registerRoutes(app);
  }

  app.listen(port, () => {
    console.log(`${title} corriendo en http://localhost:${port}`);
  });
}
