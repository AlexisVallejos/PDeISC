/**
 * DOCUMENTACION PARA DEFENDER
 * Archivo: Ejercicio1_Formulario/public/config/theme.js
 * Rol: centraliza el cambio de tema claro/oscuro y lo persiste en localStorage.
 * Idea clave: mantener este codigo separado ayuda a explicar que hace cada parte sin mezclar responsabilidades.
 * Como defenderlo: explicar primero que datos entran, que proceso se aplica y que salida produce.
 * Validacion: remarcar donde se controlan errores para que la app no falle con datos incorrectos.
 */
// Configuracion de tema (claro/oscuro) para el proyecto.
(function () {
  const KEY = "js1-theme";

  // getTheme: Obtiene y devuelve informacion sin modificar el estado principal.
  function getTheme() {
    return localStorage.getItem(KEY) || "dark";
  }

  // applyTheme: Aplica o guarda configuracion de interfaz, como el tema visual.
  function applyTheme(theme) {
    document.body.classList.remove("light-theme", "dark-theme");
    document.body.classList.add(theme === "light" ? "light-theme" : "dark-theme");
  }

  // saveTheme: Aplica o guarda configuracion de interfaz, como el tema visual.
  function saveTheme(theme) {
    localStorage.setItem(KEY, theme);
  }

  // toggleTheme: Aplica o guarda configuracion de interfaz, como el tema visual.
  function toggleTheme() {
    const next = getTheme() === "dark" ? "light" : "dark";
    saveTheme(next);
    applyTheme(next);
    return next;
  }

  window.themeConfig = { getTheme, applyTheme, saveTheme, toggleTheme };
})();
