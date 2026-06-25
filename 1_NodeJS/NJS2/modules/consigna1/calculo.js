/**
 * DOCUMENTACION PARA DEFENDER
 * Archivo: modules/consigna1/calculo.js
 * Rol: forma parte del proyecto y separa responsabilidades para que el codigo sea mas facil de explicar y mantener.
 * Idea clave: mantener este codigo separado ayuda a explicar que hace cada parte sin mezclar responsabilidades.
 * Como defenderlo: explicar primero que datos entran, que proceso se aplica y que salida produce.
 * Validacion: remarcar donde se controlan errores para que la app no falle con datos incorrectos.
 */
// Modulo propio: operaciones matematicas basicas.

export function sumar(a, b) {
  return Number(a) + Number(b);
}

// restar: Agrupa una parte de la logica para que el archivo sea mas facil de leer y defender.
export function restar(a, b) {
  return Number(a) - Number(b);
}

// multiplicar: Agrupa una parte de la logica para que el archivo sea mas facil de leer y defender.
export function multiplicar(a, b) {
  return Number(a) * Number(b);
}

// dividir: Agrupa una parte de la logica para que el archivo sea mas facil de leer y defender.
export function dividir(a, b) {
  if (Number(b) === 0) return 'Error: division por cero';
  return Number(a) / Number(b);
}

// potencia: Agrupa una parte de la logica para que el archivo sea mas facil de leer y defender.
export function potencia(base, exp) {
  return Math.pow(Number(base), Number(exp));
}
