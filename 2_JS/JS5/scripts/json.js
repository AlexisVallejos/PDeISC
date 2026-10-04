const API_URL = "api/alumnos.php";

const state = {
  theme: localStorage.getItem("js5-theme") || "light"
};

const refs = {
  themeBtn: document.getElementById("themeBtn"),
  refreshBtn: document.getElementById("refreshBtn"),
  countChip: document.getElementById("countChip"),
  jsonPreview: document.getElementById("jsonPreview")
};

function renderButtonContent(label, iconName) {
  const icons = {
    refresh: `
      <svg class="btn-icon" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 5a7 7 0 0 1 6.32 4H16a1 1 0 1 0 0 2h4a1 1 0 0 0 1-1V6a1 1 0 1 0-2 0v1.61A9 9 0 0 0 3.12 12h2.03A7 7 0 0 1 12 5Zm8.88 7h-2.03A7 7 0 0 1 12 19a7 7 0 0 1-6.32-4H8a1 1 0 1 0 0-2H4a1 1 0 0 0-1 1v4a1 1 0 1 0 2 0v-1.61A9 9 0 0 0 20.88 12Z"/>
      </svg>
    `
  };

  return `${icons[iconName] || ""}<span>${label}</span>`;
}

function applyTheme(theme) {
  const nextTheme = theme === "dark" ? "dark" : "light";
  state.theme = nextTheme;
  document.documentElement.setAttribute("data-theme", nextTheme);
  localStorage.setItem("js5-theme", nextTheme);
  refs.themeBtn.setAttribute(
    "aria-label",
    nextTheme === "dark" ? "Activar tema claro" : "Activar tema oscuro"
  );
}

async function apiRequest(payload) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Ocurrio un error en la API.");
  }

  return data;
}

async function loadJson() {
  const data = await apiRequest({ action: "list" });
  const alumnos = data.alumnos || [];
  refs.countChip.textContent = alumnos.length === 1 ? "1 alumno" : `${alumnos.length} alumnos`;
  refs.jsonPreview.textContent = JSON.stringify(data, null, 2);
}

function setButtonLoading(button, loading, label) {
  button.disabled = loading;
  button.innerHTML = loading ? renderButtonContent(`${label}...`, "refresh") : renderButtonContent(label, "refresh");
}

function init() {
  applyTheme(state.theme);

  refs.themeBtn.addEventListener("click", () => {
    applyTheme(state.theme === "light" ? "dark" : "light");
  });

  refs.refreshBtn.addEventListener("click", async () => {
    setButtonLoading(refs.refreshBtn, true, "Actualizando JSON");
    try {
      await loadJson();
    } catch (error) {
      refs.jsonPreview.textContent = JSON.stringify(
        { ok: false, message: error.message },
        null,
        2
      );
    } finally {
      setButtonLoading(refs.refreshBtn, false, "Actualizar JSON");
    }
  });

  loadJson().catch((error) => {
    refs.jsonPreview.textContent = JSON.stringify({ ok: false, message: error.message }, null, 2);
  });
}

init();
