import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = 3000;

const ejercicios = [
  { método: "push", puerto: 3001, carpeta: "ejercicio01_push" },
  { método: "pop", puerto: 3002, carpeta: "ejercicio02_pop" },
  { método: "unshift", puerto: 3003, carpeta: "ejercicio03_unshift" },
  { método: "shift", puerto: 3004, carpeta: "ejercicio04_shift" },
  { método: "splice", puerto: 3005, carpeta: "ejercicio05_splice" },
  { método: "slice", puerto: 3006, carpeta: "ejercicio06_slice" },
  { método: "indexOf", puerto: 3007, carpeta: "ejercicio07_indexOf" },
  { método: "includes", puerto: 3008, carpeta: "ejercicio08_includes" },
  { método: "forEach", puerto: 3009, carpeta: "ejercicio09_forEach" },
  { método: "map", puerto: 3010, carpeta: "ejercicio10_map" },
  { método: "filter", puerto: 3011, carpeta: "ejercicio11_filter" },
  { método: "reduce", puerto: 3012, carpeta: "ejercicio12_reduce" },
  { método: "sort", puerto: 3013, carpeta: "ejercicio13_sort" },
  { método: "reverse", puerto: 3014, carpeta: "ejercicio14_reverse" },
  { método: "secreto", puerto: 3015, carpeta: "ejercicio15_secreto" }
];

function contentType(filePath) {
  const ext = path.extname(filePath);
  const map = {
    ".html": "text/html; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".json": "application/json; charset=utf-8"
  };
  return map[ext] || "text/plain; charset=utf-8";
}

function serveStatic(reqPath, res) {
  const rel = reqPath === "/" ? "/pages/index.html" : reqPath;
  const filePath = path.join(__dirname, rel);

  if (!filePath.startsWith(__dirname)) {
    res.writeHead(403, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify({ error: "Acceso denegado" }));
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "application/json; charset=utf-8" });
      res.end(JSON.stringify({ error: "Ruta no encontrada" }));
      return;
    }
    res.writeHead(200, { "Content-Type": contentType(filePath) });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (url.pathname === "/api/launcher") {
    res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify({ total: ejercicios.length, ejercicios }));
    return;
  }

  if (url.pathname === "/" || url.pathname.startsWith("/pages/") || url.pathname.startsWith("/scripts/") || url.pathname.startsWith("/styles/")) {
    serveStatic(url.pathname, res);
    return;
  }

  res.writeHead(404, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify({ error: "Ruta no encontrada" }));
});

server.listen(PORT, () => {
  console.log(`Launcher en http://localhost:${PORT}`);
});
