/**
 * DOCUMENTACION PARA DEFENDER
 * Archivo: modules/consigna1/clima.js
 * Rol: forma parte del proyecto y separa responsabilidades para que el codigo sea mas facil de explicar y mantener.
 * Idea clave: mantener este codigo separado ayuda a explicar que hace cada parte sin mezclar responsabilidades.
 * Como defenderlo: explicar primero que datos entran, que proceso se aplica y que salida produce.
 * Validacion: remarcar donde se controlan errores para que la app no falle con datos incorrectos.
 */
// Modulo propio: clima hardcodeado
// Mantiene la consigna simple y sin depender de APIs externas.

export function getClimaActual(ciudad = 'Mar del Plata') {
  return {
    ciudad,
    pais: 'Argentina',
    temperaturaC: 18,
    condicion: 'Parcialmente nublado',
    actualizado: 'Dato hardcodeado',
  };
}
