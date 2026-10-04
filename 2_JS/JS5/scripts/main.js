/**
 * DOCUMENTACION PARA DEFENDER
 * Archivo: scripts/main.js
 * Rol: controla el CRUD principal de JS5 y consume la API REST por POST.
 * Idea clave: el formulario sirve para crear y editar, mientras la tabla maneja eliminar por fila.
 * Como defenderlo: el frontend solo envía acciones; el backend decide que se guarda en alumnosDB.
 * Validacion: cada accion revisa errores, actualiza la tabla y refleja el modo edicion cuando corresponde.
 */

const API_URL = "api/alumnos.php";

const state = {
  theme: localStorage.getItem("js5-theme") || "light",
  alumnos: [],
  editingId: null
};

const refs = {
  themeBtn: document.getElementById("themeBtn"),
  toTop: document.getElementById("toTop"),
  openFormBtn: document.getElementById("openFormBtn"),
  closeFormBtn: document.getElementById("closeFormBtn"),
  studentModal: document.getElementById("studentModal"),
  saveBtn: document.getElementById("saveBtn"),
  cancelEditBtn: document.getElementById("cancelEditBtn"),
  alumnoForm: document.getElementById("alumnoForm"),
  alumnoId: document.getElementById("alumnoId"),
  nombre: document.getElementById("nombre"),
  apellido: document.getElementById("apellido"),
  edad: document.getElementById("edad"),
  formStatus: document.getElementById("formStatus"),
  countChip: document.getElementById("countChip"),
  tableBody: document.getElementById("tableBody"),
  jsonLink: document.getElementById("jsonLink")
};

function iconSvg(name) {
  const icons = {
    plus: `
      <svg class="btn-icon" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M11 5a1 1 0 0 1 2 0v6h6a1 1 0 1 1 0 2h-6v6a1 1 0 1 1-2 0v-6H5a1 1 0 1 1 0-2h6V5Z"/>
      </svg>
    `,
    edit: `
      <svg class="btn-icon" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 17.25V20h2.75L17.8 8.94l-2.75-2.75L4 17.25Zm14.71-8.54a1 1 0 0 0 0-1.42l-2-2a1 1 0 0 0-1.42 0l-1.33 1.33 3.42 3.42 1.33-1.33Z"/>
      </svg>
    `,
    trash: `
      <svg class="btn-icon" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M9 3a1 1 0 0 0-1 1v1H4a1 1 0 1 0 0 2h16a1 1 0 1 0 0-2h-4V4a1 1 0 0 0-1-1H9Zm1 2h4v0H10ZM7 8h10l-.8 11.2A2 2 0 0 1 14.2 21H9.8a2 2 0 0 1-2-1.8L7 8Zm3 2a1 1 0 0 0-1 1v6a1 1 0 1 0 2 0v-6a1 1 0 0 0-1-1Zm4 0a1 1 0 0 0-1 1v6a1 1 0 1 0 2 0v-6a1 1 0 0 0-1-1Z"/>
      </svg>
    `,
    json: `
      <svg class="btn-icon" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M8.5 7.5a1 1 0 0 0-1-1H6A2 2 0 0 0 4 8.5v7A2 2 0 0 0 6 17.5h1.5a1 1 0 1 0 0-2H6v-7h1.5a1 1 0 0 0 1-1Zm7 0a1 1 0 0 0 1 1H18v7h-1.5a1 1 0 1 0 0 2H18a2 2 0 0 0 2-2.5v-7A2 2 0 0 0 18 6.5h-1.5a1 1 0 0 0-1 1ZM10 8.5a1 1 0 0 0-1.95-.32l-2 8a1 1 0 0 0 1.9.64l2-8A1 1 0 0 0 10 8.5Zm4.2.1a1 1 0 0 0-1.4 1.42l1.58 1.58-1.58 1.58a1 1 0 1 0 1.4 1.42l2.3-2.3a1 1 0 0 0 0-1.42l-2.3-2.28Z"/>
      </svg>
    `
  };

  return icons[name] || "";
}

