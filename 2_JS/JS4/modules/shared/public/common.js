/**
 * DOCUMENTACION PARA DEFENDER
 * Archivo: modules/shared/public/common.js
 * Rol: contiene utilidades visuales reutilizables para tema, boton arriba y render de listas.
 * Idea clave: comparte el comportamiento de UI entre ejercicios sin repetir el mismo codigo en cada pantalla.
 * Como defenderlo: explicar que este modulo abstrae interacciones comunes y deja los puntos mas limpios.
 * Validacion: el tema persiste en localStorage y el boton de volver arriba se activa por scroll.
 */

// Configura los controles flotantes compartidos en la pagina actual.
export function initializeThemeAndTop({ themeButtonId, topButtonId, themeKey }) {
  // Ubica los botones flotantes de tema y de volver arriba.
  const themeButton = document.getElementById(themeButtonId);
  const topButton = document.getElementById(topButtonId);

  // Aplica el tema pedido y lo guarda en localStorage.
  function applyTheme(theme) {
    const selectedTheme = theme === "dark" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", selectedTheme);
    localStorage.setItem(themeKey, selectedTheme);
    const nextLabel =
      selectedTheme === "dark" ? "Activar modo claro" : "Activar modo oscuro";
    themeButton.setAttribute("aria-label", nextLabel);
    themeButton.setAttribute("title", nextLabel);
  }

  // Restaura el tema guardado al cargar la pagina.
  applyTheme(localStorage.getItem(themeKey) || "light");

  // Alterna entre modo claro y modo oscuro.
  themeButton.addEventListener("click", () => {
    const current = localStorage.getItem(themeKey) || "light";
    applyTheme(current === "light" ? "dark" : "light");
  });

  // Muestra el boton superior solo cuando la pagina se desplaza.
  window.addEventListener("scroll", () => {
    topButton.classList.toggle("show", window.scrollY > 240);
  });

  // Vuelve suavemente al inicio de la pagina.
  topButton.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// Pinta una caja de estado con el tono y el texto correctos.
export function renderStatus(container, message, type = "info") {
  container.className = `status-box status-${type}`;
  container.textContent = message;
}

// Envuelve una tarjeta dentro de una columna de Bootstrap.
function createColumn(content) {
  const column = document.createElement("div");
  column.className = "col-md-6";
  column.appendChild(content);
  return column;
}

// Renderiza una lista de personas usando el mismo diseño de tarjetas.
export function renderPeople(container, items, label = "Registro") {
  container.innerHTML = "";

  // Renderiza un estado vacio cuando no hay nada para mostrar.
  if (!items.length) {
    container.innerHTML = `
      <div class="col-12">
        <div class="empty-state">No hay datos para mostrar.</div>
      </div>
    `;
    return;
  }

  // Construye una tarjeta de resultado por cada elemento.
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
