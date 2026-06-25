// Modulo de la consigna 2.
// Genera la vista HTML que se guarda en /pages/consigna2/vista.html
// y tambien el contenido de la pagina principal de la consigna.

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { escribirArchivo } from './archivos.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const RUTA_VISTA = path.join(__dirname, '..', '..', 'pages', 'consigna2', 'vista.html');

export function renderVistaHTML() {
  // HTML "real" que se escribe en disco para demostrar File System + HTTP.
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vista generada - NJS2</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <link rel="stylesheet" href="/styles/vista.css">
</head>
<body>
  <main class="container py-4 py-lg-5">
    <section class="vista-card">
      <div class="row g-4 align-items-center">
        <div class="col-12 col-lg-7">
          <span class="vista-badge">Consigna 2 · HTTP + File System</span>
          <h1 class="vista-title mt-3">Archivo <em>generado</em> con Node.js</h1>
          <p class="vista-text">
            Este HTML fue creado por <code>modules/consigna2/consigna2.js</code> usando <code>node:fs</code>
            y entregado al navegador por <code>server.js</code> con <code>node:http</code>.
          </p>
        </div>
        <div class="col-12 col-lg-5">
          <div class="vista-stack">
            <div class="vista-item"><span>Generado</span><strong>modules/consigna2/consigna2.js</strong></div>
            <div class="vista-item"><span>Ruta</span><strong>pages/consigna2/vista.html</strong></div>
            <div class="vista-item"><span>Servido por</span><strong>server.js con node:http</strong></div>
          </div>
        </div>
      </div>
      <a class="btn btn-warning btn-lg mt-4" href="http://127.0.0.1:3000/archivos">Volver al sitio</a>
    </section>
  </main>
</body>
</html>`;
}

export function crearVista() {
  // Genera o actualiza vista.html cada vez que se necesite.
  escribirArchivo(RUTA_VISTA, renderVistaHTML());
}

export function renderContenidoArchivos() {
  // Devuelve el cuerpo HTML de la pagina /archivos.
  return `
    <section class="hero-ui hero-ui--compact mb-4">
      <span class="eyebrow-ui">Consigna 2</span>
      <h1 class="display-5 serif-title mb-3">HTTP + File System en una sola experiencia</h1>
      <p class="hero-ui__text mb-0">
        El modulo genera el archivo HTML real y el mismo servidor principal lo entrega al navegador.
      </p>
    </section>

    <section class="row g-4">
      <div class="col-12 col-xl-7">
        <div class="section-shell h-100">
          <div class="d-flex align-items-start justify-content-between gap-3 mb-4">
            <div>
              <span class="eyebrow-ui">File System</span>
              <h2 class="serif-title mb-2">Archivo generado en disco</h2>
              <p class="text-ui mb-0">
                <code>crearVista()</code> escribe <code>pages/consigna2/vista.html</code> usando el modulo
                <code>modules/consigna2/archivos.js</code>.
              </p>
            </div>
            <div class="icon-ui icon-ui--coral">
              <i class="bi bi-file-earmark-richtext-fill"></i>
            </div>
          </div>
          <div class="code-strip mb-4">
            <div><span>Modulo</span><strong>modules/consigna2/consigna2.js</strong></div>
            <div><span>Salida</span><strong>pages/consigna2/vista.html</strong></div>
          </div>
          <div class="preview-note">El HTML se genera al iniciar el servidor y puede servirse desde la misma app.</div>
        </div>
      </div>

      <div class="col-12 col-xl-5">
        <div class="feature-panel h-100">
          <div class="d-flex align-items-start justify-content-between gap-3 mb-4">
            <div>
              <span class="eyebrow-ui text-white-50">node:http</span>
              <h2 class="serif-title text-white mb-2">Mismo server.js</h2>
              <p class="feature-panel__text mb-0">La ruta <code>/vista.html</code> es servida por el mismo servidor principal.</p>
            </div>
            <div class="icon-ui icon-ui--light">
              <i class="bi bi-hdd-network-fill"></i>
            </div>
          </div>
          <div class="list-group list-group-flush panel-list">
            <div class="list-group-item panel-list__item"><span>Ruta publica</span><strong>/vista.html</strong></div>
            <div class="list-group-item panel-list__item"><span>Modulo nativo</span><strong>node:http</strong></div>
            <div class="list-group-item panel-list__item"><span>Ventaja</span><strong>Sin segundo servidor</strong></div>
          </div>
          <a class="btn btn-ui btn-ui--primary mt-4" href="/vista.html" target="_blank">Abrir HTML generado</a>
        </div>
      </div>
    </section>
  `;
}
