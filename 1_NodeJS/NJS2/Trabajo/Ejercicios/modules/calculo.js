function sumar(a, b) { return a + b; }
function restar(a, b) { return a - b; }
function multiplicar(a, b) { return a * b; }
function dividir(a, b) {
  if (b === 0) throw new Error('División por cero no permitida');
  return a / b;
}
function potencia(base, exp) { return Math.pow(base, exp); }
function porcentaje(valor, total) { return (valor * 100) / total; }

module.exports = { sumar, restar, multiplicar, dividir, potencia, porcentaje };
