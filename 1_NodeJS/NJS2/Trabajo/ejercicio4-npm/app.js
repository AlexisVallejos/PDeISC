// Ejecutar primero: npm install
const { upperCase } = require('upper-case');

const frases = [
  'hola mundo desde node.js',
  'aprendiendo npm con ejercicios prácticos',
  'los módulos de node.js son muy útiles',
  'programación en javascript del lado del servidor',
];

console.log('╔══════════════════════════════════════════╗');
console.log('║   EJERCICIO 4 — Paquete NPM: upper-case  ║');
console.log('╚══════════════════════════════════════════╝\n');

frases.forEach((frase, i) => {
  console.log(`Frase ${i + 1} original  : ${frase}`);
  console.log(`Frase ${i + 1} UPPERCASE : ${upperCase(frase)}`);
  console.log('');
});
