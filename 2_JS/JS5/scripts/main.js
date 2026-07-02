/**
 * DOCUMENTACION PARA DEFENDER
 * Archivo: scripts/main.js
 * Rol: controla la interfaz de JS5, consume la API REST y actualiza la tabla de alumnos.
 * Idea clave: la UI separa carga, alta y limpieza de datos para demostrar el flujo completo con la base local.
 * Como defenderlo: mostrar que el frontend solo pinta datos y el backend decide qué se guarda en alumnosDB.
 * Validacion: cada accion revisa errores, actualiza la tabla y sincroniza el panel JSON en pantalla.
 */

const state = {
  theme: localStorage.getItem("js5-theme") || "light",
  alumnos: [],
  stats: null
};

const refs = {
  themeBtn: document.getElementById("themeBtn"),
  toTop: document.getElementById("toTop"),
  seedBtn: document.getElementById("seedBtn"),
  clearBtn: document.getElementById("clearBtn"),
  refreshBtn: document.getElementById("refreshBtn"),
  saveBtn: document.getElementById("saveBtn"),
  alumnoForm: document.getElementById("alumnoForm"),
  nombre: document.getElementById("nombre"),
  apellido: document.getElementById("apellido"),
  edad: document.getElementById("edad"),
  formStatus: document.getElementById("formStatus"),
  countChip: document.getElementById("countChip"),
  tableBody: document.getElementById("tableBody"),
  jsonPreview: document.getElementById("jsonPreview")
};

// Apply the stored theme and keep the title of the toggle in sync.
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

// Toggle between the two themes used by the interface.
function toggleTheme() {
  applyTheme(state.theme === "light" ? "dark" : "light");
}

// Update the top-right counter chip.
function updateCount(total) {
  refs.countChip.textContent = total === 1 ? "1 alumno" : `${total} alumnos`;
}

// Show a concise status message for form and actions.
function setStatus(message, tone = "info") {
  refs.formStatus.dataset.tone = tone;
  refs.formStatus.textContent = message;
}

// Render the table with the latest data.
function renderTable(alumnos) {
  if (!alumnos.length) {
    refs.tableBody.innerHTML = `
      <tr>
        <td colspan="4" class="empty-row">Todavía no hay alumnos cargados.</td>
      </tr>
    `;
    return;
  }

  refs.tableBody.innerHTML = alumnos
    .map(
      (alumno) => `
        <tr>
          <td>${alumno.id}</td>
          <td>${alumno.nombre}</td>
          <td>${alumno.apellido}</td>
          <td>${alumno.edad}</td>
        </tr>
      `
    )
    .join("");
}

// Render the API response preview as formatted JSON.
function renderJsonPreview(payload) {
  refs.jsonPreview.textContent = JSON.stringify(payload, null, 2);
}

// Fetch both metadata and student rows from the API.
async function loadData() {
  const [statsResponse, alumnosResponse] = await Promise.all([
    fetch("/api/stats"),
    fetch("/api/alumnos")
  ]);

  if (!statsResponse.ok || !alumnosResponse.ok) {
    throw new Error("No se pudo leer la API.");
  }

  const statsData = await statsResponse.json();
  const alumnosData = await alumnosResponse.json();
  state.stats = statsData;
  state.alumnos = alumnosData.alumnos || [];

  updateCount(state.alumnos.length);
  renderTable(state.alumnos);
  renderJsonPreview(alumnosData);
}

// Set loading state on a button during async operations.
function setButtonLoading(button, loading, label) {
  button.disabled = loading;
  button.textContent = loading ? `${label}...` : label;
}

// Load the five example students into the database.
async function seedDemo() {
  setButtonLoading(refs.seedBtn, true, "Cargando ejemplos");
  setStatus("Cargando los 5 alumnos de ejemplo...", "info");

  try {
    const response = await fetch("/api/alumnos/seed", { method: "POST" });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "No se pudieron cargar los ejemplos.");
    }

    setStatus(data.message, "success");
    await loadData();
  } catch (error) {
    setStatus(error.message || "Error al cargar los ejemplos.", "error");
  } finally {
    setButtonLoading(refs.seedBtn, false, "Cargar 5 ejemplos");
  }
}

// Remove all students from the database.
async function clearTable() {
  setButtonLoading(refs.clearBtn, true, "Vaciando tabla");
  setStatus("Vaciando la tabla de alumnos...", "info");

  try {
    const response = await fetch("/api/alumnos", { method: "DELETE" });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "No se pudo vaciar la tabla.");
    }

    setStatus(data.message, "success");
    await loadData();
  } catch (error) {
    setStatus(error.message || "Error al vaciar la tabla.", "error");
  } finally {
    setButtonLoading(refs.clearBtn, false, "Vaciar tabla");
  }
}

// Save a manually entered student.
async function saveAlumno(event) {
  event.preventDefault();
  setButtonLoading(refs.saveBtn, true, "Guardando");

  const payload = {
    nombre: refs.nombre.value.trim(),
    apellido: refs.apellido.value.trim(),
    edad: refs.edad.value
  };

  setStatus("Guardando alumno...", "info");

  try {
    const response = await fetch("/api/alumnos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "No se pudo crear el alumno.");
    }

    setStatus(data.message, "success");
    refs.alumnoForm.reset();
    await loadData();
  } catch (error) {
    setStatus(error.message || "No se pudo crear el alumno.", "error");
  } finally {
    setButtonLoading(refs.saveBtn, false, "Guardar alumno");
  }
}

// Scroll back to the top of the page smoothly.
function bindScrollTop() {
  window.addEventListener("scroll", () => {
    refs.toTop.classList.toggle("show", window.scrollY > 180);
  });

  refs.toTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// Wire all controls and load the initial state.
function init() {
  applyTheme(state.theme);

  refs.themeBtn.addEventListener("click", toggleTheme);
  refs.seedBtn.addEventListener("click", seedDemo);
  refs.clearBtn.addEventListener("click", clearTable);
  refs.refreshBtn.addEventListener("click", () => loadData().catch((error) => setStatus(error.message, "error")));
  refs.alumnoForm.addEventListener("submit", saveAlumno);

  bindScrollTop();

  loadData().catch((error) => {
    setStatus(error.message || "No se pudo cargar la información inicial.", "error");
    renderJsonPreview({ ok: false, message: error.message });
  });
}

init();
