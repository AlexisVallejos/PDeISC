/**
 * DOCUMENTACION PARA DEFENDER
 * Archivo: ejercicios/ejercicio5/scripts/main.js
 * Rol: maneja la interaccion del navegador: eventos, DOM, validaciones visuales y llamadas al servidor.
 * Idea clave: mantener este codigo separado ayuda a explicar que hace cada parte sin mezclar responsabilidades.
 * Como defenderlo: explicar primero que datos entran, que proceso se aplica y que salida produce.
 * Validacion: remarcar donde se controlan errores para que la app no falle con datos incorrectos.
 */
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

const savedTheme = localStorage.getItem("njs-theme");
if (savedTheme === "light") {
  document.body.classList.add("light-theme");
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
  document.body.classList.toggle("light-theme");
  localStorage.setItem(
    "njs-theme",
    document.body.classList.contains("light-theme") ? "light" : "dark"
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
