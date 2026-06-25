/**
 * DOCUMENTACION PARA DEFENDER
 * Archivo: modules/consigna4/npm.js
 * Rol: forma parte del proyecto y separa responsabilidades para que el codigo sea mas facil de explicar y mantener.
 * Idea clave: mantener este codigo separado ayuda a explicar que hace cada parte sin mezclar responsabilidades.
 * Como defenderlo: explicar primero que datos entran, que proceso se aplica y que salida produce.
 * Validacion: remarcar donde se controlan errores para que la app no falle con datos incorrectos.
 */
// Modulo de la consigna 4.
// Usa el paquete upper-case instalado con NPM y arma el contenido de la pagina.

import { upperCase } from 'upper-case';

const EJEMPLOS = [
  'node.js es genial',
  'modulos nativos',
  'upper-case instalado con npm',
  'http · fs · url',
  'proyecto njs2',
];

// renderContenidoNPM: Genera HTML o contenido visual a partir de datos ya preparados.
export function renderContenidoNPM() {
  const transformados = EJEMPLOS.map((texto) => ({
    original: texto,
    transformado: upperCase(texto),
  }));

  console.log('\n[NPM] upper-case en accion:');
  transformados.forEach(({ original, transformado }) => {
    console.log(`  "${original}" -> "${transformado}"`);
  });

  const cards = transformados.map(({ original, transformado }, index) => `
    <div class="col-12 col-md-6 col-xl-4">
      <div class="njs-result-card" style="--card-accent:#ec4899">
        <div class="njs-result-card__header">
          <span class="njs-result-card__label">Ejemplo ${index + 1}</span>
          <i class="bi bi-type njs-result-card__icon"></i>
        </div>
        <div class="njs-result-card__expr">${original}</div>
        <div class="njs-result-card__value" style="font-size:1.2rem">${transformado}</div>
      </div>
    </div>
  `).join('');

  return `
    <section class="njs-page-header mb-4">
      <span class="njs-page-header__tag">Consigna 4</span>
      <h1 class="njs-page-header__title">Paquete NPM</h1>
      <p class="njs-page-header__desc">
        <code>upper-case</code> transforma textos reales y el módulo arma la grilla HTML al iniciar el proyecto.
      </p>
    </section>

    <section class="njs-info-panel mb-4">
      <div class="row g-3 align-items-center">
        <div class="col-12 col-lg-7">
          <h2 class="njs-section-title mb-2">Un paquete, varias transformaciones</h2>
          <p class="njs-text-muted mb-0">El paquete fue instalado con <code>npm install upper-case</code> y se usa para convertir textos a mayúsculas.</p>
        </div>
        <div class="col-12 col-lg-5">
          <div class="njs-detail-list">
            <div class="njs-detail-list__item">
              <i class="bi bi-box-seam-fill"></i>
              <div><small>Paquete</small><strong>upper-case</strong></div>
            </div>
            <div class="njs-detail-list__item">
              <i class="bi bi-code-slash"></i>
              <div><small>Uso</small><strong>upperCase(texto)</strong></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="row g-3">
      ${cards}
    </section>
  `;
}
