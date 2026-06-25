const state = { data: null, selectedOriginalIndex: 0 };

const variantSel = document.getElementById("variant");
const cardBody = document.getElementById("cardBody");
const feedback = document.getElementById("feedback");
const secretTools = document.getElementById("secretTools");
const secretInput = document.getElementById("secretInput");
const secretResult = document.getElementById("secretResult");
const toTopBtn = document.getElementById("toTop");

function getTheme() { return localStorage.getItem("theme") || "light"; }
function setTheme(theme) { document.documentElement.setAttribute("data-theme", theme); localStorage.setItem("theme", theme); }
function toggleTheme() { setTheme(getTheme() === "light" ? "dark" : "light"); }
function pretty(v) { return JSON.stringify(v, null, 2); }

function getMethodName() {
  return state.data?.metodo ?? state.data?.método ?? "";
}

function getOperation(v) {
  return v?.operacion ?? v?.operación ?? "";
}

function fieldInputHtml(f) {
  if (f.tipo === "number") return `<input class="form-control run-input" data-key="${f.key}" type="number" required />`;
  return `<input class="form-control run-input" data-key="${f.key}" type="text" required />`;
}

function renderVariantCard(v) {
  const inputs = (v.campos || []).map((f) => `
    <div class="mb-2">
      <label class="form-label">${f.label}</label>
      ${fieldInputHtml(f)}
      <small class="helper d-block">${f.tipo === "textCsv" ? "Solo texto, separado por comas." : f.tipo === "numberCsv" ? "Solo números, separados por comas." : f.tipo === "nameAge" ? "Formato: Ana:20, Leo:25" : f.tipo === "nameActive" ? "Formato: Ana:true, Luis:false" : f.tipo === "priceObjects" ? "Precios separados por comas." : ""}</small>
    </div>
  `).join("");

  cardBody.innerHTML = `
    <p><strong>Método:</strong> ${getMethodName()}</p>
    <p><strong>Consigna:</strong> ${v.consigna}</p>
    <p><strong>Variante elegida:</strong> ${v.nombre}</p>
    <p><strong>Operación aplicada:</strong> <code>${getOperation(v)}</code></p>
    <p><strong>Codigo usado:</strong></p>
    <pre><code>${getOperation(v)}</code></pre>
    <section class="panel mb-3">
      <h3 class="h6">Ingresa tus datos</h3>
      ${inputs || '<p class="mb-2">Esta variante no requiere datos manuales.</p>'}
      <button id="runVariant" class="btn btn-brand" type="button">Ejecutar variante</button>
      <p id="runError" class="feedback mt-2 mb-0"></p>
    </section>
    <p><strong>Resultado final:</strong></p>
    <pre id="runResult">Ejecuta la variante para ver el resultado.</pre>
  `;

  document.querySelectorAll(".run-input").forEach((input) => {
    input.addEventListener("input", () => {
      const val = input.value.trim();
      let ok = val !== "";
      if (input.type === "number" && Number.isNaN(Number(val))) ok = false;
      input.setAttribute("aria-invalid", ok ? "false" : "true");
      input.style.borderColor = ok ? "" : "#d62839";
      feedback.textContent = ok ? `Mostrando ejercicio ${state.selectedOriginalIndex + 1} de ${state.data.variantes.length}.` : "Hay campos inválidos.";
    });
  });

  document.getElementById("runVariant").addEventListener("click", runVariant);
}

async function runVariant() {
  const v = state.data.variantes[state.selectedOriginalIndex];
  const inputs = {};
  document.querySelectorAll(".run-input").forEach((input) => { inputs[input.dataset.key] = input.value; });

  const res = await fetch("/api/ejecutar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ varianteId: v.id, inputs })
  });
  const data = await res.json();

  const runError = document.getElementById("runError");
  const runResult = document.getElementById("runResult");
  if (!res.ok) {
    runError.textContent = data.error || "Error de validación.";
    runResult.textContent = "Sin resultado por error de validación.";
    return;
  }

  runError.textContent = "";
  runResult.textContent = pretty(data.resultado);
}

function renderSelect() {
  variantSel.innerHTML = state.data.variantes.map((v, i) => {
    const selected = i === state.selectedOriginalIndex ? "selected" : "";
    return `<option value="${i}" ${selected}>${i + 1}. ${v.nombre}</option>`;
  }).join("");
}

function renderCurrentVariant() {
  const v = state.data.variantes[state.selectedOriginalIndex];
  renderVariantCard(v);
  feedback.textContent = `Mostrando ejercicio ${state.selectedOriginalIndex + 1} de ${state.data.variantes.length}.`;
}

async function runSecreto(modo) {
  const texto = (secretInput?.value || "").trim();
  secretResult.classList.remove("d-none");
  const res = await fetch("/api/secreto/run", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ texto, modo }) });
  const data = await res.json();
  if (!res.ok) { feedback.textContent = data.error || "No se pudo decodificar."; secretResult.textContent = ""; return; }
  secretResult.textContent = pretty(data.resultado);
  feedback.textContent = "Decodificación OK.";
}

async function loadData() {
  const res = await fetch("/api/ejercicio");
  if (!res.ok) throw new Error("No se pudo cargar");
  state.data = await res.json();
  const methodName = getMethodName();
  document.getElementById("title").textContent = `Método ${methodName}`;
  document.title = `Método ${methodName}`;
  state.selectedOriginalIndex = 0;
  renderSelect();
  renderCurrentVariant();
  if (methodName === "secreto") secretTools.classList.remove("d-none"); else secretTools.classList.add("d-none");
}

variantSel.addEventListener("change", () => { state.selectedOriginalIndex = Number(variantSel.value || 0); renderCurrentVariant(); });
document.getElementById("themeBtn").addEventListener("click", toggleTheme);
document.getElementById("runCustom")?.addEventListener("click", () => runSecreto("normal"));
document.getElementById("runStep")?.addEventListener("click", () => runSecreto("paso"));
toTopBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
window.addEventListener("scroll", () => { toTopBtn.style.display = window.scrollY > 200 ? "inline-flex" : "none"; });

setTheme(getTheme());
loadData().catch(() => { feedback.textContent = "No se pudo cargar la información del método."; });
