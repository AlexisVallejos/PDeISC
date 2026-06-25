export function initializeThemeAndTop({ themeButtonId, topButtonId, themeKey }) {
  const themeButton = document.getElementById(themeButtonId);
  const topButton = document.getElementById(topButtonId);

  function applyTheme(theme) {
    const selectedTheme = theme === "dark" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", selectedTheme);
    localStorage.setItem(themeKey, selectedTheme);
    const nextLabel =
      selectedTheme === "dark" ? "Activar modo claro" : "Activar modo oscuro";
    themeButton.setAttribute("aria-label", nextLabel);
    themeButton.setAttribute("title", nextLabel);
  }

  applyTheme(localStorage.getItem(themeKey) || "light");

  themeButton.addEventListener("click", () => {
    const current = localStorage.getItem(themeKey) || "light";
    applyTheme(current === "light" ? "dark" : "light");
  });

  window.addEventListener("scroll", () => {
    topButton.classList.toggle("show", window.scrollY > 240);
  });

  topButton.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

export function renderStatus(container, message, type = "info") {
  container.className = `status-box status-${type}`;
  container.textContent = message;
}

function createColumn(content) {
  const column = document.createElement("div");
  column.className = "col-md-6";
  column.appendChild(content);
  return column;
}

export function renderPeople(container, items, label = "Registro") {
  container.innerHTML = "";

  if (!items.length) {
    container.innerHTML = `
      <div class="col-12">
        <div class="empty-state">No hay datos para mostrar.</div>
      </div>
    `;
    return;
  }

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
