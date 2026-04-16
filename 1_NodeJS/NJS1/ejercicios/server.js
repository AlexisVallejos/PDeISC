const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { URL } = require('node:url');
const { upperCase } = require('upper-case');

const calculo = require('./modules/calculo');
const clima = require('./modules/clima');
const menu = require('./modules/menu');

const PORT = 3000;

function renderLayout(titulo, contenido) {
  return `<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${titulo}</title>
    <style>
      :root {
        color-scheme: light;
      }

      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        font-family: Arial, sans-serif;
        line-height: 1.5;
        background: #f4f7fb;
        color: #1a1a1a;
      }

      .container {
        width: min(960px, 92%);
        margin: 0 auto;
        padding: 1.5rem 0 2rem;
      }

      .hero,
      .panel {
        background: #ffffff;
        border: 1px solid #dfe6ef;
        border-radius: 14px;
        padding: 1rem 1.25rem;
        box-shadow: 0 6px 18px rgba(15, 35, 95, 0.05);
      }

      .hero h1 {
        margin-top: 0;
      }

      .section-title {
        margin: 1.2rem 0 0.8rem;
      }

      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 0.8rem;
      }

      .grid .panel {
        min-height: 130px;
      }

      code {
        background: #eef2f7;
        padding: 0.12rem 0.35rem;
        border-radius: 6px;
      }

      @media (max-width: 540px) {
        .container {
          width: 94%;
          padding-top: 1rem;
        }

        .hero,
        .panel {
          padding: 0.85rem;
        }
      }
    </style>
  </head>
  <body>
    <main class="container">
      <section class="hero">
        <h1>${titulo}</h1>
        ${menu.renderMenu()}
      </section>
      <section class="section-title">${contenido}</section>
    </main>
  </body>
</html>`;
}

function responderHtml(res, statusCode, html) {
  res.writeHead(statusCode, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(html);
}

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);

  if (parsedUrl.pathname === '/') {
    const contenido = `
      <article class="panel">
        <p>Servidor único para todos los ejercicios solicitados por el profesor.</p>
        <p>
          Desde aquí puedes entrar a cada ejercicio y revisar: módulos propios,
          <code>http</code>, <code>fs</code>, <code>url</code> y paquete NPM.
        </p>
      </article>
    `;
    return responderHtml(res, 200, renderLayout('Proyecto de Ejercicios Node.js', contenido));
  }

  if (parsedUrl.pathname === '/clima-calculo') {
    const climaQuito = clima.obtenerClima('Quito');
    const contenido = `
      <div class="grid">
        <article class="panel">
          <h2>Clima</h2>
          <p><strong>Ciudad:</strong> ${climaQuito.ciudad}</p>
          <p><strong>Estado:</strong> ${climaQuito.estado}</p>
          <p><strong>Temperatura:</strong> ${climaQuito.temperatura}°C</p>
        </article>
        <article class="panel">
          <h2>Cálculos</h2>
          <ul>
            <li>7 + 5 = ${calculo.suma(7, 5)}</li>
            <li>20 - 8 = ${calculo.resta(20, 8)}</li>
            <li>6 * 9 = ${calculo.multiplicacion(6, 9)}</li>
            <li>24 / 3 = ${calculo.division(24, 3)}</li>
          </ul>
        </article>
      </div>
    `;
    return responderHtml(res, 200, renderLayout('Ejercicio 1: módulos propios', contenido));
  }

  if (parsedUrl.pathname === '/http-fs') {
    const archivoHtml = path.join(__dirname, 'pages', 'http-fs.html');

    return fs.readFile(archivoHtml, (error, data) => {
      if (error) {
        return responderHtml(
          res,
          500,
          renderLayout('Error', '<article class="panel"><p>No se pudo leer el archivo HTML.</p></article>'),
        );
      }

      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      return res.end(data);
    });
  }

  if (parsedUrl.pathname === '/url-info') {
    const contenido = `
      <article class="panel">
        <h2>Datos de la URL</h2>
        <ul>
          <li>Host: ${parsedUrl.host}</li>
          <li>Pathname: ${parsedUrl.pathname}</li>
          <li>Parámetros: ${parsedUrl.search || '(sin parámetros)'}</li>
        </ul>
      </article>
    `;
    return responderHtml(res, 200, renderLayout('Ejercicio 3: módulo URL', contenido));
  }

  if (parsedUrl.pathname === '/npm-upper') {
    const fraseOriginal = 'instalado desde npm: upper-case';
    const contenido = `
      <article class="panel">
        <h2>Uso del paquete NPM</h2>
        <p>Original: ${fraseOriginal}</p>
        <p>Transformado: <strong>${upperCase(fraseOriginal)}</strong></p>
      </article>
    `;
    return responderHtml(res, 200, renderLayout('Ejercicio 4: paquete upper-case', contenido));
  }

  if (parsedUrl.pathname === '/ejercicio5' || parsedUrl.pathname === '/acerca') {
    const contenido = `
      <article class="panel">
        <h2>Ejercicio 5: integración final</h2>
        <p>
          Este ejercicio está acoplado al proyecto <strong>ejercicios</strong> y funciona
          dentro del mismo servidor principal.
        </p>
        <p>
          Se cumple el requerimiento de tener un solo servidor que controle todo:
          rutas, módulos, lectura de archivos y paquete NPM.
        </p>
      </article>
    `;
    return responderHtml(res, 200, renderLayout('Ejercicio 5', contenido));
  }

  return responderHtml(
    res,
    404,
    renderLayout('404 - Página no encontrada', '<article class="panel"><p>La ruta solicitada no existe.</p></article>'),
  );
});

function iniciarServidor() {
  server.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
  });
}

module.exports = {
  iniciarServidor,
};
