/**
 * DOCUMENTACION PARA DEFENDER
 * Archivo: server.js
 * Rol: levanta el panel principal, expone la API REST y administra la base local alumnosDB.
 * Idea clave: la base, la API y la interfaz viven en una sola app coherente para cargar, ver y mantener alumnos.
 * Como defenderlo: mostrar que el frontend solo consume JSON, mientras el servidor crea la tabla y valida datos.
 * Validacion: la tabla alumnos existe al iniciar, la API responde JSON y las inserciones vuelven con IDs reales.
 */
import express from "express";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { DatabaseSync } from "node:sqlite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = Number(process.env.PORT || 3605);
const DB_DIR = path.join(__dirname, "database");
const DB_PATH = path.join(DB_DIR, "alumnosDB.sqlite");
const PUBLIC_DIRS = ["pages", "scripts", "styles"];

const SAMPLE_ALUMNOS = [
  { nombre: "Ana", apellido: "Gomez", edad: 20 },
  { nombre: "Lucas", apellido: "Perez", edad: 22 },
  { nombre: "Sofia", apellido: "Torres", edad: 19 },
  { nombre: "Martin", apellido: "Lopez", edad: 21 },
  { nombre: "Valentina", apellido: "Rios", edad: 23 }
];

// Create the data folder if it does not exist yet.
fs.mkdirSync(DB_DIR, { recursive: true });

// Open or create the SQLite database file alumnosDB.
const db = new DatabaseSync(DB_PATH);

// Build the schema once on startup.
db.exec(`
  CREATE TABLE IF NOT EXISTS alumnos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    apellido TEXT NOT NULL,
    edad INTEGER NOT NULL CHECK (edad > 0)
  );
`);

// Prepared statements keep the API logic compact and fast.
const insertAlumnoStmt = db.prepare(
  "INSERT INTO alumnos (nombre, apellido, edad) VALUES (@nombre, @apellido, @edad)"
);
const selectAlumnosStmt = db.prepare(
  "SELECT id, nombre, apellido, edad FROM alumnos ORDER BY id ASC"
);
const countAlumnosStmt = db.prepare("SELECT COUNT(*) AS total FROM alumnos");
const clearAlumnosStmt = db.prepare("DELETE FROM alumnos");
const maxIdStmt = db.prepare("SELECT COALESCE(MAX(id), 0) AS maxId FROM alumnos");

// Validate the payload for the REST API before inserting rows.
function validateAlumno(payload = {}) {
  const nombre = String(payload.nombre || "").trim();
  const apellido = String(payload.apellido || "").trim();
  const edad = Number(payload.edad);

  if (!nombre) return "El nombre es obligatorio.";
  if (!apellido) return "El apellido es obligatorio.";
  if (!Number.isInteger(edad) || edad <= 0) return "La edad debe ser un entero mayor a 0.";

  return "";
}

// Return all students from the database.
function getAllAlumnos() {
  return selectAlumnosStmt.all();
}

// Return a compact stats object for the dashboard.
function getStats() {
  const total = countAlumnosStmt.get().total;
  const maxId = maxIdStmt.get().maxId;
  return {
    dbName: "alumnosDB",
    dbPath: DB_PATH,
    total,
    lastId: maxId
  };
}

// Replace the current table content with the sample dataset.
function seedDemoData() {
  db.exec("BEGIN TRANSACTION");
  try {
    clearAlumnosStmt.run();
    for (const alumno of SAMPLE_ALUMNOS) {
      insertAlumnoStmt.run(alumno);
    }
    db.exec("COMMIT");
    return getAllAlumnos();
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}

// Serve the static frontend assets.
for (const dir of PUBLIC_DIRS) {
  app.use(`/${dir}`, express.static(path.join(__dirname, dir)));
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Send the main page.
app.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname, "pages", "index.html"));
});

// Expose the current students as JSON.
app.get("/api/alumnos", (_req, res) => {
  res.json({ ok: true, total: getAllAlumnos().length, alumnos: getAllAlumnos() });
});

// Expose basic metadata for the dashboard.
app.get("/api/stats", (_req, res) => {
  res.json({ ok: true, ...getStats() });
});

// Insert one student through the REST API.
app.post("/api/alumnos", (_req, res) => {
  const error = validateAlumno(_req.body);
  if (error) {
    return res.status(400).json({ ok: false, message: error });
  }

  const nombre = String(_req.body.nombre).trim();
  const apellido = String(_req.body.apellido).trim();
  const edad = Number(_req.body.edad);
  const result = insertAlumnoStmt.run({ nombre, apellido, edad });

  return res.status(201).json({
    ok: true,
    message: "Alumno creado correctamente.",
    alumno: {
      id: Number(result.lastInsertRowid),
      nombre,
      apellido,
      edad
    }
  });
});

// Load the five demo students on demand from the UI.
app.post("/api/alumnos/seed", (_req, res) => {
  const alumnos = seedDemoData();
  res.status(201).json({
    ok: true,
    message: "Se cargaron los 5 alumnos de ejemplo.",
    total: alumnos.length,
    alumnos
  });
});

// Clear the table when the user wants to start from zero.
app.delete("/api/alumnos", (_req, res) => {
  const before = countAlumnosStmt.get().total;
  clearAlumnosStmt.run();
  res.json({
    ok: true,
    message: "La tabla quedó vacía.",
    deleted: before
  });
});

// Start the server and fall back to the next port if the default is busy.
function listenWithFallback(port, remainingAttempts = 10) {
  const server = app.listen(port, () => {
    console.log(`JS5 activo en http://localhost:${port}`);
    console.log(`Base local: ${DB_PATH}`);
  });

  server.on("error", (error) => {
    if (error.code === "EADDRINUSE" && remainingAttempts > 0) {
      const nextPort = port + 1;
      console.warn(`Puerto ${port} ocupado, probando ${nextPort}...`);
      listenWithFallback(nextPort, remainingAttempts - 1);
      return;
    }

    throw error;
  });
}

listenWithFallback(PORT);
