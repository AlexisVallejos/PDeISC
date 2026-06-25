/**
 * DOCUMENTACION PARA DEFENDER
 * Archivo: ejercicios/ejercicio4/calculos.js
 * Rol: contiene la solucion principal de un ejercicio y puede exportar datos para usarla desde servidor o navegador.
 * Idea clave: mantener este codigo separado ayuda a explicar que hace cada parte sin mezclar responsabilidades.
 * Como defenderlo: explicar primero que datos entran, que proceso se aplica y que salida produce.
 * Validacion: remarcar donde se controlan errores para que la app no falle con datos incorrectos.
 */
export function sumar(a, b) {
  return a + b;
}

// restar: Agrupa una parte de la logica para que el archivo sea mas facil de leer y defender.
export function restar(a, b) {
  return a - b;
}

// multiplicar: Agrupa una parte de la logica para que el archivo sea mas facil de leer y defender.
export function multiplicar(a, b) {
  return a * b;
}

// dividir: Agrupa una parte de la logica para que el archivo sea mas facil de leer y defender.
export function dividir(a, b) {
  return a / b;
}
