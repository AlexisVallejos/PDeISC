const url = require('url');

const urlCompleta = 'https://www.ejemplo.com:8080/ruta/pagina?nombre=Juan&edad=25&pais=Argentina#seccion1';

// — API moderna (WHATWG URL)
const parsed = new URL(urlCompleta);

console.log('╔══════════════════════════════════════════╗');
console.log('║      MÓDULO URL — Node.js                ║');
console.log('╚══════════════════════════════════════════╝');
console.log('URL completa :', urlCompleta);
console.log('');
console.log('Protocolo    :', parsed.protocol);
console.log('Host         :', parsed.host);
console.log('Hostname     :', parsed.hostname);
console.log('Puerto       :', parsed.port);
console.log('Pathname     :', parsed.pathname);
console.log('Search       :', parsed.search);
console.log('Hash         :', parsed.hash);
console.log('Origin       :', parsed.origin);
console.log('');
console.log('— Parámetros (searchParams) —');
parsed.searchParams.forEach((valor, clave) => {
  console.log(`  ${clave.padEnd(8)} → ${valor}`);
});

// — API legacy (url.parse)
console.log('');
console.log('— url.parse() (API legacy) —');
const legacy = url.parse(urlCompleta, true);
console.log('  host  :', legacy.host);
console.log('  path  :', legacy.path);
console.log('  query :', legacy.query);
