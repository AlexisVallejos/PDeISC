const resultados = [
  { ejercicio: "Ejercicio 1", resultado: "Hola mundo desde Node.js" },
  { ejercicio: "Ejercicio 1", resultado: "Fin" },
  { ejercicio: "Ejercicio 2", resultado: "4 + 5 = 9" },
  { ejercicio: "Ejercicio 2", resultado: "3 - 6 = -3" },
  { ejercicio: "Ejercicio 2", resultado: "2 * 7 = 14" },
  { ejercicio: "Ejercicio 2", resultado: "20 / 4 = 5" },
  { ejercicio: "Ejercicio 3", resultado: "sumar(4, 5) = 9" },
  { ejercicio: "Ejercicio 3", resultado: "restar(3, 6) = -3" },
  { ejercicio: "Ejercicio 3", resultado: "multiplicar(2, 7) = 14" },
  { ejercicio: "Ejercicio 3", resultado: "dividir(20, 4) = 5" },
  { ejercicio: "Ejercicio 4", resultado: "sumar(5, 3) = 8" },
  { ejercicio: "Ejercicio 4", resultado: "restar(8, 6) = 2" },
  { ejercicio: "Ejercicio 4", resultado: "multiplicar(3, 11) = 33" },
  { ejercicio: "Ejercicio 4", resultado: "dividir(30, 5) = 6" }
];

const cuerpoTabla = document.querySelector("#tabla-resultados");
const resumen = document.querySelector("#resumen-ejercicios");
const themeToggle = document.querySelector(".theme-toggle");
const scrollTopButton = document.querySelector(".scroll-top");

const savedTheme = localStorage.getItem("njs1-theme");
if (savedTheme === "dark") {
  document.body.classList.add("dark-theme");
}

const totales = resultados.reduce((acc, item) => {
  acc[item.ejercicio] = (acc[item.ejercicio] ?? 0) + 1;
  return acc;
}, {});

for (const [ejercicio, cantidad] of Object.entries(totales)) {
  const tarjeta = document.createElement("article");
  tarjeta.className = "resumen-card";
  tarjeta.innerHTML = `<span>${ejercicio}</span><strong>${cantidad}</strong>`;
  resumen.append(tarjeta);
}

for (const item of resultados) {
  const fila = document.createElement("tr");
  const celdaEjercicio = document.createElement("td");
  const celdaResultado = document.createElement("td");

  celdaEjercicio.dataset.label = "Ejercicio";
  celdaResultado.dataset.label = "Resultado";
  celdaEjercicio.innerHTML = `<span class="badge-ejercicio">${item.ejercicio}</span>`;
  celdaResultado.textContent = item.resultado;

  fila.append(celdaEjercicio, celdaResultado);
  cuerpoTabla.append(fila);
}

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-theme");
  localStorage.setItem(
    "njs1-theme",
    document.body.classList.contains("dark-theme") ? "dark" : "light"
  );
});

window.addEventListener(
  "scroll",
  () => {
    scrollTopButton.classList.toggle("visible", window.scrollY > 220);
  },
  { passive: true }
);

scrollTopButton.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});
