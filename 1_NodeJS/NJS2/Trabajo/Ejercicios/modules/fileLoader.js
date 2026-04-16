const fs   = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

function leerArchivo(rutaRelativa, callback) {
  const rutaAbsoluta = path.join(ROOT, rutaRelativa);
  fs.readFile(rutaAbsoluta, callback);
}

module.exports = { leerArchivo };
