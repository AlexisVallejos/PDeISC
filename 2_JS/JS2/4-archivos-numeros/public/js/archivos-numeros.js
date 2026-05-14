const MIN_NUMEROS = 10;
const MAX_NUMEROS = 20;
const STORAGE_KEY = "js2-archivos-numeros";
const THEME_KEY = "js2-archivos-numeros-tema";

const formNumero = document.getElementById("form-numero");
const inputNumero = document.getElementById("numero");
const inputIndiceEdicion = document.getElementById("indice-edicion");
const errorNumero = document.getElementById("error-numero");
const btnGuardar = document.getElementById("btn-guardar");
const btnCancelar = document.getElementById("btn-cancelar");
const btnLimpiar = document.getElementById("btn-limpiar");
const btnDescargarOriginal = document.getElementById("btn-descargar-original");
const btnDescargarFiltrado = document.getElementById("btn-descargar-filtrado");
const btnTema = document.getElementById("btn-tema");
const fechaActual = document.getElementById("fecha-actual");
const contadorCarga = document.getElementById("contador-carga");
const barraProgreso = document.getElementById("barra-progreso");
const estadoCarga = document.getElementById("estado-carga");
const listaNumeros = document.getElementById("lista-numeros");
const concatenados = document.getElementById("concatenados");
const archivoInput = document.getElementById("archivo-txt");
const archivoNombre = document.getElementById("archivo-nombre");
const mensajeArchivo = document.getElementById("mensaje-archivo");
const totalLeidos = document.getElementById("total-leidos");
const totalUtiles = document.getElementById("total-utiles");
const totalNoUtiles = document.getElementById("total-no-utiles");
const porcentajeUtiles = document.getElementById("porcentaje-utiles");
const listaUtiles = document.getElementById("lista-utiles");
const concatenadosFiltrados = document.getElementById("concatenados-filtrados");

let numeros = cargarNumeros();
let resultadoActual = {
    leidos: [],
    utiles: [],
    noUtiles: [],
    porcentaje: 0
};

iniciarTema();
mostrarFecha();
renderNumeros();
renderResultado();

function normalizarNumero(valor) {
    return String(valor ?? "").trim();
}

function validarNumero(valor, indiceEditando = -1) {
    const numero = normalizarNumero(valor);

    if (!numero) return "Ingresa un numero.";
    if (!/^-?\d+$/.test(numero)) return "Solo se permiten numeros enteros.";
    if (numero === "-0") return "Usa 0 en vez de -0.";
    if (numero.length > 12) return "El numero no puede superar 12 caracteres.";

    if (indiceEditando === -1 && numeros.length >= MAX_NUMEROS) {
        return `Solo se pueden cargar hasta ${MAX_NUMEROS} numeros.`;
    }

    return "";
}

function cargarNumeros() {
    try {
        const datos = JSON.parse(localStorage.getItem(STORAGE_KEY));
        if (!Array.isArray(datos)) return [];
        return datos.filter((n) => /^-?\d+$/.test(String(n))).slice(0, MAX_NUMEROS).map(String);
    } catch {
        return [];
    }
}

function guardarNumeros() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(numeros));
}

function setError(mensaje) {
    errorNumero.textContent = mensaje;
    inputNumero.classList.toggle("invalid", Boolean(mensaje));
    inputNumero.setAttribute("aria-invalid", mensaje ? "true" : "false");
}

