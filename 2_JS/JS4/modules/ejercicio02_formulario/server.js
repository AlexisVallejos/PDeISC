/**
 * DOCUMENTACION PARA DEFENDER
 * Archivo: modules/ejercicio02_formulario/server.js
 * Rol: arranca el servidor del formulario y registra la ruta POST de usuarios.
 * Idea clave: reutiliza la infraestructura comun y deja solo la validacion de negocio en este punto.
 * Como defenderlo: explicar que el modulo solo define la API del ejercicio y su puerto.
 * Validacion: el endpoint responde 201 cuando los datos pasan las reglas y 400 si no.
 */
import path from "path";
import { fileURLToPath } from "url";
import {
  createExerciseServer,
  validateEmail,
  validateName
} from "../shared/serverFactory.js";

// Resolve the exercise folder so the shared server factory can serve it.
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Launch point 2 and attach its custom POST route.
createExerciseServer({
  port: 3402,
  title: "Punto 2 - Formulario",
  exerciseRoot: __dirname,
  registerRoutes(app) {
    // Validate the incoming payload and respond with either errors or the created user.
    app.post("/api/usuarios", (req, res) => {
      const { nombre, email } = req.body;
      const errores = {
        nombre: validateName(nombre),
        email: validateEmail(email)
      };

      if (Object.values(errores).some(Boolean)) {
        return res.status(400).json({
          ok: false,
          mensaje: "Hay errores de validacion.",
          errores
        });
      }

      return res.status(201).json({
        ok: true,
        usuario: {
          id: Date.now(),
          nombre: nombre.trim(),
          email: email.trim().toLowerCase()
        }
      });
    });
  }
});
