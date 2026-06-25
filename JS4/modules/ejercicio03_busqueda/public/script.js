import {
  initializeThemeAndTop,
  renderPeople,
  renderStatus
} from "/shared/common.js";

const USERS_URL = "https://jsonplaceholder.typicode.com/users";
const loadButton = document.getElementById("load-btn");
const tabFetch = document.getElementById("tab-fetch");
const tabAxios = document.getElementById("tab-axios");
const searchInput = document.getElementById("search-input");
const statusBox = document.getElementById("status");
const results = document.getElementById("results");
const resultCount = document.getElementById("result-count");

let cachedUsers = [];
let currentMethod = "fetch";

function mapUsers(users) {
  return users.map((user) => ({
    title: user.name,
    subtitle: user.email
  }));
}

function updateCount(count) {
  resultCount.textContent = count === 1 ? "1 usuario" : `${count} usuarios`;
}

function filterUsers(term) {
  const normalized = term.trim().toLowerCase();

  if (!normalized) {
    return cachedUsers;
  }

  return cachedUsers.filter((user) =>
    user.title.toLowerCase().includes(normalized)
  );
}

function setActiveMethod(method) {
  currentMethod = method;
  tabFetch.classList.toggle("active", method === "fetch");
  tabAxios.classList.toggle("active", method === "axios");
  loadButton.textContent =
    method === "fetch" ? "Cargar usuarios con Fetch" : "Cargar usuarios con Axios";
}

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

loadButton.addEventListener("click", loadUsers);
tabFetch.addEventListener("click", () => setActiveMethod("fetch"));
tabAxios.addEventListener("click", () => setActiveMethod("axios"));

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

setActiveMethod("fetch");

initializeThemeAndTop({
  themeButtonId: "theme-btn",
  topButtonId: "back-to-top",
  themeKey: "js4-point3-theme"
});
