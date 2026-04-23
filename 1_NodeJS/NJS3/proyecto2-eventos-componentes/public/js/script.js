const tabs = document.querySelectorAll(".tab");
const components = document.querySelectorAll(".component");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const targetId = tab.dataset.target;

    tabs.forEach((item) => item.classList.remove("active"));
    components.forEach((component) => component.classList.remove("active"));

    tab.classList.add("active");
    document.getElementById(targetId).classList.add("active");
  });
});

document.getElementById("clickButton").addEventListener("click", () => {
  document.getElementById("clickText").textContent = "El texto fue cambiado con un evento click.";
});

const mouseBox = document.getElementById("mouseBox");
const mouseText = document.getElementById("mouseText");

mouseBox.addEventListener("mouseenter", () => {
  mouseBox.classList.add("over");
  mouseText.textContent = "El mouse esta dentro del componente.";
});

mouseBox.addEventListener("mouseleave", () => {
  mouseBox.classList.remove("over");
  mouseText.textContent = "El mouse salio del componente.";
});

let doubleCounter = 0;

document.getElementById("doubleButton").addEventListener("dblclick", () => {
  doubleCounter += 1;
  document.getElementById("doubleText").textContent = `Doble clicks detectados: ${doubleCounter}`;
});

document.getElementById("keyboardInput").addEventListener("keydown", (event) => {
  document.getElementById("keyboardText").textContent = `Tecla presionada: ${event.key}`;
});

const themeSelect = document.getElementById("themeSelect");
const selectComponent = document.getElementById("selectComponent");

themeSelect.addEventListener("change", () => {
  selectComponent.classList.remove("theme-blue", "theme-green", "theme-red");
  selectComponent.classList.add(`theme-${themeSelect.value}`);
  document.getElementById("selectText").textContent = `Color seleccionado: ${themeSelect.value}`;
});

