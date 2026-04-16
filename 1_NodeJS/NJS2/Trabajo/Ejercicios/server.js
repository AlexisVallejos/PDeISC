const http = require('http');
const fs   = require('fs');
const path = require('path');

const { pronostico }                                    = require('./modules/clima');
const { sumar, restar, multiplicar, dividir, potencia, porcentaje } = require('./modules/calculo');

const PORT = 3000;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css',
  '.js':   'application/javascript',
};

function serveFile(filePath, res) {
  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404, { 'Content-Type': 'text/plain' }); res.end('Not found'); return; }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(filePath)] || 'text/plain' });
    res.end(data);
  });
}

const ops = { sumar, restar, multiplicar, dividir, potencia, porcentaje };

const server = http.createServer((req, res) => {
  const url      = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = url.pathname;

  if (pathname === '/' || pathname === '/index.html') {
    return serveFile(path.join(__dirname, 'pages', 'index.html'), res);
  }

  if (pathname.startsWith('/styles/') || pathname.startsWith('/scripts/')) {
    return serveFile(path.join(__dirname, pathname), res);
  }

  if (pathname === '/api/clima') {
    const ciudad  = url.searchParams.get('ciudad') || '';
    const mensaje = pronostico(ciudad);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ mensaje }));
    return;
  }

  if (pathname === '/api/calculo') {
    const a  = parseFloat(url.searchParams.get('a'));
    const b  = parseFloat(url.searchParams.get('b'));
    const op = url.searchParams.get('op');
    let resultado;
    try   { resultado = ops[op] ? ops[op](a, b).toString() : 'Operación inválida'; }
    catch (e) { resultado = `Error: ${e.message}`; }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ resultado }));
    return;
  }

  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('404 Not Found');
});

server.listen(PORT, () => console.log(`Ej.1 → http://localhost:${PORT}`));
