const tabs = document.querySelectorAll(".tab");
const components = document.querySelectorAll(".component");

// Este bloque muestra solo el componente asociado al boton pulsado.
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
  document.getElementById("clickText").textContent = "El texto se actualizo con el evento click.";
});

const mouseBox = document.getElementById("mouseBox");
const mouseText = document.getElementById("mouseText");

mouseBox.addEventListener("mouseenter", () => {
  mouseBox.classList.add("over");
  mouseText.textContent = "El cursor ingreso al area de practica.";
});

mouseBox.addEventListener("mouseleave", () => {
  mouseBox.classList.remove("over");
  mouseText.textContent = "El cursor salio del area de practica.";
});

let doubleCounter = 0;

document.getElementById("doubleButton").addEventListener("dblclick", () => {
  // Guarda cuantas veces se disparo el evento dblclick.
  doubleCounter += 1;
  document.getElementById("doubleText").textContent = `Doble clic detectado: ${doubleCounter}`;
});

document.getElementById("keyboardInput").addEventListener("keydown", (event) => {
  document.getElementById("keyboardText").textContent = `Ultima tecla registrada: ${event.key}`;
});

const themeSelect = document.getElementById("themeSelect");
const selectComponent = document.getElementById("selectComponent");

themeSelect.addEventListener("change", () => {
  // Quita el tema anterior y aplica el nuevo color seleccionado.
  selectComponent.classList.remove("theme-blue", "theme-green", "theme-red");
  selectComponent.classList.add(`theme-${themeSelect.value}`);
  document.getElementById("selectText").textContent = `Color aplicado al panel: ${themeSelect.value}`;
});

