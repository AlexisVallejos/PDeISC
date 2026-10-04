// ARCHIVO: scripts/modules/validaciones.js
// QUÉ HACE: validaciones del navegador. Dan respuesta inmediata al usuario (sin esperar al servidor),
// pero NO reemplazan las del backend: el servidor repite todas las comprobaciones.

// Valido una palabra en el navegador para dar respuesta inmediata.
export function validarPalabraFront(valor) {
  return /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]{3,20}$/.test(valor.trim()); // Solo letras (con tildes y ñ), de 3 a 20 caracteres.
}

// Convierto una tecla en la letra que entiende el juego: mayúscula y sin tilde (la Ñ se respeta).
export function normalizarLetra(valor) {
  const letra = String(valor).toLocaleUpperCase("es-AR"); // Paso a mayúscula (event.key trae "a", "Enter", "ArrowUp"...).
  if (!/^[A-ZÁÉÍÓÚÜÑ]$/.test(letra)) return null; // Si no es una sola letra (ej. "ENTER") la descarto con null.
  return letra === "Ñ" ? letra : letra.normalize("NFD").replace(/[̀-ͯ]/g, ""); // Quito la tilde, salvo la Ñ que es una letra distinta.
}

// Valido el nombre que se muestra en las posiciones.
export function validarNombreFront(valor) {
  return /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ ]{2,40}$/.test(valor.trim()); // Letras y espacios, de 2 a 40 caracteres.
}
