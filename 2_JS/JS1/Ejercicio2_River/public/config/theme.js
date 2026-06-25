// Configuracion de tema (claro/oscuro) para el proyecto.
(function () {
  const KEY = "js1-theme";

  function getTheme() {
    return localStorage.getItem(KEY) || "dark";
  }

  function applyTheme(theme) {
    document.body.classList.remove("light-theme", "dark-theme");
    document.body.classList.add(theme === "light" ? "light-theme" : "dark-theme");
  }

  function saveTheme(theme) {
    localStorage.setItem(KEY, theme);
  }

  function toggleTheme() {
    const next = getTheme() === "dark" ? "light" : "dark";
    saveTheme(next);
    applyTheme(next);
    return next;
  }

  window.themeConfig = { getTheme, applyTheme, saveTheme, toggleTheme };
})();
