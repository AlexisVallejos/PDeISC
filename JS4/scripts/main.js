import { initializeThemeAndTop } from "/shared/common.js";

const launcherGrid = document.getElementById("launcher-grid");

function createCard(item) {
  const column = document.createElement("div");
  column.className = "col-md-6 col-xl-3";
  column.innerHTML = `
    <article class="launcher-card">
      <div class="card-topline">
        <p class="method-pill">${item.titulo}</p>
        <p class="port-pill">:${item.puerto}</p>
      </div>
      <h3>${item.subtitulo}</h3>
      <p class="card-copy">${item.descripcion}</p>
      <a class="open-btn" href="${item.ruta}" target="_blank" rel="noreferrer">
        <span>Abrir servidor</span>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M14 5h5v5h-2V8.41l-6.29 6.3-1.42-1.42 6.3-6.29H14V5ZM5 7a2 2 0 0 1 2-2h4v2H7v10h10v-4h2v4a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7Z"/>
        </svg>
      </a>
    </article>
  `;
  return column;
}

async function loadLauncher() {
  const response = await fetch("/api/launcher");
  const items = await response.json();
  launcherGrid.innerHTML = "";
  items.forEach((item) => launcherGrid.appendChild(createCard(item)));
}

loadLauncher();

initializeThemeAndTop({
  themeButtonId: "theme-btn",
  topButtonId: "back-to-top",
  themeKey: "js4-launcher-theme"
});
