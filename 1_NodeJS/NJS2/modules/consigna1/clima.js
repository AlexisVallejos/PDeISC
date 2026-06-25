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
