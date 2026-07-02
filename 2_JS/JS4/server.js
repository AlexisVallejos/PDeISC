/**
 * DOCUMENTACION PARA DEFENDER
 * Archivo: server.js
 * Rol: levanta el launcher principal y expone la lista de puntos del trabajo.
 * Idea clave: centraliza las rutas publicas y el catalogo de accesos para que el navegador funcione como portal.
 * Como defenderlo: mostrar que el launcher no contiene logica de negocio, solo organiza y publica enlaces.
 * Validacion: si /api/launcher responde bien, el panel puede construir las tarjetas de acceso.
 */
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

// Resolve the project root so the launcher can serve static files correctly.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 3400;

// Launcher data used to render the four exercise cards.
const launcherItems = [
  {
    id: "punto-1",
    titulo: "Punto 1",
    subtitulo: "Fetch y axios",
    descripcion: "Consulta la API publica con dos metodos distintos.",
    puerto: 3401,
    ruta: "http://localhost:3401"
  },
  {
    id: "punto-2",
    titulo: "Punto 2",
    subtitulo: "Formulario + POST",
    descripcion: "Valida en frontend y backend con respuesta de ID.",
    puerto: 3402,
    ruta: "http://localhost:3402"
  },
  {
    id: "punto-3",
    titulo: "Punto 3",
    subtitulo: "Busqueda con filter()",
    descripcion: "Carga usuarios una sola vez y filtra en tiempo real.",
    puerto: 3403,
    ruta: "http://localhost:3403"
  },
  {
    id: "punto-4",
    titulo: "Punto 4",
    subtitulo: "Fetch y Axios",
    descripcion: "Compara dos formas de consumir la API propia de alumnos.",
    puerto: 3404,
    ruta: "http://localhost:3404"
  }
];

// Serve the launcher page assets.
app.use(express.static(path.join(__dirname, "pages")));
app.use("/styles", express.static(path.join(__dirname, "styles")));
app.use("/scripts", express.static(path.join(__dirname, "scripts")));
app.use("/shared", express.static(path.join(__dirname, "modules", "shared", "public")));

// Return the launcher HTML on the root route.
app.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname, "pages", "index.html"));
});

// Return the launcher catalog to the frontend.
app.get("/api/launcher", (_req, res) => {
  res.json(launcherItems);
});

// Start the main launcher server.
app.listen(PORT, () => {
  console.log(`Launcher JS4 activo en http://localhost:${PORT}`);
});
