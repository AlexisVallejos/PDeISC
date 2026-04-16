const { pronostico, obtenerClima } = require('./modules/clima');
const { sumar, restar, multiplicar, dividir, potencia, porcentaje } = require('./modules/calculo');

console.log('╔══════════════════════════════════════════╗');
console.log('║   EJERCICIO 1 — Módulos propios          ║');
console.log('╚══════════════════════════════════════════╝\n');

console.log('—— Módulo CLIMA ——');
['Buenos Aires', 'Cordoba', 'Rosario', 'Mendoza', 'Salta'].forEach(ciudad => {
  console.log(' ', pronostico(ciudad));
});

console.log('\n—— Módulo CÁLCULO ——');
console.log('  Suma        5 + 3   =', sumar(5, 3));
console.log('  Resta       10 - 4  =', restar(10, 4));
console.log('  Multiplicar 6 × 7   =', multiplicar(6, 7));
console.log('  Dividir     20 / 4  =', dividir(20, 4));
console.log('  Potencia    2 ^ 8   =', potencia(2, 8));
console.log('  Porcentaje  30/200  =', porcentaje(30, 200).toFixed(2) + '%');