function mostrarFecha() {
    const hoy = new Date();
    const texto = new Intl.DateTimeFormat("es-AR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    }).format(hoy);

    fechaActual.textContent = texto;
    fechaActual.dateTime = hoy.toISOString();
}

function iniciarTema() {
    const temaGuardado = localStorage.getItem(THEME_KEY);
    const usarOscuro = temaGuardado === "dark";
    document.body.classList.toggle("dark", usarOscuro);
    btnTema.textContent = usarOscuro ? "Modo claro" : "Modo oscuro";
    btnTema.setAttribute("aria-pressed", usarOscuro ? "true" : "false");
    btnTema.setAttribute("aria-label", usarOscuro ? "Activar modo claro" : "Activar modo oscuro");
}

function cambiarTema() {
    const usarOscuro = !document.body.classList.contains("dark");
    document.body.classList.toggle("dark", usarOscuro);
    localStorage.setItem(THEME_KEY, usarOscuro ? "dark" : "light");
    btnTema.textContent = usarOscuro ? "Modo claro" : "Modo oscuro";
    btnTema.setAttribute("aria-pressed", usarOscuro ? "true" : "false");
    btnTema.setAttribute("aria-label", usarOscuro ? "Activar modo claro" : "Activar modo oscuro");
}

function renderNumeros() {
    contadorCarga.textContent = `${numeros.length} / ${MAX_NUMEROS}`;
    const porcentajeCarga = Math.min((numeros.length / MAX_NUMEROS) * 100, 100);
    barraProgreso.style.width = `${porcentajeCarga}%`;
    barraProgreso.parentElement.setAttribute("aria-valuenow", String(numeros.length));

    if (numeros.length < MIN_NUMEROS) {
        estadoCarga.textContent = `Faltan ${MIN_NUMEROS - numeros.length} numeros para poder descargar.`;
    } else if (numeros.length < MAX_NUMEROS) {
        estadoCarga.textContent = `Listo para descargar. Todavia podes cargar ${MAX_NUMEROS - numeros.length} mas.`;
    } else {
        estadoCarga.textContent = "Llegaste al maximo de 20 numeros.";
    }

    listaNumeros.innerHTML = "";

    numeros.forEach((numero, indice) => {
        const card = document.createElement("article");
        card.className = "number-card";
        card.setAttribute("role", "listitem");
        card.innerHTML = `
            <strong>${escapeHtml(numero)}</strong>
            <div class="card-actions">
                <button class="mini-btn" type="button" data-action="edit" data-index="${indice}" aria-label="Editar ${escapeHtml(numero)}">Editar</button>
                <button class="mini-btn delete" type="button" data-action="delete" data-index="${indice}" aria-label="Borrar ${escapeHtml(numero)}">Borrar</button>
            </div>
        `;
        listaNumeros.appendChild(card);
    });

    concatenados.textContent = numeros.length ? numeros.join(" - ") : "Sin numeros cargados";
    btnLimpiar.disabled = numeros.length === 0;
    btnDescargarOriginal.disabled = numeros.length < MIN_NUMEROS;
    btnGuardar.disabled = numeros.length >= MAX_NUMEROS && inputIndiceEdicion.value === "";
}

function iniciarEdicion(indice) {
    inputIndiceEdicion.value = String(indice);
    inputNumero.value = numeros[indice];
    btnGuardar.textContent = "Actualizar";
    btnCancelar.hidden = false;
    setError("");
    inputNumero.focus();
}

function cancelarEdicion() {
    inputIndiceEdicion.value = "";
    inputNumero.value = "";
    btnGuardar.textContent = "Agregar";
    btnCancelar.hidden = true;
    btnGuardar.disabled = numeros.length >= MAX_NUMEROS;
    setError("");
}

function borrarNumero(indice) {
    numeros.splice(indice, 1);
    guardarNumeros();
    cancelarEdicion();
    renderNumeros();
}

function borrarTodo() {
    if (!numeros.length) return;
    if (!confirm("Borrar todos los numeros cargados?")) return;
    numeros = [];
    guardarNumeros();
    cancelarEdicion();
    renderNumeros();
}

function descargarOriginal() {
    if (numeros.length < MIN_NUMEROS) {
        setError(`Para descargar primero carga al menos ${MIN_NUMEROS} numeros.`);
        return;
    }

    const contenido = numeros.join("\n");

    descargarTxt(contenido, `numeros-originales-${nombreFecha()}.txt`);
}

function extraerNumerosDesdeTexto(texto) {
    const matches = String(texto).match(/-?\d+/g);
    if (!matches) return [];
    return matches.map((n) => n.trim()).filter(Boolean);
}

function empiezaYTerminaIgual(numero) {
    const limpio = String(numero).replace("-", "");
    if (limpio.length === 0) return false;
    return limpio[0] === limpio[limpio.length - 1];
}

function procesarNumeros(leidos) {
    const utiles = leidos
        .filter(empiezaYTerminaIgual)
        .sort((a, b) => Number(a) - Number(b));
    const noUtiles = leidos.filter((n) => !empiezaYTerminaIgual(n));
    const porcentaje = leidos.length ? (utiles.length * 100) / leidos.length : 0;

    resultadoActual = { leidos, utiles, noUtiles, porcentaje };
    renderResultado();
}

function renderResultado() {
    totalLeidos.textContent = resultadoActual.leidos.length;
    totalUtiles.textContent = resultadoActual.utiles.length;
    totalNoUtiles.textContent = resultadoActual.noUtiles.length;
    porcentajeUtiles.textContent = `${resultadoActual.porcentaje.toFixed(2)}%`;

    listaUtiles.innerHTML = "";
    resultadoActual.utiles.forEach((numero) => {
        const item = document.createElement("li");
        item.textContent = numero;
        listaUtiles.appendChild(item);
    });

    concatenadosFiltrados.textContent = resultadoActual.utiles.length
        ? resultadoActual.utiles.join(" - ")
        : "Sin resultados";

    btnDescargarFiltrado.disabled = resultadoActual.leidos.length === 0;
}

function descargarFiltrado() {
    if (resultadoActual.leidos.length === 0) return;

    const contenido = [
        "RESULTADO DE FILTRADO",
        `Fecha: ${fechaActual.textContent}`,
        `Total leidos: ${resultadoActual.leidos.length}`,
        `Numeros utiles: ${resultadoActual.utiles.length}`,
        `Numeros no utiles: ${resultadoActual.noUtiles.length}`,
        `Porcentaje de utiles: ${resultadoActual.porcentaje.toFixed(2)}%`,
        "",
        "Numeros utiles ordenados:",
        resultadoActual.utiles.length ? resultadoActual.utiles.join("\n") : "No hubo numeros utiles.",
        "",
        `Concatenados utiles: ${resultadoActual.utiles.length ? resultadoActual.utiles.join(" - ") : "Sin resultados"}`
    ].join("\n");

    descargarTxt(contenido, `numeros-filtrados-${nombreFecha()}.txt`);
}

function descargarTxt(contenido, nombreArchivo) {
    const blob = new Blob([contenido], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = nombreArchivo;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
}

function nombreFecha() {
    const hoy = new Date();
    const d = String(hoy.getDate()).padStart(2, "0");
    const m = String(hoy.getMonth() + 1).padStart(2, "0");
    const y = hoy.getFullYear();
    return `${d}-${m}-${y}`;
}

function escapeHtml(valor) {
    return String(valor)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

formNumero.addEventListener("submit", (e) => {
    e.preventDefault();
    const indiceEditando = inputIndiceEdicion.value === "" ? -1 : Number(inputIndiceEdicion.value);
    const numero = normalizarNumero(inputNumero.value);
    const error = validarNumero(numero, indiceEditando);

    if (error) {
        setError(error);
        return;
    }

    if (indiceEditando >= 0) {
        numeros[indiceEditando] = numero;
    } else {
        numeros.push(numero);
    }

    guardarNumeros();
    cancelarEdicion();
    renderNumeros();
});

inputNumero.addEventListener("input", () => {
    const indiceEditando = inputIndiceEdicion.value === "" ? -1 : Number(inputIndiceEdicion.value);
    const error = inputNumero.value.trim() ? validarNumero(inputNumero.value, indiceEditando) : "";
    setError(error);
});

listaNumeros.addEventListener("click", (e) => {
    const boton = e.target.closest("button[data-action]");
    if (!boton) return;

    const indice = Number(boton.dataset.index);
    if (boton.dataset.action === "edit") iniciarEdicion(indice);
    if (boton.dataset.action === "delete") borrarNumero(indice);
});

archivoInput.addEventListener("change", () => {
    const archivo = archivoInput.files[0];
    if (!archivo) return;

    if (!archivo.name.toLowerCase().endsWith(".txt")) {
        mensajeArchivo.textContent = "El archivo debe ser de tipo .txt.";
        archivoNombre.textContent = "Archivo invalido";
        archivoInput.value = "";
        return;
    }

    const reader = new FileReader();
    reader.onload = () => {
        const leidos = extraerNumerosDesdeTexto(reader.result);
        archivoNombre.textContent = archivo.name;
        mensajeArchivo.textContent = leidos.length
            ? `Se leyeron ${leidos.length} numeros del archivo.`
            : "No se encontraron numeros dentro del archivo.";
        procesarNumeros(leidos);
    };
    reader.onerror = () => {
        archivoNombre.textContent = "Error";
        mensajeArchivo.textContent = "No se pudo leer el archivo seleccionado.";
    };
    reader.readAsText(archivo);
});

btnTema.addEventListener("click", cambiarTema);
btnCancelar.addEventListener("click", cancelarEdicion);
btnLimpiar.addEventListener("click", borrarTodo);
btnDescargarOriginal.addEventListener("click", descargarOriginal);
btnDescargarFiltrado.addEventListener("click", descargarFiltrado);
