import {
  initializeThemeAndTop,
  renderPeople,
  renderStatus
} from "/shared/common.js";

const loadButton = document.getElementById("load-btn");
const statusBox = document.getElementById("status");
const results = document.getElementById("results");
const studentCount = document.getElementById("student-count");

loadButton.addEventListener("click", async () => {
  renderStatus(statusBox, "Consultando alumnos de la API propia...", "info");
  results.innerHTML = "";
  studentCount.textContent = "0 alumnos";

  try {
    const response = await fetch("/api/alumnos");

    if (!response.ok) {
      throw new Error("La API de alumnos no respondio correctamente.");
    }

    const data = await response.json();
    const students = data.map((student) => ({
      title: student.nombre,
      subtitle: student.email
    }));

    renderStatus(statusBox, `Se cargaron ${students.length} alumnos.`, "success");
    renderPeople(results, students, "Alumno");
    studentCount.textContent =
      students.length === 1 ? "1 alumno" : `${students.length} alumnos`;
  } catch (error) {
    renderStatus(statusBox, error.message || "No se pudieron obtener los alumnos.", "error");
    studentCount.textContent = "0 alumnos";
  }
});

initializeThemeAndTop({
  themeButtonId: "theme-btn",
  topButtonId: "back-to-top",
  themeKey: "js4-point4-theme"
});