function renderButtonContent(label, iconName) {
  return `${iconSvg(iconName)}<span>${label}</span>`;
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

function toggleTheme() {
  applyTheme(state.theme === "light" ? "dark" : "light");
}

function updateCount(total) {
  refs.countChip.textContent = total === 1 ? "1 alumno" : `${total} alumnos`;
}

function setStatus(message, tone = "info") {
  refs.formStatus.dataset.tone = tone;
  refs.formStatus.textContent = message;
}

function openModal() {
  refs.studentModal.hidden = false;
  refs.studentModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  window.setTimeout(() => refs.nombre.focus(), 0);
}

function closeModal() {
  refs.studentModal.hidden = true;
  refs.studentModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

function resetEditMode() {
  state.editingId = null;
  refs.alumnoId.value = "";
  refs.alumnoForm.dataset.mode = "create";
  refs.saveBtn.innerHTML = `${renderButtonContent("Guardar alumno", "plus")}`;
  refs.cancelEditBtn.hidden = true;
}

function startEdit(alumno) {
  state.editingId = alumno.id;
  refs.alumnoId.value = alumno.id;
  refs.nombre.value = alumno.nombre;
  refs.apellido.value = alumno.apellido;
  refs.edad.value = alumno.edad;
  refs.alumnoForm.dataset.mode = "edit";
  refs.saveBtn.innerHTML = `${renderButtonContent("Actualizar alumno", "edit")}`;
  refs.cancelEditBtn.hidden = false;
  setStatus(`Editando alumno #${alumno.id}.`, "info");
  openModal();
  refs.nombre.focus();
}

function renderTable(alumnos) {
  if (!alumnos.length) {
    refs.tableBody.innerHTML = `
      <tr>
        <td colspan="5" class="empty-row">Todavia no hay alumnos cargados.</td>
      </tr>
    `;
    return;
  }

  refs.tableBody.innerHTML = alumnos
    .map(
      (alumno) => `
        <tr data-id="${alumno.id}">
          <td>${alumno.id}</td>
          <td>${alumno.nombre}</td>
          <td>${alumno.apellido}</td>
          <td>${alumno.edad}</td>
          <td>
            <div class="row-actions">
              <button class="btn btn-ghost btn-mini action-btn action-btn-edit" type="button" data-action="edit" data-id="${alumno.id}">
                ${iconSvg("edit")}
                <span>Editar</span>
              </button>
              <button class="btn btn-secondary btn-mini action-btn action-btn-delete" type="button" data-action="delete" data-id="${alumno.id}">
                ${iconSvg("trash")}
                <span>Eliminar</span>
              </button>
            </div>
          </td>
        </tr>
      `
    )
    .join("");
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

async function loadData() {
  const data = await apiRequest({ action: "list" });
  state.alumnos = data.alumnos || [];
  updateCount(state.alumnos.length);
  renderTable(state.alumnos);
  return data;
}

function setButtonLoading(button, loading, label, iconName = "plus") {
  button.disabled = loading;
  button.innerHTML = loading ? `${renderButtonContent(`${label}...`, iconName)}` : renderButtonContent(label, iconName);
}

async function saveAlumno(event) {
  event.preventDefault();
  const isEditing = Boolean(state.editingId);
  const saveLabel = isEditing ? "Actualizar alumno" : "Guardar alumno";
  const saveIcon = isEditing ? "edit" : "plus";
  setButtonLoading(refs.saveBtn, true, isEditing ? "Actualizando" : "Guardando", saveIcon);

  const payload = {
    action: isEditing ? "update" : "create",
    id: refs.alumnoId.value,
    nombre: refs.nombre.value.trim(),
    apellido: refs.apellido.value.trim(),
    edad: refs.edad.value
  };

  setStatus(isEditing ? "Actualizando alumno..." : "Guardando alumno...", "info");

  try {
    const data = await apiRequest(payload);
    setStatus(data.message, "success");
    refs.alumnoForm.reset();
    resetEditMode();
    closeModal();
    await loadData();
  } catch (error) {
    setStatus(error.message || "No se pudo guardar el alumno.", "error");
  } finally {
    setButtonLoading(refs.saveBtn, false, saveLabel, saveIcon);
  }
}

async function deleteAlumno(id) {
  setStatus(`Eliminando alumno #${id}...`, "info");

  try {
    await apiRequest({ action: "delete", id });
    if (String(state.editingId) === String(id)) {
      refs.alumnoForm.reset();
      resetEditMode();
    }
    await loadData();
    setStatus("Alumno eliminado correctamente.", "success");
  } catch (error) {
    setStatus(error.message || "No se pudo eliminar el alumno.", "error");
  }
}

function bindTableActions() {
  refs.tableBody.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-action]");
    if (!trigger) {
      return;
    }

    const id = Number(trigger.dataset.id);
    const alumno = state.alumnos.find((item) => item.id === id);

    if (trigger.dataset.action === "edit" && alumno) {
      startEdit(alumno);
    }

    if (trigger.dataset.action === "delete" && id) {
      deleteAlumno(id);
    }
  });
}

function bindScrollTop() {
  window.addEventListener("scroll", () => {
    refs.toTop.classList.toggle("show", window.scrollY > 180);
  });

  refs.toTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

function init() {
  applyTheme(state.theme);
  resetEditMode();

  refs.themeBtn.addEventListener("click", toggleTheme);
  refs.openFormBtn.addEventListener("click", () => {
    refs.alumnoForm.reset();
    resetEditMode();
    setStatus("Listo para registrar un alumno nuevo.", "info");
    openModal();
  });
  refs.closeFormBtn.addEventListener("click", () => {
    refs.alumnoForm.reset();
    resetEditMode();
    closeModal();
    setStatus("Ventana cerrada.", "info");
  });
  refs.cancelEditBtn.addEventListener("click", () => {
    refs.alumnoForm.reset();
    resetEditMode();
    closeModal();
    setStatus("Edicion cancelada.", "info");
  });
  refs.alumnoForm.addEventListener("submit", saveAlumno);
  bindTableActions();
  bindScrollTop();
  refs.studentModal.addEventListener("click", (event) => {
    if (event.target.classList.contains("modal-backdrop")) {
      refs.alumnoForm.reset();
      resetEditMode();
      closeModal();
    }
  });

  if (refs.jsonLink) {
    refs.jsonLink.href = "json.php";
  }

  loadData().catch((error) => {
    setStatus(error.message || "No se pudo cargar la informacion inicial.", "error");
  });
}

init();
