// Ejecutar con: node scripts/seed.js
// Genera datos de ejemplo en data/posts.json

const fs   = require('fs');
const path = require('path');

const posts = [
  { id: 1, titulo: '¿Qué es Node.js?',          fecha: '2026-04-01', categoria: 'Node.js'  },
  { id: 2, titulo: 'Módulos en Node.js',          fecha: '2026-04-05', categoria: 'Node.js'  },
  { id: 3, titulo: 'Crear un servidor HTTP',      fecha: '2026-04-08', categoria: 'Node.js'  },
  { id: 4, titulo: 'Next.js desde cero',          fecha: '2026-04-10', categoria: 'Next.js'  },
  { id: 5, titulo: 'NPM: guía completa',          fecha: '2026-04-12', categoria: 'NPM'      },
];

const dataDir  = path.join(__dirname, '..', 'data');
const outFile  = path.join(dataDir, 'posts.json');

if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

fs.writeFileSync(outFile, JSON.stringify(posts, null, 2), 'utf8');
console.log(`Datos generados → ${outFile}`);
