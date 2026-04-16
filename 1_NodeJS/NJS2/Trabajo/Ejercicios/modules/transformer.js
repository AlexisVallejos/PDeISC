const { upperCase } = require('upper-case');

function transformarTexto(texto) {
  return {
    original:  texto,
    uppercase: upperCase(texto),
    longitud:  texto.length,
    palabras:  texto.trim() === '' ? 0 : texto.trim().split(/\s+/).length,
  };
}

module.exports = { transformarTexto };
