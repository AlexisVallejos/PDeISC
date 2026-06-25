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

export function renderContenidoNPM() {
  // Prepara pares de texto original + texto transformado.
  const transformados = EJEMPLOS.map((texto) => ({
    original: texto,
    transformado: upperCase(texto),
  }));

  console.log('\n[NPM] upper-case en accion:');
  transformados.forEach(({ original, transformado }) => {
    console.log(`  "${original}" -> "${transformado}"`);
  });

  // Cada card muestra un ejemplo de uso del paquete.
  const cards = transformados.map(({ original, transformado }, index) => `
    <div class="col-12 col-md-6 col-xl-4">
      <div class="card card-ui h-100 border-0">
        <div class="card-body p-4">
          <div class="d-flex align-items-start justify-content-between gap-3 mb-3">
            <span class="pill-ui pill-ui--violeta">Ejemplo ${index + 1}</span>
            <div class="icon-ui icon-ui--violeta"><i class="bi bi-type"></i></div>
          </div>
          <p class="text-ui mb-3">${original}</p>
          <div class="metric-value metric-value--sm">${transformado}</div>
        </div>
      </div>
    </div>
  `).join('');

  return `
    <section class="hero-ui hero-ui--compact mb-4">
      <span class="eyebrow-ui">Consigna 4</span>
      <h1 class="display-5 serif-title mb-3">Paquete NPM con enfoque visual</h1>
      <p class="hero-ui__text mb-0">
        <code>upper-case</code> transforma textos reales y el modulo arma la grilla HTML al iniciar el proyecto.
      </p>
    </section>

    <section class="section-shell mb-4">
      <div class="row g-4 align-items-center">
        <div class="col-12 col-lg-7">
          <span class="eyebrow-ui">Instalacion</span>
          <h2 class="serif-title mb-3">Un paquete, varias transformaciones</h2>
          <p class="text-ui mb-0">El paquete fue instalado con <code>npm install upper-case</code> y se usa para convertir textos a mayusculas.</p>
        </div>
        <div class="col-12 col-lg-5">
          <div class="code-strip code-strip--stack">
            <div><span>Paquete</span><strong>upper-case</strong></div>
            <div><span>Uso</span><strong>upperCase(texto)</strong></div>
          </div>
        </div>
      </div>
    </section>

    <section class="row g-4">
      ${cards}
    </section>
  `;
}
