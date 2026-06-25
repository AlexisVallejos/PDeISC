/**
 * DOCUMENTACION PARA DEFENDER
 * Archivo: modules/consigna3/consigna3.js
 * Rol: forma parte del proyecto y separa responsabilidades para que el codigo sea mas facil de explicar y mantener.
 * Idea clave: mantener este codigo separado ayuda a explicar que hace cada parte sin mezclar responsabilidades.
 * Como defenderlo: explicar primero que datos entran, que proceso se aplica y que salida produce.
 * Validacion: remarcar donde se controlan errores para que la app no falle con datos incorrectos.
 */
// Renderiza el contenido HTML de la consigna 3 usando el analisis del modulo URL.

import { analizarURL, URL_EJEMPLO } from './url.js';

// renderContenidoConsigna3: Genera HTML o contenido visual a partir de datos ya preparados.
export function renderContenidoConsigna3() {
  const datos = analizarURL();

  const filas = [
    ['href', datos.href],
    ['protocol', datos.protocol],
    ['host', datos.host],
    ['hostname', datos.hostname],
    ['port', datos.port],
    ['pathname', datos.pathname],
    ['search', datos.search],
    ['hash', datos.hash],
    ['origin', datos.origin],
  ].map(([k, v]) => `
    <tr>
      <td><code>${k}</code></td>
      <td class="njs-text-muted">${v}</td>
    </tr>
  `).join('');

  const paramRows = Object.entries(datos.params)
    .filter(([k]) => k !== 'searchState')
    .map(([k, v]) => `
      <tr>
        <td><code>param.${k}</code></td>
        <td class="njs-text-muted">${v}</td>
      </tr>
    `)
    .join('');

  return `
    <section class="njs-page-header mb-4">
      <span class="njs-page-header__tag">Consigna 3</span>
      <h1 class="njs-page-header__title">Análisis de URL</h1>
      <p class="njs-page-header__desc">
        El módulo analiza la URL y arma la página HTML con todos sus datos, además de imprimirlos por consola.
      </p>
    </section>

    <section class="row g-4">
      <div class="col-12 col-xl-8">
        <div class="njs-info-panel">
          <h2 class="njs-section-title mb-3">Desglose completo</h2>
          <div class="njs-url-box mb-4">${URL_EJEMPLO}</div>
          <div class="table-responsive">
            <table class="table njs-table align-middle mb-0">
              <tbody>
                ${filas}
                ${paramRows}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="col-12 col-xl-4">
        <div class="njs-action-card">
          <div class="njs-action-card__icon"><i class="bi bi-terminal-fill"></i></div>
          <h3 class="njs-action-card__title">Salida de terminal</h3>
          <p class="njs-text-muted mb-3">Al iniciar el servidor, <code>analizarURL()</code> imprime host, pathname, protocolo y parámetros.</p>
          <div class="njs-detail-list">
            <div class="njs-detail-list__item">
              <i class="bi bi-code-slash"></i>
              <div><small>API</small><strong>new URL()</strong></div>
            </div>
            <div class="njs-detail-list__item">
              <i class="bi bi-terminal"></i>
              <div><small>Salida</small><strong>console.log()</strong></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}
