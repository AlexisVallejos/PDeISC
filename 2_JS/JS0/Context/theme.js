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
