/**
 * DOCUMENTACION PARA DEFENDER
 * Archivo: modules/consigna2/archivos.js
 * Rol: forma parte del proyecto y separa responsabilidades para que el codigo sea mas facil de explicar y mantener.
 * Idea clave: mantener este codigo separado ayuda a explicar que hace cada parte sin mezclar responsabilidades.
 * Como defenderlo: explicar primero que datos entran, que proceso se aplica y que salida produce.
 * Validacion: remarcar donde se controlan errores para que la app no falle con datos incorrectos.
 */
// Modulo nativo: File System
// Funcion minima para escribir archivos dentro del proyecto.

import fs from 'node:fs';
import path from 'node:path';

// escribirArchivo: Agrupa una parte de la logica para que el archivo sea mas facil de leer y defender.
export function escribirArchivo(rutaArchivo, contenido) {
  // Crea la carpeta destino si todavia no existe.
  const carpeta = path.dirname(rutaArchivo);
  if (!fs.existsSync(carpeta)) {
    fs.mkdirSync(carpeta, { recursive: true });
  }
  fs.writeFileSync(rutaArchivo, contenido, 'utf8');
}
