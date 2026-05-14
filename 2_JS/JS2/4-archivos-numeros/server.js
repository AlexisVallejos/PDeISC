/**
 * Servidor estatico del Proyecto 4 (Archivos de numeros).
 *
 * Sirve la carpeta public/ con HTTP nativo. La lectura y descarga de archivos
 * txt se realiza en el navegador con JavaScript.
 */

const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 4004;
const publicDir = path.join(__dirname, "public");

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

const server = http.createServer((req, res) => {
    const urlPath = req.url === "/" ? "/index.html" : req.url;
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

server.listen(PORT, () => {
    console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
