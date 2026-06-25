import path from "path";
import { fileURLToPath } from "url";
import {
  createExerciseServer,
  validateEmail,
  validateName
} from "../shared/serverFactory.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

createExerciseServer({
  port: 3402,
  title: "Punto 2 - Formulario",
  exerciseRoot: __dirname,
  registerRoutes(app) {
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
