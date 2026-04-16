function obtenerClima(ciudad = 'Quito') {
  const condiciones = [
    { estado: 'Soleado', temperatura: 25 },
    { estado: 'Lluvioso', temperatura: 18 },
    { estado: 'Nublado', temperatura: 20 },
    { estado: 'Ventoso', temperatura: 17 },
  ];

  const indice = ciudad.length % condiciones.length;
  const clima = condiciones[indice];

  return {
    ciudad,
    estado: clima.estado,
    temperatura: clima.temperatura,
  };
}

module.exports = {
  obtenerClima,
};
