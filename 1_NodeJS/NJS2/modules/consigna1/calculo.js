// Modulo propio: operaciones matematicas basicas.

export function sumar(a, b) {
  return Number(a) + Number(b);
}

export function restar(a, b) {
  return Number(a) - Number(b);
}

export function multiplicar(a, b) {
  return Number(a) * Number(b);
}

export function dividir(a, b) {
  if (Number(b) === 0) return 'Error: division por cero';
  return Number(a) / Number(b);
}

export function potencia(base, exp) {
  return Math.pow(Number(base), Number(exp));
}
