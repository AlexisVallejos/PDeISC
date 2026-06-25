// Modulo de la pagina de inicio.
// Resume las consignas del proyecto y muestra el clima integrado en la home.

import { getClimaActual } from '../consigna1/clima.js';

const ITEMS = [
  { href: '/calculo', consigna: 'Consigna 1', icono: 'stars', titulo: 'Modulos propios', texto: 'Calculo y clima renderizados desde modulos.', tono: 'azul' },
  { href: '/archivos', consigna: 'Consigna 2', icono: 'folder2-open', titulo: 'HTTP + File System', texto: 'Se genera un HTML real y el mismo server.js lo entrega.', tono: 'coral' },
  { href: '/url', consigna: 'Consigna 3', icono: 'link-45deg', titulo: 'Analisis URL', texto: 'Host, pathname, parametros y salida por consola.', tono: 'verde' },
  { href: '/npm', consigna: 'Consigna 4', icono: 'box-seam-fill', titulo: 'Paquete NPM', texto: 'upper-case aplicado en una grilla responsive.', tono: 'violeta' },
];

export function renderContenidoInicio() {
  // Reutiliza el modulo de clima para mostrarlo directamente en el inicio.
  const clima = getClimaActual('Mar del Plata');

  // Cards de navegacion hacia las 4 consignas restantes.
  const cards = ITEMS.map((item) => `
    <div class="col-12 col-md-6 col-xl-4">
      <a class="card card-ui h-100 text-decoration-none" href="${item.href}">
        <div class="card-body p-4">
          <div class="d-flex align-items-start justify-content-between gap-3 mb-4">
            <div><span class="pill-ui pill-ui--${item.tono}">${item.consigna}</span></div>
            <div class="icon-ui icon-ui--${item.tono}"><i class="bi bi-${item.icono}"></i></div>
          </div>
          <h3 class="h4 serif-title mb-3">${item.titulo}</h3>
          <p class="text-ui mb-4">${item.texto}</p>
          <div class="d-flex align-items-center gap-2 fw-semibold link-ui"><span>Explorar</span><i class="bi bi-arrow-right"></i></div>
        </div>
      </a>
    </div>
  `).join('');

  return `
    <section class="hero-ui mb-4 mb-lg-5">
      <h1 class="display-1 title-anton text-center mb-0">
        El Mejor Proyecto Para Aprobar
      </h1>
    </section>

    <section class="row g-4 mb-4">
      <div class="col-12">
        <div class="feature-panel">
          <div class="d-flex align-items-start justify-content-between gap-3 mb-4">
            <div>
              <span class="eyebrow-ui text-white-50">Clima incluido en inicio</span>
              <h2 class="serif-title text-white mb-2">Mar del Plata</h2>
              <p class="feature-panel__text mb-0">El clima de la consigna 1 ahora vive directamente en la pagina principal.</p>
            </div>
            <div class="icon-ui icon-ui--light">
              <i class="bi bi-cloud-sun-fill"></i>
            </div>
          </div>
          <div class="row g-3 align-items-end">
            <div class="col-12 col-lg-4">
              <div class="temp-ui">${clima.temperaturaC}<span>°C</span></div>
            </div>
            <div class="col-12 col-lg-8">
              <div class="list-group list-group-flush panel-list">
                <div class="list-group-item panel-list__item"><span>Condicion</span><strong>${clima.condicion}</strong></div>
                <div class="list-group-item panel-list__item"><span>Pais</span><strong>${clima.pais}</strong></div>
                <div class="list-group-item panel-list__item"><span>Actualizado</span><strong>${clima.actualizado}</strong></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section-shell">
      <div class="section-heading d-flex flex-column flex-lg-row align-items-lg-end justify-content-between gap-3 mb-4">
        <div>
          <span class="eyebrow-ui">Mapa del sitio</span>
          <h2 class="serif-title mb-2">Cinco paginas para la consigna 5</h2>
          <p class="text-ui mb-0">Inicio, Consigna 1, Consigna 2, Consigna 3 y Consigna 4.</p>
        </div>
      </div>
      <div class="row g-4">
        ${cards}
      </div>
    </section>
  `;
}
