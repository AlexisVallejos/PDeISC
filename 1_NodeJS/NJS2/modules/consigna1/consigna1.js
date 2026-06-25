/**
 * DOCUMENTACION PARA DEFENDER
 * Archivo: modules/consigna1/consigna1.js
 * Rol: forma parte del proyecto y separa responsabilidades para que el codigo sea mas facil de explicar y mantener.
 * Idea clave: mantener este codigo separado ayuda a explicar que hace cada parte sin mezclar responsabilidades.
 * Como defenderlo: explicar primero que datos entran, que proceso se aplica y que salida produce.
 * Validacion: remarcar donde se controlan errores para que la app no falle con datos incorrectos.
 */
// Renderiza el contenido HTML de la consigna 1 usando los modulos propios.

import { sumar, restar, multiplicar, dividir, potencia } from './calculo.js';
import { getClimaActual } from './clima.js';

// renderContenidoConsigna1: Genera HTML o contenido visual a partir de datos ya preparados.
export function renderContenidoConsigna1() {
  const a = 12;
  const b = 4;
  const clima = getClimaActual('Mar del Plata');

  const operaciones = [
    { label: 'Suma', expr: `${a} + ${b}`, resultado: sumar(a, b), icono: 'plus-lg', color: '#8a2be2' },
    { label: 'Resta', expr: `${a} - ${b}`, resultado: restar(a, b), icono: 'dash-lg', color: '#f97316' },
    { label: 'Multiplicación', expr: `${a} × ${b}`, resultado: multiplicar(a, b), icono: 'x-lg', color: '#06b6d4' },
    { label: 'División', expr: `${a} ÷ ${b}`, resultado: dividir(a, b), icono: 'slash-lg', color: '#10b981' },
    { label: 'Potencia', expr: `${a} ^ ${b}`, resultado: potencia(a, b), icono: 'lightning-charge-fill', color: '#ec4899' },
  ];

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
    <section class="njs-page-header mb-4">
      <span class="njs-page-header__tag">Consigna 1</span>
      <h1 class="njs-page-header__title">Módulos propios</h1>
      <p class="njs-page-header__desc">
        Los módulos <code>calculo.js</code> y <code>clima.js</code> generan el contenido de esta página.
      </p>
    </section>

    <!-- Operations Grid -->
    <section>
      <div class="d-flex align-items-center justify-content-between mb-3">
        <h2 class="njs-section-title">Operaciones matemáticas</h2>
        <span class="njs-pill">Entrada: ${a} y ${b}</span>
      </div>
      <div class="row g-3">
        ${operaciones.map((op) => `
          <div class="col-12 col-md-6 col-xl-4">
            <div class="njs-result-card" style="--card-accent:${op.color}">
              <div class="njs-result-card__header">
                <span class="njs-result-card__label">${op.label}</span>
                <i class="bi bi-${op.icono} njs-result-card__icon"></i>
              </div>
              <div class="njs-result-card__value">${op.resultado}</div>
              <div class="njs-result-card__expr">${op.expr}</div>
            </div>
          </div>
        `).join('')}
      </div>
    </section>
  `;
}
