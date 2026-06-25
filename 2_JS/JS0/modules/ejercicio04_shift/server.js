import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildExercisePayload, executeVariant, runSecretoCustom } from "../shared/exercisesCatalog.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = 3004;
const METHOD = "shift";

function contentType(filePath) {
  const ext = path.extname(filePath);
  const map = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".json": "application/json; charset=utf-8" };
  return map[ext] || "text/plain; charset=utf-8";
}

function serveStatic(reqPath, res) {
  const rel = reqPath === "/" ? "/public/index.html" : reqPath;
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
  const url = new URL(req.url, "http://" + req.headers.host);

  if (url.pathname === "/api/ejercicio" && req.method === "GET") {
    const payload = buildExercisePayload(METHOD);
    if (!payload) {
      res.writeHead(500, { "Content-Type": "application/json; charset=utf-8" });
      res.end(JSON.stringify({ error: "Método inválido" }));
      return;
    }
    res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify(payload));
    return;
  }

  if (url.pathname === "/api/ejecutar" && req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => { body += chunk; });
    req.on("end", () => {
      try {
        const data = JSON.parse(body || "{}");
        const result = executeVariant(METHOD, data.varianteId, data.inputs || {});
        if (!result.ok) {
          res.writeHead(400, { "Content-Type": "application/json; charset=utf-8" });
          res.end(JSON.stringify({ error: result.error }));
          return;
        }
        res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
        res.end(JSON.stringify(result));
      } catch {
        res.writeHead(400, { "Content-Type": "application/json; charset=utf-8" });
        res.end(JSON.stringify({ error: "JSON inválido" }));
      }
    });
    return;
  }

  if (METHOD === "secreto" && url.pathname === "/api/secreto/run" && req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => { body += chunk; });
    req.on("end", () => {
      try {
        const data = JSON.parse(body || "{}");
        const result = runSecretoCustom(data.texto, data.modo);
        if (!result.ok) {
          res.writeHead(400, { "Content-Type": "application/json; charset=utf-8" });
          res.end(JSON.stringify({ error: result.error }));
          return;
        }
        res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
        res.end(JSON.stringify(result));
      } catch {
        res.writeHead(400, { "Content-Type": "application/json; charset=utf-8" });
        res.end(JSON.stringify({ error: "JSON inválido" }));
      }
    });
    return;
  }

  if (url.pathname === "/" || url.pathname.startsWith("/public/")) {
    serveStatic(url.pathname, res);
    return;
  }

  res.writeHead(404, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify({ error: "Ruta no encontrada" }));
});

server.listen(PORT, () => {
  console.log("Ejercicio " + METHOD + " corriendo en http://localhost:" + PORT);
});
