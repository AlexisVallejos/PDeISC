const datos = {
  'Buenos Aires': { temp: 22, condicion: 'Soleado' },
  Cordoba: { temp: 18, condicion: 'Nublado' },
  Rosario: { temp: 20, condicion: 'Parcialmente nublado' },
  Mendoza: { temp: 25, condicion: 'Despejado' },
  Salta: { temp: 30, condicion: 'Caluroso' },
};

function obtenerClima(ciudad) {
  return datos[ciudad] || { temp: 0, condicion: 'Ciudad no encontrada' };
}

function pronostico(ciudad) {
  const info = obtenerClima(ciudad);
  return `Clima en ${ciudad}: ${info.temp}°C — ${info.condicion}`;
}

module.exports = { obtenerClima, pronostico };
