/**
 * DOCUMENTACION PARA DEFENDER
 * Archivo: modules/shared/staticServer.js
 * Rol: servidor estatico reutilizable para las paginas generadas de NJS2.
 * Idea clave: server.js no debe mezclar mapa de rutas con detalles de lectura y respuesta HTTP.
 * Como defenderlo: este modulo recibe rutas y baseDir, y se encarga de servir HTML/CSS.
 * Validacion: centraliza 404, errores internos y Content-Type.
 */
import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';
import path from 'node:path';

function sendText(res, status, message) {
  res.writeHead(status, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end(message);
}

function serveCss({ req, res, baseDir }) {
  const css = readFileSync(path.join(baseDir, req.url), 'utf8');
  res.writeHead(200, { 'Content-Type': 'text/css; charset=utf-8' });
  res.end(css);
}

function serveHtml({ res, baseDir, file }) {
  const html = readFileSync(path.join(baseDir, file), 'utf8');
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(html);
}

export function createStaticSiteServer({ baseDir, routes }) {
  return createServer((req, res) => {
    try {
      if (req.url?.startsWith('/styles/') && req.url.endsWith('.css')) {
        serveCss({ req, res, baseDir });
        return;
      }

      const file = routes[req.url];
      if (!file) {
        sendText(res, 404, '404 - Pagina no encontrada');
        return;
      }

      serveHtml({ res, baseDir, file });
    } catch (err) {
      sendText(res, 500, `Error interno: ${err.message}`);
    }
  });
}

export function startStaticSiteServer({ baseDir, routes, port, host = '127.0.0.1', onReady }) {
  const server = createStaticSiteServer({ baseDir, routes });
  server.listen(port, host, onReady);
  return server;
}
