/**
 * DOCUMENTACION PARA DEFENDER
 * Archivo: modules/shared/exerciseServer.js
 * Rol: concentra el servidor HTTP reutilizable de todos los ejercicios JS0.
 * Idea clave: cada ejercicio solo declara METHOD y PORT; las rutas, validaciones y archivos estaticos viven aca.
 * Como defenderlo: explicar que se separo infraestructura comun de configuracion especifica.
 * Validacion: centraliza respuestas JSON, lectura de body y control de rutas para evitar duplicacion.
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildExercisePayload, executeVariant, runSecretoCustom } from "./exercisesCatalog.js";

const SHARED_PUBLIC_ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "public");

// contentType: decide el encabezado correcto para que el navegador interprete cada archivo.
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

// sendJson: evita repetir writeHead + JSON.stringify en todas las rutas API.
function sendJson(res, status, payload) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload));
}

// safeJoin: arma una ruta y verifica que no salga de la carpeta permitida.
function safeJoin(root, reqPath) {
  const filePath = path.join(root, reqPath);
  return filePath.startsWith(root) ? filePath : null;
}

// serveFile: entrega un archivo fisico o responde error controlado.
function serveFile(root, reqPath, res) {
  const filePath = safeJoin(root, reqPath);
  if (!filePath) {
    sendJson(res, 403, { error: "Acceso denegado" });
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      sendJson(res, 404, { error: "Ruta no encontrada" });
      return;
    }
    res.writeHead(200, { "Content-Type": contentType(filePath) });
    res.end(data);
  });
}

// readJsonBody: junta los chunks del body y transforma el texto recibido en objeto JavaScript.
function readJsonBody(req, onSuccess, onError) {
  let body = "";
  req.on("data", (chunk) => { body += chunk; });
  req.on("end", () => {
    try {
      onSuccess(JSON.parse(body || "{}"));
    } catch {
      onError();
    }
  });
}

// createExerciseServer: crea un servidor para un ejercicio puntual usando configuracion minima.
export function createExerciseServer({ exerciseRoot, method }) {
  return http.createServer((req, res) => {
    const url = new URL(req.url, "http://" + req.headers.host);

    if (url.pathname === "/api/ejercicio" && req.method === "GET") {
      const payload = buildExercisePayload(method);
      sendJson(res, payload ? 200 : 500, payload || { error: "Metodo invalido" });
      return;
    }

    if (url.pathname === "/api/ejecutar" && req.method === "POST") {
      readJsonBody(
        req,
        (data) => {
          const result = executeVariant(method, data.varianteId, data.inputs || {});
          sendJson(res, result.ok ? 200 : 400, result.ok ? result : { error: result.error });
        },
        () => sendJson(res, 400, { error: "JSON invalido" })
      );
      return;
    }

    if (method === "secreto" && url.pathname === "/api/secreto/run" && req.method === "POST") {
      readJsonBody(
        req,
        (data) => {
          const result = runSecretoCustom(data.texto, data.modo);
          sendJson(res, result.ok ? 200 : 400, result.ok ? result : { error: result.error });
        },
        () => sendJson(res, 400, { error: "JSON invalido" })
      );
      return;
    }

    if (url.pathname === "/" || url.pathname.startsWith("/public/")) {
      const rel = url.pathname === "/" ? "/public/index.html" : url.pathname;
      serveFile(exerciseRoot, rel, res);
      return;
    }

    if (url.pathname.startsWith("/shared/")) {
      serveFile(SHARED_PUBLIC_ROOT, url.pathname.replace("/shared/", ""), res);
      return;
    }

    sendJson(res, 404, { error: "Ruta no encontrada" });
  });
}

// startExerciseServer: inicia el servidor y deja un mensaje consistente para todos los ejercicios.
export function startExerciseServer({ port, method, exerciseRoot }) {
  const server = createExerciseServer({ exerciseRoot, method });
  server.listen(port, () => {
    console.log("Ejercicio " + method + " corriendo en http://localhost:" + port);
  });
  return server;
}
