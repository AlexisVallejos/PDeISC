/**
 * DOCUMENTACION PARA DEFENDER
 * Archivo: modules/ejercicio01_fetch/public/script.js
 * Rol: construye la vista interactiva del punto 1 con Fetch y Axios.
 * Idea clave: compara dos clientes HTTP sobre la misma API publica para mostrar diferencias reales.
 * Como defenderlo: explicar que ambas ramas usan el mismo mapeo de usuarios y el mismo render.
 * Validacion: cada boton maneja errores y vuelve a mostrar el estado en pantalla.
 */
import {
  initializeThemeAndTop,
  renderPeople,
  renderStatus
} from "/shared/common.js";

// Fuente remota usada por la demostracion comparativa.
const USERS_URL = "https://jsonplaceholder.typicode.com/users";

// Obtiene los nodos del DOM usados por los dos cargadores.
const fetchButton = document.getElementById("fetch-btn");
const axiosButton = document.getElementById("axios-btn");
const fetchStatus = document.getElementById("fetch-status");
const axiosStatus = document.getElementById("axios-status");
const fetchResults = document.getElementById("fetch-results");
const axiosResults = document.getElementById("axios-results");

// Convierte la carga util cruda de la API al formato compartido de tarjetas.
function mapUsers(users) {
  return users.map((user) => ({
    title: user.name,
    subtitle: user.email
  }));
}

// Carga usuarios con la API nativa Fetch.
async function loadWithFetch() {
  renderStatus(fetchStatus, "Consultando usuarios con Fetch...", "info");
  fetchResults.innerHTML = "";

  const response = await fetch(USERS_URL);

  if (!response.ok) {
    throw new Error("La consulta con Fetch no pudo completarse.");
  }

  const users = mapUsers(await response.json());
  renderStatus(fetchStatus, `Se cargaron ${users.length} usuarios con Fetch.`, "success");
  renderPeople(fetchResults, users, "Fetch");
}

// Carga usuarios con Axios desde el CDN.
async function loadWithAxios() {
  renderStatus(axiosStatus, "Consultando usuarios con Axios...", "info");
  axiosResults.innerHTML = "";

  if (typeof window.axios === "undefined") {
    throw new Error("Axios no esta disponible. Revisa la conexion al CDN.");
  }

  const response = await window.axios.get(USERS_URL);
  const users = mapUsers(response.data);
  renderStatus(axiosStatus, `Se cargaron ${users.length} usuarios con Axios.`, "success");
  renderPeople(axiosResults, users, "Axios");
}

// Vincula el boton de Fetch y mantiene sus fallos en su propio panel.
fetchButton.addEventListener("click", () => {
  loadWithFetch().catch((error) => {
    renderStatus(fetchStatus, error.message, "error");
  });
});

// Vincula el boton de Axios y mantiene sus fallos en su propio panel.
axiosButton.addEventListener("click", () => {
  loadWithAxios().catch((error) => {
    renderStatus(axiosStatus, error.message || "No se pudieron obtener los datos.", "error");
  });
});

// Reutiliza el tema compartido y el comportamiento de volver arriba.
initializeThemeAndTop({
  themeButtonId: "theme-btn",
  topButtonId: "back-to-top",
  themeKey: "js4-point1-theme"
});
