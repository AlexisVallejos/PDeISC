/**
 * DOCUMENTACION PARA DEFENDER
 * Archivo: modules/shared/public/common.js
 * Rol: contiene utilidades visuales reutilizables para tema, boton arriba y render de listas.
 * Idea clave: comparte el comportamiento de UI entre ejercicios sin repetir el mismo codigo en cada pantalla.
 * Como defenderlo: explicar que este modulo abstrae interacciones comunes y deja los puntos mas limpios.
 * Validacion: el tema persiste en localStorage y el boton de volver arriba se activa por scroll.
 */

// Set up the shared floating controls on the current page.
export function initializeThemeAndTop({ themeButtonId, topButtonId, themeKey }) {
  // Locate the floating buttons for theme and scroll-to-top.
  const themeButton = document.getElementById(themeButtonId);
  const topButton = document.getElementById(topButtonId);

  // Apply the requested theme and persist it in localStorage.
  function applyTheme(theme) {
    const selectedTheme = theme === "dark" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", selectedTheme);
    localStorage.setItem(themeKey, selectedTheme);
    const nextLabel =
      selectedTheme === "dark" ? "Activar modo claro" : "Activar modo oscuro";
    themeButton.setAttribute("aria-label", nextLabel);
    themeButton.setAttribute("title", nextLabel);
  }

  // Restore the saved theme on page load.
  applyTheme(localStorage.getItem(themeKey) || "light");

  // Toggle between light and dark mode.
  themeButton.addEventListener("click", () => {
    const current = localStorage.getItem(themeKey) || "light";
    applyTheme(current === "light" ? "dark" : "light");
  });

  // Show the top button only when the page is scrolled.
  window.addEventListener("scroll", () => {
    topButton.classList.toggle("show", window.scrollY > 240);
  });

  // Smoothly return to the top of the page.
  topButton.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// Paint a status box with the correct tone and text.
export function renderStatus(container, message, type = "info") {
  container.className = `status-box status-${type}`;
  container.textContent = message;
}

// Wrap a card inside a Bootstrap column.
function createColumn(content) {
  const column = document.createElement("div");
  column.className = "col-md-6";
  column.appendChild(content);
  return column;
}

// Render a list of people using the shared card layout.
export function renderPeople(container, items, label = "Registro") {
  container.innerHTML = "";

  // Render an empty state when there is nothing to show.
  if (!items.length) {
    container.innerHTML = `
      <div class="col-12">
        <div class="empty-state">No hay datos para mostrar.</div>
      </div>
    `;
    return;
  }

  // Build one result card per item.
  items.forEach((item) => {
    const card = document.createElement("article");
    card.className = "result-card";
    card.innerHTML = `
      <p class="result-label">${label}</p>
      <h3>${item.title}</h3>
      <p class="result-copy mb-0">${item.subtitle}</p>
    `;
    container.appendChild(createColumn(card));
  });
}
