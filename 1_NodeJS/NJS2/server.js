/**
 * DOCUMENTACION PARA DEFENDER
 * Archivo: server.js
 * Rol: punto de entrada del sitio NJS2.
 * Idea clave: genera las paginas y delega el servidor estatico al modulo shared/staticServer.js.
 * Como defenderlo: este archivo queda atomizado en configuracion de rutas + arranque.
 * Validacion: el helper compartido maneja 404, CSS, HTML y errores internos.
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { generarSitio } from './modules/site/generarSitio.js';
import { startStaticSiteServer } from './modules/shared/staticServer.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = 3000;

const RUTAS = {
  '/': 'pages/index.html',
  '/calculo': 'pages/consigna1/calculo.html',
  '/archivos': 'pages/consigna2/archivos.html',
  '/vista.html': 'pages/consigna2/vista.html',
  '/url': 'pages/consigna3/url.html',
  '/npm': 'pages/consigna4/npm.html',
};

function printStartupInfo() {
  console.log('\n[NJS2] Servidor listo -> http://127.0.0.1:3000\n');
  console.log('  Paginas disponibles:');
  console.log('  /          -> Inicio');
  console.log('  /calculo   -> Consigna 1');
  console.log('  /archivos  -> Consigna 2');
  console.log('  /vista.html -> HTML generado');
  console.log('  /url       -> Consigna 3');
  console.log('  /npm       -> Consigna 4');
}

await generarSitio();

startStaticSiteServer({
  baseDir: __dirname,
  routes: RUTAS,
  port: PORT,
  onReady: printStartupInfo
});
