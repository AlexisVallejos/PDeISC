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

// Fuente remota usada por la demostracion de busqueda.
const USERS_URL = "https://jsonplaceholder.typicode.com/users";
// Boton de accion que carga los usuarios.
const loadButton = document.getElementById("load-btn");
// Las pestañas cambian entre Fetch y Axios antes de cargar.
const tabFetch = document.getElementById("tab-fetch");
const tabAxios = document.getElementById("tab-axios");
// El cuadro de busqueda filtra la lista en cache.
const searchInput = document.getElementById("search-input");
// Areas de interfaz compartidas para el estado actual y los resultados.
const statusBox = document.getElementById("status");
const results = document.getElementById("results");
const resultCount = document.getElementById("result-count");

// Guarda los datos cargados para que el filtrado sea inmediato.
let cachedUsers = [];
// Lleva el control del metodo de carga seleccionado.
let currentMethod = "fetch";

// Normaliza la carga util de la API al formato compartido de tarjetas.
function mapUsers(users) {
  return users.map((user) => ({
    title: user.name,
    subtitle: user.email
  }));
}

// Actualiza la chapa del contador con la cantidad de usuarios visibles.
function updateCount(count) {
  resultCount.textContent = count === 1 ? "1 usuario" : `${count} usuarios`;
}

// Filtra los usuarios en cache por el termino escrito.
function filterUsers(term) {
  const normalized = term.trim().toLowerCase();

  if (!normalized) {
    return cachedUsers;
  }

  return cachedUsers.filter((user) =>
    user.title.toLowerCase().includes(normalized)
  );
}

// Cambia el metodo de transporte activo y actualiza el texto del boton.
function setActiveMethod(method) {
  currentMethod = method;
  tabFetch.classList.toggle("active", method === "fetch");
  tabAxios.classList.toggle("active", method === "axios");
  loadButton.textContent =
    method === "fetch" ? "Cargar usuarios con Fetch" : "Cargar usuarios con Axios";
}

// Carga los usuarios usando el metodo de transporte seleccionado.
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

// Conecta el boton principal de carga.
loadButton.addEventListener("click", loadUsers);
// Selecciona el modo Fetch.
tabFetch.addEventListener("click", () => setActiveMethod("fetch"));
// Selecciona el modo Axios.
tabAxios.addEventListener("click", () => setActiveMethod("axios"));

// Filtra la lista visible a medida que el usuario escribe.
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

// Inicia la pagina en modo Fetch.
setActiveMethod("fetch");

// Reutiliza el tema compartido y el comportamiento de volver arriba.
initializeThemeAndTop({
  themeButtonId: "theme-btn",
  topButtonId: "back-to-top",
  themeKey: "js4-point3-theme"
});
