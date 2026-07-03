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

// Controles para los dos paneles de comparacion.
const fetchButton = document.getElementById("fetch-btn");
const axiosButton = document.getElementById("axios-btn");
const fetchStatus = document.getElementById("fetch-status");
const axiosStatus = document.getElementById("axios-status");
const fetchResults = document.getElementById("fetch-results");
const axiosResults = document.getElementById("axios-results");
const studentCount = document.getElementById("student-count");

// Convierte la respuesta de la API al formato compartido de render.
function mapStudents(students) {
  return students.map((student) => ({
    title: student.nombre,
    subtitle: student.email
  }));
}

// Mantiene sincronizada la chapa del contador con la lista renderizada.
function updateCounter(total) {
  studentCount.textContent = total === 1 ? "1 alumno" : `${total} alumnos`;
}

// Renderiza un estado vacio por defecto para un panel.
function clearPanel(statusBox, resultsContainer, defaultMessage) {
  renderStatus(statusBox, defaultMessage, "info");
  resultsContainer.innerHTML = "";
}

// Carga la API local usando Fetch.
async function loadWithFetch() {
  renderStatus(fetchStatus, "Consultando alumnos con Fetch...", "info");
  fetchResults.innerHTML = "";

  const response = await fetch("/api/alumnos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({})
  });
  if (!response.ok) {
    throw new Error("La API de alumnos no respondio correctamente.");
  }

  const students = mapStudents(await response.json());
  renderStatus(fetchStatus, `Se cargaron ${students.length} alumnos con Fetch.`, "success");
  renderPeople(fetchResults, students, "Fetch");
  updateCounter(students.length);
}

// Carga la API local usando Axios.
async function loadWithAxios() {
  renderStatus(axiosStatus, "Consultando alumnos con Axios...", "info");
  axiosResults.innerHTML = "";

  if (typeof window.axios === "undefined") {
    throw new Error("Axios no esta disponible. Revisa la conexion al CDN.");
  }

  const response = await window.axios.post("/api/alumnos", {});
  const students = mapStudents(response.data);
  renderStatus(axiosStatus, `Se cargaron ${students.length} alumnos con Axios.`, "success");
  renderPeople(axiosResults, students, "Axios");
  updateCounter(students.length);
}

// Asocia la accion de Fetch y mantiene sus errores aislados.
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

// Asocia la accion de Axios y mantiene sus errores aislados.
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

// Inicializa ambos paneles con contenido de relleno.
clearPanel(fetchStatus, fetchResults, "Esperando consulta con Fetch.");
clearPanel(axiosStatus, axiosResults, "Esperando consulta con Axios.");
updateCounter(0);

// Reutiliza el tema compartido y el comportamiento de volver arriba.
initializeThemeAndTop({
  themeButtonId: "theme-btn",
  topButtonId: "back-to-top",
  themeKey: "js4-point4-theme"
});
