/**
 * DOCUMENTACION PARA DEFENDER
 * Archivo: modules/shared/public/exerciseApp.js
 * Rol: concentra la logica de navegador reutilizable por todos los ejercicios JS0.
 * Idea clave: los scripts de cada ejercicio solo importan esta app; el render, fetch y validacion visual viven aca.
 * Como defenderlo: explicar que se separo comportamiento comun de cada pagina para evitar 15 copias iguales.
 * Validacion: los inputs se controlan visualmente y el backend vuelve a validar antes de ejecutar.
 */

// createState: guarda el payload recibido del servidor y la variante seleccionada.
function createState() {
  return { data: null, selectedOriginalIndex: 0 };
}

// getDomRefs: centraliza las referencias al DOM para que el resto del codigo sea mas legible.
function getDomRefs() {
  return {
    variantSel: document.getElementById("variant"),
    cardBody: document.getElementById("cardBody"),
    feedback: document.getElementById("feedback"),
    secretTools: document.getElementById("secretTools"),
    secretInput: document.getElementById("secretInput"),
    secretResult: document.getElementById("secretResult"),
    toTopBtn: document.getElementById("toTop")
  };
}

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

function pretty(value) {
  return JSON.stringify(value, null, 2);
}

function helperText(field) {
  if (field.tipo === "textCsv") return "Solo texto, separado por comas.";
  if (field.tipo === "numberCsv") return "Solo numeros, separados por comas.";
  if (field.tipo === "nameAge") return "Formato: Ana:20, Leo:25";
  if (field.tipo === "nameActive") return "Formato: Ana:true, Luis:false";
  if (field.tipo === "priceObjects") return "Precios separados por comas.";
  return "";
}

function fieldInputHtml(field) {
  const type = field.tipo === "number" ? "number" : "text";
  return `<input class="form-control run-input" data-key="${field.key}" type="${type}" required />`;
}

function validateRunInput(input) {
  const value = input.value.trim();
  let ok = value !== "";
  if (input.type === "number" && Number.isNaN(Number(value))) ok = false;
  input.setAttribute("aria-invalid", ok ? "false" : "true");
  input.style.borderColor = ok ? "" : "#d62839";
  return ok;
}

function collectInputs() {
  const inputs = {};
  document.querySelectorAll(".run-input").forEach((input) => {
    inputs[input.dataset.key] = input.value;
  });
  return inputs;
}

function getMethodName(state) {
  return state.data?.metodo ?? "";
}

function getOperation(variant) {
  return variant?.operacion ?? "";
}

// renderVariantCard: dibuja consigna, codigo, formulario dinamico y panel de resultado.
function renderVariantCard({ refs, state, variant, runVariant }) {
  const inputs = (variant.campos || []).map((field) => `
    <div class="mb-2">
      <label class="form-label">${field.label}</label>
      ${fieldInputHtml(field)}
      <small class="helper d-block">${helperText(field)}</small>
    </div>
  `).join("");

  refs.cardBody.innerHTML = `
    <p><strong>Metodo:</strong> ${getMethodName(state)}</p>
    <p><strong>Consigna:</strong> ${variant.consigna}</p>
    <p><strong>Variante elegida:</strong> ${variant.nombre}</p>
    <p><strong>Operacion aplicada:</strong> <code>${getOperation(variant)}</code></p>
    <p><strong>Codigo usado:</strong></p>
    <pre><code>${variant.codigo}</code></pre>
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
      const ok = validateRunInput(input);
      refs.feedback.textContent = ok
        ? `Mostrando ejercicio ${state.selectedOriginalIndex + 1} de ${state.data.variantes.length}.`
        : "Hay campos invalidos.";
    });
  });

  document.getElementById("runVariant").addEventListener("click", runVariant);
}

// initExerciseApp: punto de entrada publico que inicializa cualquier pagina de ejercicio JS0.
export function initExerciseApp() {
  const state = createState();
  const refs = getDomRefs();

  async function runVariant() {
    const variant = state.data.variantes[state.selectedOriginalIndex];
    const res = await fetch("/api/ejecutar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ varianteId: variant.id, inputs: collectInputs() })
    });
    const data = await res.json();
    const runError = document.getElementById("runError");
    const runResult = document.getElementById("runResult");

    if (!res.ok) {
      runError.textContent = data.error || "Error de validacion.";
      runResult.textContent = "Sin resultado por error de validacion.";
      return;
    }

    runError.textContent = "";
    runResult.textContent = pretty(data.resultado);
  }

  function renderSelect() {
    refs.variantSel.innerHTML = state.data.variantes.map((variant, index) => {
      const selected = index === state.selectedOriginalIndex ? "selected" : "";
      return `<option value="${index}" ${selected}>${index + 1}. ${variant.nombre}</option>`;
    }).join("");
  }

  function renderCurrentVariant() {
    const variant = state.data.variantes[state.selectedOriginalIndex];
    renderVariantCard({ refs, state, variant, runVariant });
    refs.feedback.textContent = `Mostrando ejercicio ${state.selectedOriginalIndex + 1} de ${state.data.variantes.length}.`;
  }

  async function runSecreto(modo) {
    const texto = (refs.secretInput?.value || "").trim();
    refs.secretResult.classList.remove("d-none");
    const res = await fetch("/api/secreto/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ texto, modo })
    });
    const data = await res.json();
    if (!res.ok) {
      refs.feedback.textContent = data.error || "No se pudo decodificar.";
      refs.secretResult.textContent = "";
      return;
    }
    refs.secretResult.textContent = pretty(data.resultado);
    refs.feedback.textContent = "Decodificacion OK.";
  }

  async function loadData() {
    const res = await fetch("/api/ejercicio");
    if (!res.ok) throw new Error("No se pudo cargar");
    state.data = await res.json();
    const methodName = getMethodName(state);
    document.getElementById("title").textContent = `Metodo ${methodName}`;
    document.title = `Metodo ${methodName}`;
    state.selectedOriginalIndex = 0;
    renderSelect();
    renderCurrentVariant();
    if (methodName === "secreto") refs.secretTools.classList.remove("d-none");
    else refs.secretTools.classList.add("d-none");
  }

  refs.variantSel.addEventListener("change", () => {
    state.selectedOriginalIndex = Number(refs.variantSel.value || 0);
    renderCurrentVariant();
  });
  document.getElementById("themeBtn").addEventListener("click", toggleTheme);
  document.getElementById("runCustom")?.addEventListener("click", () => runSecreto("normal"));
  document.getElementById("runStep")?.addEventListener("click", () => runSecreto("paso"));
  refs.toTopBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  window.addEventListener("scroll", () => {
    refs.toTopBtn.style.display = window.scrollY > 200 ? "inline-flex" : "none";
  });

  setTheme(getTheme());
  loadData().catch(() => { refs.feedback.textContent = "No se pudo cargar la informacion del metodo."; });
}
