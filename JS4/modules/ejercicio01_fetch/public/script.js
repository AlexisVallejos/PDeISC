import {
  initializeThemeAndTop,
  renderPeople,
  renderStatus
} from "/shared/common.js";

const USERS_URL = "https://jsonplaceholder.typicode.com/users";

const fetchButton = document.getElementById("fetch-btn");
const axiosButton = document.getElementById("axios-btn");
const fetchStatus = document.getElementById("fetch-status");
const axiosStatus = document.getElementById("axios-status");
const fetchResults = document.getElementById("fetch-results");
const axiosResults = document.getElementById("axios-results");

function mapUsers(users) {
  return users.map((user) => ({
    title: user.name,
    subtitle: user.email
  }));
}

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

fetchButton.addEventListener("click", () => {
  loadWithFetch().catch((error) => {
    renderStatus(fetchStatus, error.message, "error");
  });
});

axiosButton.addEventListener("click", () => {
  loadWithAxios().catch((error) => {
    renderStatus(axiosStatus, error.message || "No se pudieron obtener los datos.", "error");
  });
});

initializeThemeAndTop({
  themeButtonId: "theme-btn",
  topButtonId: "back-to-top",
  themeKey: "js4-point1-theme"
});
