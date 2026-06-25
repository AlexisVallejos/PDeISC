// Punto de entrada del proyecto.
// Antes de levantar el servidor, genera todos los HTML dentro de /pages.

import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { generarSitio } from './modules/site/generarSitio.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Cada ruta publica apunta a un archivo HTML ya generado en /pages.
const RUTAS = {
  '/': 'pages/index.html',
  '/calculo': 'pages/consigna1/calculo.html',
  '/archivos': 'pages/consigna2/archivos.html',
  '/vista.html': 'pages/consigna2/vista.html',
  '/url': 'pages/consigna3/url.html',
  '/npm': 'pages/consigna4/npm.html',
};

await generarSitio();

const server = createServer((req, res) => {
  // Los estilos se sirven como archivos estaticos.
  if (req.url?.startsWith('/styles/') && req.url.endsWith('.css')) {
    const css = readFileSync(path.join(__dirname, req.url), 'utf8');
    res.writeHead(200, { 'Content-Type': 'text/css; charset=utf-8' });
    res.end(css);
    return;
  }

  const archivo = RUTAS[req.url];

  // Si la ruta no existe en el mapa, responde 404.
  if (!archivo) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('404 - Pagina no encontrada');
    return;
  }

  try {
    // Lee y devuelve el HTML ya generado en disco.
    const html = readFileSync(path.join(__dirname, archivo), 'utf8');
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(html);
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end(`Error interno: ${err.message}`);
  }
});

server.listen(3000, '127.0.0.1', () => {
  console.log('\n[NJS2] Servidor listo -> http://127.0.0.1:3000\n');
  console.log('  Paginas disponibles:');
  console.log('  /          -> Inicio');
  console.log('  /calculo   -> Consigna 1');
  console.log('  /archivos  -> Consigna 2');
  console.log('  /vista.html -> HTML generado');
  console.log('  /url       -> Consigna 3');
  console.log('  /npm       -> Consigna 4');
});
