/**
 * Servidor estático del Proyecto 3 (Almacén de Personas).
 *
 * Qué hace:
 *  - Levanta un servidor HTTP nativo (sin Express) en el puerto 4003.
 *  - Sirve los archivos de la carpeta `public/` al navegador.
 *  - Resuelve `/` como `/index.html`.
 *  - Aplica un MIME type correcto según la extensión del archivo.
 *
 * Por qué este proyecto NO procesa formularios en el server:
 *  - La persistencia es en `localStorage` del navegador, no en disco. Toda
 *    la lógica (lectura del form, validaciones, alta/baja, render) corre
 *    en public/js/almacen.js. El server solo entrega los archivos estáticos.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 4003;
const publicDir = path.join(__dirname, 'public');

// Tabla de extensiones soportadas → cabecera Content-Type a devolver.
const mimeTypes = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
    // `/` → `/index.html`.
    const urlPath = req.url === '/' ? '/index.html' : req.url;

    // Normalizamos y bloqueamos intentos de "../" para evitar leer archivos
    // fuera de `public/` (path traversal).
    const safePath = path.normalize(urlPath).replace(/^\.\.(?:[\/]|$)/, '');
    const filePath = path.join(publicDir, safePath);

    if (!filePath.startsWith(publicDir)) {
        res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('403 - Acceso denegado');
        return;
    }

    fs.readFile(filePath, (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
                res.end('404 - Archivo no encontrado');
                return;
            }
            res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end('500 - Error interno del servidor');
            return;
        }

        const ext = path.extname(filePath).toLowerCase();
        const contentType = mimeTypes[ext] || 'application/octet-stream';
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
    });
});

server.listen(PORT);
