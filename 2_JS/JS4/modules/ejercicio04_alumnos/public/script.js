/**
 * DOCUMENTACION PARA DEFENDER
 * Archivo: modules/ejercicio04_alumnos/public/script.js
 * Rol: muestra la misma API con dos vistas, una via Fetch y otra via Axios.
 * Idea clave: comparar dos clientes sobre la misma ruta ayuda a defender diferencias de sintaxis y uso.
 * Como defenderlo: mostrar que ambos paneles usan el mismo endpoint y el mismo render compartido.
 * Validacion: cada boton maneja errores por separado y deja trazabilidad en su propio panel.
 */
import {
  initializeThemeAndTop,
  renderPeople,
  renderStatus
} from "/shared/common.js";

// Controls for the two comparison panels.
const fetchButton = document.getElementById("fetch-btn");
const axiosButton = document.getElementById("axios-btn");
const fetchStatus = document.getElementById("fetch-status");
const axiosStatus = document.getElementById("axios-status");
const fetchResults = document.getElementById("fetch-results");
const axiosResults = document.getElementById("axios-results");
const studentCount = document.getElementById("student-count");

// Convert the API response into the shared render format.
function mapStudents(students) {
  return students.map((student) => ({
    title: student.nombre,
    subtitle: student.email
  }));
}

// Keep the counter chip synchronized with the rendered list.
function updateCounter(total) {
  studentCount.textContent = total === 1 ? "1 alumno" : `${total} alumnos`;
}

// Render a default empty state for one panel.
function clearPanel(statusBox, resultsContainer, defaultMessage) {
  renderStatus(statusBox, defaultMessage, "info");
  resultsContainer.innerHTML = "";
}

// Load the local API using Fetch.
async function loadWithFetch() {
  renderStatus(fetchStatus, "Consultando alumnos con Fetch...", "info");
  fetchResults.innerHTML = "";

  const response = await fetch("/api/alumnos");
  if (!response.ok) {
    throw new Error("La API de alumnos no respondio correctamente.");
  }

  const students = mapStudents(await response.json());
  renderStatus(fetchStatus, `Se cargaron ${students.length} alumnos con Fetch.`, "success");
  renderPeople(fetchResults, students, "Fetch");
  updateCounter(students.length);
}

// Load the local API using Axios.
async function loadWithAxios() {
  renderStatus(axiosStatus, "Consultando alumnos con Axios...", "info");
  axiosResults.innerHTML = "";

  if (typeof window.axios === "undefined") {
    throw new Error("Axios no esta disponible. Revisa la conexion al CDN.");
  }

  const response = await window.axios.get("/api/alumnos");
  const students = mapStudents(response.data);
  renderStatus(axiosStatus, `Se cargaron ${students.length} alumnos con Axios.`, "success");
  renderPeople(axiosResults, students, "Axios");
  updateCounter(students.length);
}

// Attach the Fetch action and keep its errors isolated.
fetchButton.addEventListener("click", () => {
  loadWithFetch().catch((error) => {
    renderStatus(fetchStatus, error.message || "No se pudieron obtener los alumnos.", "error");
    fetchResults.innerHTML = `
      <div class="col-12">
        <div class="status-box status-error">Sin datos por error de Fetch.</div>
      </div>
    `;
  });
});

// Attach the Axios action and keep its errors isolated.
axiosButton.addEventListener("click", () => {
  loadWithAxios().catch((error) => {
    renderStatus(axiosStatus, error.message || "No se pudieron obtener los alumnos.", "error");
    axiosResults.innerHTML = `
      <div class="col-12">
        <div class="status-box status-error">Sin datos por error de Axios.</div>
      </div>
    `;
  });
});

// Initialize both panels with placeholder content.
clearPanel(fetchStatus, fetchResults, "Esperando consulta con Fetch.");
clearPanel(axiosStatus, axiosResults, "Esperando consulta con Axios.");
updateCounter(0);

// Reuse the shared theme and scroll-to-top behavior.
initializeThemeAndTop({
  themeButtonId: "theme-btn",
  topButtonId: "back-to-top",
  themeKey: "js4-point4-theme"
});
