// Renderiza el contenido HTML de la consigna 3 usando el analisis del modulo URL.

import { analizarURL, URL_EJEMPLO } from './url.js';

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
  ].map(([k, v]) => `<tr><td>${k}</td><td>${v}</td></tr>`).join('');

  const paramRows = Object.entries(datos.params)
    .filter(([k]) => k !== 'searchState')
    .map(([k, v]) => `<tr><td>param ${k}</td><td>${v}</td></tr>`)
    .join('');

  return `
    <section class="hero-ui hero-ui--compact mb-4">
      <span class="eyebrow-ui">Consigna 3</span>
      <h1 class="display-5 serif-title mb-3">Visualizar una URL sin perder detalle</h1>
      <p class="hero-ui__text mb-0">
        El modulo analiza la URL y arma la pagina HTML con todos sus datos, ademas de imprimirlos por consola.
      </p>
    </section>

    <section class="row g-4">
      <div class="col-12 col-xl-8">
        <div class="section-shell h-100">
          <div class="d-flex flex-column flex-lg-row align-items-lg-end justify-content-between gap-3 mb-4">
            <div>
              <span class="eyebrow-ui">URL analizada</span>
              <h2 class="serif-title mb-2">Desglose completo</h2>
              <p class="text-ui mb-0">La lectura se adapta bien a desktop y mobile.</p>
            </div>
          </div>
          <div class="url-box mb-4">${URL_EJEMPLO}</div>
          <div class="table-responsive">
            <table class="table table-ui align-middle mb-0">
              <tbody>
                ${filas}
                ${paramRows}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="col-12 col-xl-4">
        <div class="card card-ui h-100 border-0">
          <div class="card-body p-4 p-lg-5">
            <div class="icon-ui icon-ui--azul mb-4"><i class="bi bi-terminal-fill"></i></div>
            <span class="pill-ui pill-ui--azul mb-3">Consola</span>
            <h2 class="serif-title h3 mb-3">Salida de terminal</h2>
            <p class="text-ui mb-4">Al iniciar el servidor, <code>analizarURL()</code> imprime host, pathname, protocolo y parametros.</p>
            <div class="code-strip">
              <div><span>API</span><strong>new URL()</strong></div>
              <div><span>Salida</span><strong>console.log()</strong></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}
