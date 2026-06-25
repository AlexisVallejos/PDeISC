// Renderiza el contenido HTML de la consigna 1 usando los modulos propios.

import { sumar, restar, multiplicar, dividir, potencia } from './calculo.js';
import { getClimaActual } from './clima.js';

export function renderContenidoConsigna1() {
  const a = 12;
  const b = 4;
  const clima = getClimaActual('Mar del Plata');

  const operaciones = [
    { label: 'Suma', expr: `${a} + ${b}`, resultado: sumar(a, b), icono: 'plus-circle-fill', tono: 'azul' },
    { label: 'Resta', expr: `${a} - ${b}`, resultado: restar(a, b), icono: 'dash-circle-fill', tono: 'coral' },
    { label: 'Multiplicacion', expr: `${a} x ${b}`, resultado: multiplicar(a, b), icono: 'x-circle-fill', tono: 'verde' },
    { label: 'Division', expr: `${a} / ${b}`, resultado: dividir(a, b), icono: 'slash-circle-fill', tono: 'dorado' },
    { label: 'Potencia', expr: `${a} ^ ${b}`, resultado: potencia(a, b), icono: 'lightning-charge-fill', tono: 'violeta' },
  ];

  return `
    <section class="hero-ui hero-ui--compact mb-4">
      <span class="eyebrow-ui">Consigna 1</span>
      <h1 class="display-5 serif-title mb-3">Modulos propios</h1>
      <p class="hero-ui__text mb-0">
        Los modulos <code>calculo.js</code> y <code>clima.js</code> generan el contenido de esta pagina.
      </p>
    </section>

    <section class="row g-4 align-items-stretch">
      <div class="col-12 col-xl-5">
        <div class="feature-panel h-100">
          <div class="d-flex align-items-start justify-content-between gap-3 mb-4">
            <div>
              <span class="eyebrow-ui text-white-50">Consigna 1 · clima.js</span>
              <h2 class="serif-title text-white mb-2">Clima en tiempo real</h2>
              <p class="feature-panel__text mb-0">Consulta actual para ${clima.ciudad}, ${clima.pais}.</p>
            </div>
            <div class="icon-ui icon-ui--light">
              <i class="bi bi-cloud-sun-fill"></i>
            </div>
          </div>
          <div class="temp-ui mb-4">${clima.temperaturaC}<span>°C</span></div>
          <p class="feature-panel__text mb-4">${clima.condicion}</p>
          <div class="list-group list-group-flush panel-list">
            <div class="list-group-item panel-list__item"><span>Modulo</span><strong>modules/consigna1/clima.js</strong></div>
            <div class="list-group-item panel-list__item"><span>Ciudad</span><strong>${clima.ciudad}</strong></div>
            <div class="list-group-item panel-list__item"><span>Actualizado</span><strong>${clima.actualizado}</strong></div>
          </div>
        </div>
      </div>

      <div class="col-12 col-xl-7">
        <div class="section-shell h-100">
          <div class="d-flex flex-column flex-lg-row align-items-lg-end justify-content-between gap-3 mb-4">
            <div>
              <span class="eyebrow-ui">Consigna 1 · calculo.js</span>
              <h2 class="serif-title mb-2">Operaciones matematicas</h2>
              <p class="text-ui mb-0">Todo resuelto desde el modulo de calculo, con el render separado en consigna1.js.</p>
            </div>
            <div class="soft-badge">Entrada base: ${a} y ${b}</div>
          </div>
          <div class="row g-3">
            ${operaciones.map((op) => `
              <div class="col-12 col-md-6 col-xxl-4">
                <div class="card card-ui h-100 border-0">
                  <div class="card-body p-4">
                    <div class="operacion-card__top d-flex align-items-start justify-content-between gap-3 mb-3">
                      <span class="pill-ui pill-ui--${op.tono}">${op.label}</span>
                      <div class="icon-ui icon-ui--${op.tono} operacion-card__icon">
                        <i class="bi bi-${op.icono}"></i>
                      </div>
                    </div>
                    <div class="metric-value mb-2">${op.resultado}</div>
                    <div class="text-ui fw-semibold">${op.expr}</div>
                    <div class="small text-secondary mt-3">modules/consigna1/calculo.js</div>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </section>
  `;
}
