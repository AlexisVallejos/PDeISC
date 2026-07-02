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

// Remote source used by the comparison demo.
const USERS_URL = "https://jsonplaceholder.typicode.com/users";

// Get the DOM nodes used by the two loaders.
const fetchButton = document.getElementById("fetch-btn");
const axiosButton = document.getElementById("axios-btn");
const fetchStatus = document.getElementById("fetch-status");
const axiosStatus = document.getElementById("axios-status");
const fetchResults = document.getElementById("fetch-results");
const axiosResults = document.getElementById("axios-results");

// Convert the raw API payload to the shared card format.
function mapUsers(users) {
  return users.map((user) => ({
    title: user.name,
    subtitle: user.email
  }));
}

// Load users with the native Fetch API.
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

// Load users with Axios from the CDN.
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

// Bind the Fetch button and keep failures on its own panel.
fetchButton.addEventListener("click", () => {
  loadWithFetch().catch((error) => {
    renderStatus(fetchStatus, error.message, "error");
  });
});

// Bind the Axios button and keep failures on its own panel.
axiosButton.addEventListener("click", () => {
  loadWithAxios().catch((error) => {
    renderStatus(axiosStatus, error.message || "No se pudieron obtener los datos.", "error");
  });
});

// Reuse the shared theme and scroll-to-top behavior.
initializeThemeAndTop({
  themeButtonId: "theme-btn",
  topButtonId: "back-to-top",
  themeKey: "js4-point1-theme"
});
