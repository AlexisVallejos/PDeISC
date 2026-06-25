import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 3400;

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
    subtitulo: "API propia de alumnos",
    descripcion: "Consume una ruta de Express creada en el servidor del punto.",
    puerto: 3404,
    ruta: "http://localhost:3404"
  }
];

app.use(express.static(path.join(__dirname, "pages")));
app.use("/styles", express.static(path.join(__dirname, "styles")));
app.use("/scripts", express.static(path.join(__dirname, "scripts")));
app.use("/shared", express.static(path.join(__dirname, "modules", "shared", "public")));

app.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname, "pages", "index.html"));
});

app.get("/api/launcher", (_req, res) => {
  res.json(launcherItems);
});

app.listen(PORT, () => {
  console.log(`Launcher JS4 activo en http://localhost:${PORT}`);
});
