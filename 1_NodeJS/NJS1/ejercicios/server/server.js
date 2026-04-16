const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const url = require('node:url');
const { upperCase } = require('upper-case');

const calculo = require('../modules/calculo');
const clima = require('../modules/clima');
const menu = require('../modules/menu');

const PORT = 3000;

function renderLayout(titulo, contenido) {
  return `<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${titulo}</title>
  </head>
  <body style="font-family: Arial, sans-serif; margin: 2rem; line-height: 1.4;">
    <h1>${titulo}</h1>
    ${menu.renderMenu()}
    <hr />
    ${contenido}
  </body>
</html>`;
}

function responderHtml(res, statusCode, html) {
  res.writeHead(statusCode, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(html);
}

const server = http.createServer((req, res) => {
  const parsedUrl = new url.URL(req.url, `http://${req.headers.host}`);

  console.log('--- Información URL de la petición ---');
  console.log('host:', parsedUrl.host);
  console.log('pathname:', parsedUrl.pathname);
  console.log('search:', parsedUrl.search || '(sin query)');
  console.log('protocol:', parsedUrl.protocol);

  if (parsedUrl.pathname === '/') {
    const contenido = `
      <p>Servidor único para todos los ejercicios solicitados.</p>
      <p>
        Proyecto integrando módulos propios, <code>http</code>, <code>fs</code>,
        <code>url</code> y paquete de NPM <code>upper-case</code>.
      </p>
    `;
    return responderHtml(res, 200, renderLayout('Proyecto de Ejercicios Node.js', contenido));
  }

  if (parsedUrl.pathname === '/clima-calculo') {
    const climaQuito = clima.obtenerClima('Quito');
    const contenido = `
      <h2>Componente con módulos propios</h2>
      <p><strong>Clima:</strong> ${climaQuito.ciudad} - ${climaQuito.estado}, ${climaQuito.temperatura}°C</p>
      <p><strong>Cálculos:</strong></p>
      <ul>
        <li>7 + 5 = ${calculo.suma(7, 5)}</li>
        <li>20 - 8 = ${calculo.resta(20, 8)}</li>
        <li>6 * 9 = ${calculo.multiplicacion(6, 9)}</li>
        <li>24 / 3 = ${calculo.division(24, 3)}</li>
      </ul>
    `;
    return responderHtml(res, 200, renderLayout('Ejercicio 1: módulos propios', contenido));
  }

  if (parsedUrl.pathname === '/http-fs') {
    const archivoHtml = path.join(__dirname, '..', 'pages', 'http-fs.html');

    return fs.readFile(archivoHtml, (error, data) => {
      if (error) {
        return responderHtml(
          res,
          500,
          renderLayout('Error', '<p>No se pudo leer el archivo HTML.</p>'),
        );
      }

      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      return res.end(data);
    });
  }

  if (parsedUrl.pathname === '/url-info') {
    const contenido = `
      <h2>Datos de URL procesados con el módulo <code>url</code></h2>
      <ul>
        <li>Host: ${parsedUrl.host}</li>
        <li>Pathname: ${parsedUrl.pathname}</li>
        <li>Parámetros: ${parsedUrl.search || '(sin parámetros)'}</li>
      </ul>
      <p>Además, esta información también se imprime en consola por cada petición.</p>
    `;
    return responderHtml(res, 200, renderLayout('Ejercicio 3: módulo URL', contenido));
  }

  if (parsedUrl.pathname === '/npm-upper') {
    const fraseOriginal = 'instalado desde npm: upper-case';
    const contenido = `
      <h2>Uso de paquete NPM</h2>
      <p>Original: ${fraseOriginal}</p>
      <p>Transformado: <strong>${upperCase(fraseOriginal)}</strong></p>
    `;
    return responderHtml(res, 200, renderLayout('Ejercicio 4: paquete upper-case', contenido));
  }

  if (parsedUrl.pathname === '/acerca') {
    const contenido = `
      <h2>Ejercicio 5</h2>
      <p>
        Este mini-sitio web integra todos los conceptos anteriores y usa un menú
        modular con enlaces a más de 5 páginas.
      </p>
    `;
    return responderHtml(res, 200, renderLayout('Acerca del proyecto', contenido));
  }

  return responderHtml(
    res,
    404,
    renderLayout('404 - Página no encontrada', '<p>La ruta solicitada no existe.</p>'),
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
