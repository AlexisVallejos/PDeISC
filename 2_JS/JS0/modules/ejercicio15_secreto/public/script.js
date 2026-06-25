const input = document.getElementById("secretInput");
const output = document.getElementById("secretOutput");
const feedback = document.getElementById("feedback");
const toTopBtn = document.getElementById("toTop");

function getTheme() {
  return localStorage.getItem("theme") || "light";
}

function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
}

function toggleTheme() {
  setTheme(getTheme() === "light" ? "dark" : "light");
}

async function ejecutarModo(modo) {
  const texto = input.value.trim();
  if (modo === "normal" && !texto) {
    feedback.textContent = "Ingresá un Secreto In válido.";
    output.textContent = "Sin resultado.";
    return;
  }
  try {
    const res = await fetch("/api/secreto/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ texto, modo })
    });

    const data = await res.json();
    if (!res.ok) {
      feedback.textContent = data.error || "No se pudo decodificar.";
      output.textContent = "Sin resultado.";
      return;
    }

    if (modo === "generar") {
      input.value = typeof data.resultado === "string" ? data.resultado : String(data.resultado?.cifrado || "");
      feedback.textContent = "Texto cifrado generado y cargado en Secreto In.";
      return;
    }

    feedback.textContent = "Operación correcta.";
    output.textContent = typeof data.resultado === "string"
      ? data.resultado
      : JSON.stringify(data.resultado, null, 2);
  } catch {
    feedback.textContent = "Error de conexión con el servidor.";
    output.textContent = "Sin resultado.";
  }
}

document.getElementById("decodeBtn").addEventListener("click", () => ejecutarModo("normal"));
document.getElementById("generateBtn").addEventListener("click", () => ejecutarModo("generar"));
document.getElementById("themeBtn").addEventListener("click", toggleTheme);

toTopBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

window.addEventListener("scroll", () => {
  toTopBtn.style.display = window.scrollY > 200 ? "inline-flex" : "none";
});

setTheme(getTheme());
