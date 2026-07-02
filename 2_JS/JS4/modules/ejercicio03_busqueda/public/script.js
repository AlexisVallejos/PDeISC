/**
 * DOCUMENTACION PARA DEFENDER
 * Archivo: modules/ejercicio03_busqueda/public/script.js
 * Rol: carga usuarios y permite filtrarlos con Fetch o Axios.
 * Idea clave: el ejercicio muestra un conjunto cacheado y filtra en vivo sin volver a descargar datos.
 * Como defenderlo: explicar el cambio de metodo, la cache local y el filtrado sobre el mismo arreglo.
 * Validacion: el buscador se habilita solo cuando la consulta inicial ya termino.
 */
import {
  initializeThemeAndTop,
  renderPeople,
  renderStatus
} from "/shared/common.js";

// Remote source used by the search demo.
const USERS_URL = "https://jsonplaceholder.typicode.com/users";
// Action button that loads the users.
const loadButton = document.getElementById("load-btn");
// Tabs switch between Fetch and Axios before loading.
const tabFetch = document.getElementById("tab-fetch");
const tabAxios = document.getElementById("tab-axios");
// Search box filters the cached list.
const searchInput = document.getElementById("search-input");
// Shared UI areas for the current status and results.
const statusBox = document.getElementById("status");
const results = document.getElementById("results");
const resultCount = document.getElementById("result-count");

// Cache the loaded data so filtering is instant.
let cachedUsers = [];
// Track the selected loading method.
let currentMethod = "fetch";

// Normalize the API payload into the shared card format.
function mapUsers(users) {
  return users.map((user) => ({
    title: user.name,
    subtitle: user.email
  }));
}

// Update the counter chip with the amount of visible users.
function updateCount(count) {
  resultCount.textContent = count === 1 ? "1 usuario" : `${count} usuarios`;
}

// Filter the cached users by the typed search term.
function filterUsers(term) {
  const normalized = term.trim().toLowerCase();

  if (!normalized) {
    return cachedUsers;
  }

  return cachedUsers.filter((user) =>
    user.title.toLowerCase().includes(normalized)
  );
}

// Switch the active transport method and update the button label.
function setActiveMethod(method) {
  currentMethod = method;
  tabFetch.classList.toggle("active", method === "fetch");
  tabAxios.classList.toggle("active", method === "axios");
  loadButton.textContent =
    method === "fetch" ? "Cargar usuarios con Fetch" : "Cargar usuarios con Axios";
}

// Load the users using the selected transport method.
async function loadUsers() {
  renderStatus(statusBox, `Cargando usuarios con ${currentMethod}...`, "info");
  results.innerHTML = "";
  updateCount(0);

  try {
    if (currentMethod === "axios" && typeof window.axios === "undefined") {
      throw new Error("Axios no esta disponible. Recarga la pagina o selecciona Fetch.");
    }

    const response =
      currentMethod === "fetch"
        ? await fetch(USERS_URL)
        : await window.axios.get(USERS_URL);

    if (currentMethod === "fetch" && !response.ok) {
      throw new Error("La consulta con Fetch no pudo completarse.");
    }

    const data = currentMethod === "fetch" ? await response.json() : response.data;
    cachedUsers = mapUsers(data);

    renderStatus(statusBox, `Usuarios listos con ${currentMethod}. Ya puedes buscar.`, "success");
    renderPeople(results, cachedUsers, "Usuario");
    updateCount(cachedUsers.length);
    searchInput.disabled = false;
    searchInput.value = "";
    searchInput.focus();
  } catch (error) {
    renderStatus(statusBox, error.message || "No se pudieron cargar los usuarios.", "error");
    updateCount(0);
  }
}

// Wire the main load button.
loadButton.addEventListener("click", loadUsers);
// Select Fetch mode.
tabFetch.addEventListener("click", () => setActiveMethod("fetch"));
// Select Axios mode.
tabAxios.addEventListener("click", () => setActiveMethod("axios"));

// Filter the visible list as the user types.
searchInput.addEventListener("input", () => {
  const filteredUsers = filterUsers(searchInput.value);
  renderStatus(
    statusBox,
    filteredUsers.length
      ? `Resultados encontrados: ${filteredUsers.length}.`
      : "No hay coincidencias con ese nombre.",
    filteredUsers.length ? "success" : "info"
  );
  renderPeople(results, filteredUsers, "Usuario");
  updateCount(filteredUsers.length);
});

// Start the page in Fetch mode.
setActiveMethod("fetch");

// Reuse the shared theme and scroll-to-top behavior.
initializeThemeAndTop({
  themeButtonId: "theme-btn",
  topButtonId: "back-to-top",
  themeKey: "js4-point3-theme"
});
