// ARCHIVO: modules/puntajes.js
// QUÉ HACE: capa fina entre las rutas y el almacén de datos. Las rutas no saben si los puntajes
// están en MySQL o en un archivo: solo llaman a estas dos funciones.

// Guardo un resultado final en el almacén activo (MySQL o archivo local).
export function guardarPuntaje(almacen, datos) {
  return almacen.guardar(datos); // Delego en el almacén; devuelve una promesa con el puntaje guardado.
}

// Leo la tabla ordenada por puntos y después por menor tiempo.
export function listarPuntajes(almacen) {
  return almacen.listar(); // El almacén ya devuelve los datos ordenados y limitados a 100.
}
