const http = require('http');
const fs   = require('fs');
const path = require('path');
const { parsearURL } = require('./modules/urlParser');

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

const server = http.createServer((req, res) => {
  const url      = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = url.pathname;

  if (pathname === '/' || pathname === '/index3.html') {
    return serveFile(path.join(__dirname, 'pages', 'index3.html'), res);
  }

  if (pathname.startsWith('/styles/') || pathname.startsWith('/scripts/')) {
    return serveFile(path.join(__dirname, pathname), res);
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

  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('404 Not Found');
});

server.listen(PORT, () => console.log(`Ej.3 → http://localhost:${PORT}`));
