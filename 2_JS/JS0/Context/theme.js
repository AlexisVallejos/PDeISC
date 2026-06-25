/**
 * DOCUMENTACION PARA DEFENDER
 * Archivo: Context/theme.js
 * Rol: forma parte del proyecto y separa responsabilidades para que el codigo sea mas facil de explicar y mantener.
 * Idea clave: mantener este codigo separado ayuda a explicar que hace cada parte sin mezclar responsabilidades.
 * Como defenderlo: explicar primero que datos entran, que proceso se aplica y que salida produce.
 * Validacion: remarcar donde se controlan errores para que la app no falle con datos incorrectos.
 */
// Guarda y recupera el tema elegido por el usuario.
export function getTheme() {
  return localStorage.getItem("theme") || "light";
}

// Aplica el tema actual al documento.
export function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
}

// Cambia entre tema claro y oscuro.
export function toggleTheme() {
  const current = getTheme();
  const next = current === "light" ? "dark" : "light";
  localStorage.setItem("theme", next);
  applyTheme(next);
  return next;
}
