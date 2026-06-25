/**
 * DOCUMENTACION PARA DEFENDER
 * Archivo: modules/consigna5/inicio.js
 * Rol: forma parte del proyecto y separa responsabilidades para que el codigo sea mas facil de explicar y mantener.
 * Idea clave: mantener este codigo separado ayuda a explicar que hace cada parte sin mezclar responsabilidades.
 * Como defenderlo: explicar primero que datos entran, que proceso se aplica y que salida produce.
 * Validacion: remarcar donde se controlan errores para que la app no falle con datos incorrectos.
 */
// Modulo de la pagina de inicio.
// Resume las consignas del proyecto y muestra el clima integrado en la home.

import { getClimaActual } from '../consigna1/clima.js';

const ITEMS = [
  { href: '/calculo', consigna: 'Consigna 1', icono: 'calculator-fill', titulo: 'Módulos propios', texto: 'Cálculo y clima renderizados desde módulos.', color: '#8a2be2' },
  { href: '/archivos', consigna: 'Consigna 2', icono: 'folder2-open', titulo: 'HTTP + File System', texto: 'Se genera un HTML real y el mismo server.js lo entrega.', color: '#f97316' },
  { href: '/url', consigna: 'Consigna 3', icono: 'link-45deg', titulo: 'Análisis URL', texto: 'Host, pathname, parámetros y salida por consola.', color: '#06b6d4' },
  { href: '/npm', consigna: 'Consigna 4', icono: 'box-seam-fill', titulo: 'Paquete NPM', texto: 'upper-case aplicado en una grilla responsive.', color: '#ec4899' },
];

// renderContenidoInicio: Genera HTML o contenido visual a partir de datos ya preparados.
export function renderContenidoInicio() {
  const clima = getClimaActual('Mar del Plata');

  const cards = ITEMS.map((item) => `
    <div class="col-12 col-md-6">
      <a class="njs-link-card" href="${item.href}" style="--card-accent:${item.color}">
        <div class="njs-link-card__header">
          <div class="njs-link-card__icon"><i class="bi bi-${item.icono}"></i></div>
          <span class="njs-link-card__tag">${item.consigna}</span>
        </div>
        <h3 class="njs-link-card__title">${item.titulo}</h3>
        <p class="njs-link-card__text">${item.texto}</p>
        <span class="njs-link-card__arrow"><i class="bi bi-arrow-right"></i></span>
      </a>
    </div>
  `).join('');

  return `
    <!-- Weather Widget -->
    <section class="njs-info-panel mb-4 p-4">
      <div class="d-flex align-items-start justify-content-between gap-3 mb-4">
        <div>
          <span class="eyebrow-ui njs-text-muted text-uppercase" style="font-size:0.75rem; letter-spacing:0.1em; font-weight:700;">Clima en tiempo real</span>
          <h2 class="njs-section-title mb-2">Consulta actual para ${clima.ciudad}, ${clima.pais}.</h2>
        </div>
        <div class="njs-weather-widget__icon" style="width:48px;height:48px;border-radius:12px;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg, #f59e0b, #f97316);color:#fff;font-size:1.4rem;">
          <i class="bi bi-cloud-sun-fill"></i>
        </div>
      </div>
      
      <div class="row g-3 align-items-end">
        <div class="col-12 col-lg-4">
          <div style="font-size:3rem; font-weight:700; line-height:1; letter-spacing:-1px;">${clima.temperaturaC}<span>°C</span></div>
          <div class="njs-text-muted mt-2 fs-5">${clima.condicion}</div>
        </div>
        <div class="col-12 col-lg-8">
          <div class="njs-detail-list">
            <div class="njs-detail-list__item">
              <i class="bi bi-file-earmark-code"></i>
              <div class="w-100 d-flex justify-content-between align-items-center">
                <small>Modulo</small><strong>modules/consigna1/clima.js</strong>
              </div>
            </div>
            <div class="njs-detail-list__item">
              <i class="bi bi-geo-alt"></i>
              <div class="w-100 d-flex justify-content-between align-items-center">
                <small>Ciudad</small><strong>${clima.ciudad}</strong>
              </div>
            </div>
            <div class="njs-detail-list__item">
              <i class="bi bi-clock-history"></i>
              <div class="w-100 d-flex justify-content-between align-items-center">
                <small>Actualizado</small><strong>Dato hardcodeado</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Header -->
    <section class="njs-page-header mb-5">
      <span class="njs-page-header__tag">NJS2 · Node.js Modules</span>
      <h1 class="njs-page-header__title">Trabajo Práctico de Node.js</h1>
      <p class="njs-page-header__desc">Cinco páginas generadas con módulos propios, nativos y de NPM.</p>
    </section>

    <!-- Consignas Grid -->
    <section>
      <div class="row g-4">
        ${cards}
      </div>
    </section>
  `;
}
