const http = require('http');
const path = require('path');
const { leerArchivo } = require('./modules/fileLoader');

const PORT = 3000;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css',
  '.js':   'application/javascript',
};

function serveFile(relPath, res) {
  leerArchivo(relPath, (err, data) => {
    if (err) { res.writeHead(404, { 'Content-Type': 'text/plain' }); res.end('Not found'); return; }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(relPath)] || 'text/plain' });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  const url      = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = url.pathname;

  if (pathname === '/' || pathname === '/index2.html') {
    return serveFile('pages/index.html', res);
  }

  if (pathname.startsWith('/styles/') || pathname.startsWith('/scripts/')) {
    return serveFile(pathname.slice(1), res);
  }

  if (pathname === '/api/info') {
    const info = {
      nodeVersion: process.version,
      plataforma:  process.platform,
      uptime:      process.uptime().toFixed(2),
      archivo:     'pages/index2.html',
      moduloFS:    'Activo ✓',
      moduloHTTP:  'Activo ✓',
    };
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(info));
    return;
  }

  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('404 Not Found');
});

server.listen(PORT, () => console.log(`Ej.2 → http://localhost:${PORT}`));
