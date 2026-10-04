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

// Resuelve la carpeta publica compartida usada por todos los ejercicios.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SHARED_PUBLIC = path.join(__dirname, "public");

// Reglas de validacion reutilizadas por el ejercicio del formulario.
const nameRegex = /^[A-Za-z\u00C1\u00C9\u00CD\u00D3\u00DA\u00E1\u00E9\u00ED\u00F3\u00FA\u00D1\u00F1' ]{3,}$/;
const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

// Valida un nombre de persona y devuelve una cadena vacia cuando es valido.
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

// Valida una direccion de correo y devuelve una cadena vacia cuando es valida.
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

// Crea un servidor Express configurado para una carpeta de ejercicio.
export function createExerciseServer({ port, title, exerciseRoot, registerRoutes }) {
  const app = express();
  const publicRoot = path.join(exerciseRoot, "public");

  // Analiza cuerpos JSON y urlencoded, y luego expone los recursos compartidos.
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use("/shared", express.static(SHARED_PUBLIC));
  app.use(express.static(publicRoot));

  // Sirve la pagina principal del ejercicio.
  app.get("/", (_req, res) => {
    res.sendFile(path.join(publicRoot, "index.html"));
  });

  // Permite que cada ejercicio registre sus propias rutas personalizadas.
  if (registerRoutes) {
    registerRoutes(app);
  }

  // Comienza a escuchar en el puerto seleccionado.
  app.listen(port, () => {
    console.log(`${title} corriendo en http://localhost:${port}`);
  });
}
