const http = require('http');
const fs = require('fs');
const path = require('path');

const { pronostico } = require('../modules/clima');
const { sumar, restar, multiplicar, dividir, potencia, porcentaje } = require('../modules/calculo');
const { leerArchivo } = require('../modules/fileLoader');
const { parsearURL } = require('../modules/urlParser');
const { transformarTexto } = require('../modules/transformer');

const PORT = 3000;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'application/javascript',
};

function serveAbsoluteFile(filePath, res) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not found');
      return;
    }

    res.writeHead(200, { 'Content-Type': MIME[path.extname(filePath)] || 'text/plain' });
    res.end(data);
  });
}

function serveRelativeFile(relativePath, res) {
  leerArchivo(relativePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not found');
      return;
    }

    res.writeHead(200, { 'Content-Type': MIME[path.extname(relativePath)] || 'text/plain' });
    res.end(data);
  });
}

const ops = { sumar, restar, multiplicar, dividir, potencia, porcentaje };

const htmlRoutes = {
  '/': 'index.html',
  '/index.html': 'index.html',
  '/index2.html': 'index2.html',
  '/index3.html': 'index3.html',
  '/index4.html': 'index4.html',
  '/index5.html': 'index5.html',
  '/ejercicio5': 'index5.html',
  '/ejercicio5/nosotros': 'ej5-nosotros.html',
  '/ejercicio5/servicios': 'ej5-servicios.html',
  '/ejercicio5/portafolio': 'ej5-portafolio.html',
  '/ejercicio5/blog': 'ej5-blog.html',
  '/ejercicio5/contacto': 'ej5-contacto.html',
};

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = url.pathname;

  if (htmlRoutes[pathname]) {
    return serveAbsoluteFile(path.join(__dirname, '..', 'pages', htmlRoutes[pathname]), res);
  }

  if (pathname.startsWith('/styles/') || pathname.startsWith('/scripts/')) {
    return serveRelativeFile(pathname.slice(1), res);
  }

  if (pathname === '/api/clima') {
    const ciudad = url.searchParams.get('ciudad') || '';
    const mensaje = pronostico(ciudad);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ mensaje }));
    return;
  }

  if (pathname === '/api/calculo') {
    const a = parseFloat(url.searchParams.get('a'));
    const b = parseFloat(url.searchParams.get('b'));
    const op = url.searchParams.get('op');
    let resultado;

    try {
      resultado = ops[op] ? ops[op](a, b).toString() : 'Operación inválida';
    } catch (error) {
      resultado = `Error: ${error.message}`;
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ resultado }));
    return;
  }

  if (pathname === '/api/info') {
    const info = {
      nodeVersion: process.version,
      plataforma: process.platform,
      uptime: process.uptime().toFixed(2),
      archivo: 'pages/index2.html',
      moduloFS: 'Activo ✓',
      moduloHTTP: 'Activo ✓',
    };

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(info));
    return;
  }

  if (pathname === '/api/parse-url') {
    const urlParam = url.searchParams.get('url');

    if (!urlParam) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Parámetro "url" requerido' }));
      return;
    }

    try {
      const resultado = parsearURL(urlParam);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(resultado));
    } catch {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'URL inválida' }));
    }

    return;
  }

  if (pathname === '/api/uppercase') {
    const texto = url.searchParams.get('texto') || '';
    const resultado = transformarTexto(texto);

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(resultado));
    return;
  }

  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('404 Not Found');
});

server.listen(PORT, () => {
  console.log(`Servidor único activo en http://localhost:${PORT}`);
});
