/**
 * Servidor estatico para Crear TXT.
 *
 * Sirve public/ y guarda una copia del archivo original en archivos-servidor/
 * cuando el navegador descarga el TXT.
 */

const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 4004;
const publicDir = path.join(__dirname, "public");
const serverDir = path.join(__dirname, "archivos-servidor");

const mimeTypes = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "application/javascript; charset=utf-8",
    ".txt": "text/plain; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon"
};

function responderJson(res, statusCode, data) {
    res.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify(data));
}

function normalizarNombreArchivo(nombreArchivo) {
    const nombre = path.basename(String(nombreArchivo || "numeros-originales.txt"));
    const seguro = nombre.replace(/[^a-zA-Z0-9._-]/g, "_");
    return seguro.toLowerCase().endsWith(".txt") ? seguro : `${seguro}.txt`;
}

function crearNombreBackend(nombreArchivo) {
    const extension = path.extname(nombreArchivo) || ".txt";
    const base = path.basename(nombreArchivo, extension);
    const fecha = new Date().toISOString().replace(/[:.]/g, "-");
    return `${base}-${fecha}${extension}`;
}

function guardarTxtEnServidor(req, res) {
    let body = "";

    req.on("data", (chunk) => {
        body += chunk;
        if (body.length > 1024 * 1024) req.destroy();
    });

    req.on("end", () => {
        let datos;

        try {
            datos = JSON.parse(body);
        } catch {
            responderJson(res, 400, { error: "JSON invalido" });
            return;
        }

        const nombreArchivo = crearNombreBackend(normalizarNombreArchivo(datos.nombreArchivo));
        const contenido = String(datos.contenido ?? "");

        if (!contenido.trim()) {
            responderJson(res, 400, { error: "El contenido no puede estar vacio" });
            return;
        }

        fs.mkdirSync(serverDir, { recursive: true });

        const archivoServidor = path.join(serverDir, nombreArchivo);

        fs.writeFile(archivoServidor, contenido, "utf8", (errServidor) => {
            if (errServidor) {
                responderJson(res, 500, { error: "No se pudo guardar en archivos-servidor" });
                return;
            }

            responderJson(res, 200, {
                ok: true,
                servidor: path.relative(__dirname, archivoServidor)
            });
        });
    });
}

const server = http.createServer((req, res) => {
    if (req.method === "POST" && req.url === "/api/guardar-txt") {
        guardarTxtEnServidor(req, res);
        return;
    }

    const urlPath = req.url === "/" ? "/page/index.html" : req.url;
    const safePath = path.normalize(urlPath).replace(/^\.\.(?:[\/\\]|$)/, "");
    const filePath = path.join(publicDir, safePath);

    if (!filePath.startsWith(publicDir)) {
        res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("403 - Acceso denegado");
        return;
    }

    fs.readFile(filePath, (err, data) => {
        if (err) {
            if (err.code === "ENOENT") {
                res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
                res.end("404 - Archivo no encontrado");
                return;
            }
            res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
            res.end("500 - Error interno del servidor");
            return;
        }

        const ext = path.extname(filePath).toLowerCase();
        res.writeHead(200, { "Content-Type": mimeTypes[ext] || "application/octet-stream" });
        res.end(data);
    });
});

server.on("error", (error) => {
    if (error.code === "EADDRINUSE") {
        console.error(`El puerto ${PORT} ya esta en uso. Cierra el otro servidor o cambia el puerto.`);
        process.exit(1);
    }

    console.error("No se pudo iniciar el servidor:", error.message);
    process.exit(1);
});

server.listen(PORT, () => {
    console.log(`Proyecto Crear TXT iniciado en http://localhost:${PORT}`);
});
