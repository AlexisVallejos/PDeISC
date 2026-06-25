// Modulo nativo: File System
// Funcion minima para escribir archivos dentro del proyecto.

import fs from 'node:fs';
import path from 'node:path';

export function escribirArchivo(rutaArchivo, contenido) {
  // Crea la carpeta destino si todavia no existe.
  const carpeta = path.dirname(rutaArchivo);
  if (!fs.existsSync(carpeta)) {
    fs.mkdirSync(carpeta, { recursive: true });
  }
  fs.writeFileSync(rutaArchivo, contenido, 'utf8');
}
