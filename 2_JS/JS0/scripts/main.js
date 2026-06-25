import { getTheme, applyTheme, toggleTheme } from "/Context/theme.js";

const grid = document.getElementById("grid");
const toTopBtn = document.getElementById("toTop");

async function init() {
  applyTheme(getTheme());
  const res = await fetch("/api/launcher");
  const data = await res.json();

  grid.innerHTML = data.ejercicios.map((e) => `
    <article class="col-12 col-md-6 col-xl-4">
      <div class="launcher-card h-100">
        <div class="card-body p-3 p-lg-4">
          <span class="method-pill mb-2">${e.método}</span>
          <h2 class="h4 mb-2">Ejercicio ${String(e.puerto - 3000).padStart(2, "0")}</h2>
          <p class="mb-3 text-muted">Puerto dedicado: <strong>${e.puerto}</strong></p>
          <a class="open-btn d-inline-flex align-items-center justify-content-center text-decoration-none" href="http://localhost:${e.puerto}" target="_blank" rel="noreferrer">Abrir ejercicio</a>
        </div>
      </div>
    </article>
  `).join("");
}

document.getElementById("themeBtn").addEventListener("click", () => applyTheme(toggleTheme()));
toTopBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
window.addEventListener("scroll", () => {
  toTopBtn.style.display = window.scrollY > 220 ? "inline-flex" : "none";
});

init();
