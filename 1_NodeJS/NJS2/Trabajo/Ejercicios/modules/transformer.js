function transformarTexto(texto) {
  return {
    original: texto,
    uppercase: texto.toUpperCase(),
    longitud: texto.length,
    palabras: texto.trim() === '' ? 0 : texto.trim().split(/\s+/).length,
  };
}

module.exports = { transformarTexto };
