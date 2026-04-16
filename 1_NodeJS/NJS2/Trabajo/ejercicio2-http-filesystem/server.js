const http = require('http');
const fs   = require('fs');
const path = require('path');

const PORT     = 3000;
const htmlFile = path.join(__dirname, 'index.html');

const server = http.createServer((req, res) => {
  fs.readFile(htmlFile, 'utf8', (err, contenido) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Error al leer el archivo HTML');
      return;
    }
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(contenido);
  });
});

server.listen(PORT, () => {
  console.log(`Servidor corriendo → http://localhost:${PORT}`);
  console.log('Presioná Ctrl+C para detenerlo.');
});
