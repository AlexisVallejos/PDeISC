/**
 * DOCUMENTACION PARA DEFENDER
 * Archivo: modules/consigna2/consigna2.js
 * Rol: forma parte del proyecto y separa responsabilidades para que el codigo sea mas facil de explicar y mantener.
 * Idea clave: mantener este codigo separado ayuda a explicar que hace cada parte sin mezclar responsabilidades.
 * Como defenderlo: explicar primero que datos entran, que proceso se aplica y que salida produce.
 * Validacion: remarcar donde se controlan errores para que la app no falle con datos incorrectos.
 */
// Modulo de la consigna 2.
// Genera la vista HTML que se guarda en /pages/consigna2/vista.html
// y tambien el contenido de la pagina principal de la consigna.

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { escribirArchivo } from './archivos.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const RUTA_VISTA = path.join(__dirname, '..', '..', 'pages', 'consigna2', 'vista.html');

import { renderLayout } from '../shared/layout.js';

// renderVistaHTML: Genera HTML o contenido visual a partir de datos ya preparados.
export function renderVistaHTML() {
  const contenido = `
    <section class="njs-page-header mb-4">
      <span class="njs-page-header__tag">Consigna 2 · HTTP + File System</span>
      <h1 class="njs-page-header__title">Archivo <em>generado</em> con Node.js</h1>
      <p class="njs-page-header__desc">
        Este HTML fue creado por <code>modules/consigna2/consigna2.js</code> usando <code>node:fs</code>
        y entregado al navegador por <code>server.js</code> con <code>node:http</code>.
      </p>
    </section>

    <div class="row justify-content-center">
      <div class="col-12 col-lg-8">
        <div class="njs-info-panel text-center">
          <h2 class="njs-section-title mb-4">Detalles técnicos</h2>
          <div class="njs-detail-list text-start mx-auto" style="max-width: 400px;">
            <div class="njs-detail-list__item">
              <i class="bi bi-file-earmark-code-fill"></i>
              <div><small>Generado por</small><strong>modules/consigna2/consigna2.js</strong></div>
            </div>
            <div class="njs-detail-list__item">
              <i class="bi bi-folder-fill"></i>
              <div><small>Ruta física</small><strong>pages/consigna2/vista.html</strong></div>
            </div>
            <div class="njs-detail-list__item">
              <i class="bi bi-hdd-network-fill"></i>
              <div><small>Servido por</small><strong>server.js con node:http</strong></div>
            </div>
          </div>
          <a class="njs-btn njs-btn--primary mt-5" href="/archivos">
            <i class="bi bi-arrow-left"></i> Volver al sitio
          </a>
        </div>
      </div>
    </div>
  `;
  
  return renderLayout('Vista Generada', contenido, '/vista.html');
}

// crearVista: Crea o registra informacion nueva despues de validar los datos.
export function crearVista() {
  escribirArchivo(RUTA_VISTA, renderVistaHTML());
}

// renderContenidoArchivos: Genera HTML o contenido visual a partir de datos ya preparados.
export function renderContenidoArchivos() {
  const items = [
    { icon: 'file-earmark-code-fill', label: 'Módulo generador', value: 'modules/consigna2/consigna2.js' },
    { icon: 'folder-fill', label: 'Salida en disco', value: 'pages/consigna2/vista.html' },
    { icon: 'hdd-network-fill', label: 'Servido por', value: 'server.js (node:http)' },
  ];

  return `
    <section class="njs-page-header mb-4">
      <span class="njs-page-header__tag">Consigna 2</span>
      <h1 class="njs-page-header__title">HTTP + File System</h1>
      <p class="njs-page-header__desc">
        El módulo genera el archivo HTML real y el mismo servidor principal lo entrega al navegador.
      </p>
    </section>

    <section class="row g-4">
      <div class="col-12 col-lg-7">
        <div class="njs-info-panel">
          <h2 class="njs-section-title mb-3">Archivo generado en disco</h2>
          <p class="njs-text-muted mb-4">
            <code>crearVista()</code> escribe <code>pages/consigna2/vista.html</code> usando el módulo
            <code>modules/consigna2/archivos.js</code>.
          </p>
          <div class="njs-detail-list">
            ${items.map(it => `
              <div class="njs-detail-list__item">
                <i class="bi bi-${it.icon}"></i>
                <div>
                  <small>${it.label}</small>
                  <strong>${it.value}</strong>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <div class="col-12 col-lg-5">
        <div class="njs-action-card">
          <div class="njs-action-card__icon"><i class="bi bi-eye-fill"></i></div>
          <h3 class="njs-action-card__title">Vista generada</h3>
          <p class="njs-text-muted">El HTML se genera al iniciar el servidor y puede servirse desde la misma app.</p>
          <a class="njs-btn njs-btn--primary mt-3" href="/vista.html" target="_blank">
            <i class="bi bi-box-arrow-up-right"></i> Abrir HTML generado
          </a>
        </div>
      </div>
    </section>
  `;
}
