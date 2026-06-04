// Cantidad minima de numeros necesaria para habilitar la descarga.
const MIN_NUMEROS = 10;
// Cantidad maxima de numeros que permite la consigna.
const MAX_NUMEROS = 20;
// Clave usada para guardar la lista en localStorage.
const STORAGE_KEY = "js2-crear-txt-numeros";
// Clave usada para recordar el tema claro/oscuro.
const THEME_KEY = "js2-crear-txt-tema";
// Valida enteros y decimales con punto: 12, -12, 12.5. No acepta coma.
const NUMERO_REGEX = /^-?\d+(?:\.\d+)?$/;

// Referencias a elementos del formulario y controles principales.
const formNumero = document.getElementById("form-numero");
const inputNumero = document.getElementById("numero");
const inputIndiceEdicion = document.getElementById("indice-edicion");
const errorNumero = document.getElementById("error-numero");
const btnGuardar = document.getElementById("btn-guardar");
const btnCancelar = document.getElementById("btn-cancelar");
const btnLimpiar = document.getElementById("btn-limpiar");
const btnDescargarOriginal = document.getElementById("btn-descargar-original");
const btnTema = document.getElementById("btn-tema");

// Referencias a textos y contenedores que se actualizan al cargar numeros.
const mensajeDescargaOriginal = document.getElementById("mensaje-descarga-original");
const contadorCarga = document.getElementById("contador-carga");
const barraProgreso = document.getElementById("barra-progreso");
const estadoCarga = document.getElementById("estado-carga");
const listaNumeros = document.getElementById("lista-numeros");
const concatenados = document.getElementById("concatenados");

// Referencias del modal para confirmar la limpieza de la lista.
const modalLimpiar = document.getElementById("modal-limpiar");
const btnModalCancelar = document.getElementById("btn-modal-cancelar");
const btnModalConfirmar = document.getElementById("btn-modal-confirmar");

// Referencias del modal para confirmar la descarga.
const modalDescarga = document.getElementById("modal-descarga");
const btnDescargaCancelar = document.getElementById("btn-descarga-cancelar");
const btnDescargaConfirmar = document.getElementById("btn-descarga-confirmar");

// Estado principal: se carga desde localStorage para no perder datos al refrescar.
let numeros = cargarNumeros();

// Inicializacion de la pantalla.
iniciarTema();
renderNumeros();

// Convierte cualquier valor a texto y elimina espacios externos.
function normalizarNumero(valor) {
    return String(valor ?? "").trim();
}

// Convierte el texto numerico a Number para validaciones y comparaciones.
function aNumeroComparable(valor) {
    return Number(String(valor));
}

// Valida un numero antes de agregarlo o guardarlo editado.
function validarNumero(valor, indiceEditando = -1) {
    const numero = normalizarNumero(valor);

    // Campo obligatorio.
    if (!numero) return "Ingresa un numero para agregarlo.";
    // Solo enteros o decimales con punto.
    if (!NUMERO_REGEX.test(numero)) return "Usa numeros enteros o decimales con punto. No uses coma.";
    // Evita valores que Number no pueda procesar.
    if (!Number.isFinite(aNumeroComparable(numero))) return "Ingresa un numero que se pueda procesar.";
    // Evita guardar -0, porque visualmente no aporta y puede confundir.
    if (aNumeroComparable(numero) === 0 && numero.startsWith("-")) return "Escribi 0 en lugar de -0.";
    // Limita el largo para que la interfaz y el archivo sigan siendo manejables.
    if (numero.length > 16) return "Usa un numero de hasta 16 caracteres.";
    // Si se edita, verifica que el indice exista.
    if (indiceEditando >= numeros.length) return "No se encontro el numero que queres editar.";

    // Si no se esta editando y ya hay 20 numeros, bloquea nuevas altas.
    if (indiceEditando === -1 && numeros.length >= MAX_NUMEROS) {
        return `Solo se pueden cargar hasta ${MAX_NUMEROS} numeros.`;
    }

    // Sin mensaje significa que el numero es valido.
    return "";
}

// Lee numeros guardados previamente en el navegador.
function cargarNumeros() {
    try {
        const datos = JSON.parse(localStorage.getItem(STORAGE_KEY));
        // Si no es un array, se ignora.
        if (!Array.isArray(datos)) return [];
        // Se aceptan solo valores validos y como maximo 20.
        return datos.filter((n) => NUMERO_REGEX.test(String(n))).slice(0, MAX_NUMEROS).map(String);
    } catch {
        // Si localStorage trae JSON roto, se arranca con lista vacia.
        return [];
    }
}

// Guarda la lista actual en localStorage.
function guardarNumeros() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(numeros));
}

// Muestra un error y pinta el input como invalido si corresponde.
function setError(mensaje) {
    errorNumero.textContent = mensaje;
    inputNumero.classList.toggle("invalid", Boolean(mensaje));
}

// Aplica el tema guardado; por defecto usa oscuro.
function iniciarTema() {
    const temaGuardado = localStorage.getItem(THEME_KEY);
    const usarOscuro = temaGuardado !== "light";
    document.body.classList.toggle("dark", usarOscuro);
    btnTema.textContent = usarOscuro ? "Modo claro" : "Modo oscuro";
}

// Cambia entre modo claro y oscuro y guarda la preferencia.
function cambiarTema() {
    const usarOscuro = !document.body.classList.contains("dark");
    document.body.classList.toggle("dark", usarOscuro);
    localStorage.setItem(THEME_KEY, usarOscuro ? "dark" : "light");
    btnTema.textContent = usarOscuro ? "Modo claro" : "Modo oscuro";
}

// Redibuja contador, progreso, mensajes, botones y tarjetas de numeros.
function renderNumeros() {
    contadorCarga.textContent = `${numeros.length} / ${MAX_NUMEROS}`;
    barraProgreso.style.width = `${Math.min((numeros.length / MAX_NUMEROS) * 100, 100)}%`;

    // Mensaje cuando faltan numeros para llegar al minimo.
    if (numeros.length < MIN_NUMEROS) {
        estadoCarga.textContent = `Agrega ${MIN_NUMEROS - numeros.length} numeros mas para descargar el TXT.`;
        mensajeDescargaOriginal.textContent = "Cuando tengas 10 numeros, se habilita la descarga.";
        mensajeDescargaOriginal.className = "status-message";
    } else if (numeros.length < MAX_NUMEROS) {
        // Mensaje cuando ya puede descargar pero aun puede agregar mas.
        estadoCarga.textContent = `Ya podes descargar. Tambien podes agregar ${MAX_NUMEROS - numeros.length} mas.`;
        mensajeDescargaOriginal.textContent = "Al descargar, guardas una copia y otra queda en la carpeta del servidor.";
        mensajeDescargaOriginal.className = "status-message ok";
    } else {
        // Mensaje cuando se llega al maximo de la consigna.
        estadoCarga.textContent = "Llegaste al maximo de 20 numeros.";
        mensajeDescargaOriginal.textContent = "Lista completa. Descarga tu copia y el backend guardara la suya.";
        mensajeDescargaOriginal.className = "status-message ok";
    }

    // Limpia las tarjetas anteriores antes de volver a renderizar.
    listaNumeros.innerHTML = "";

    // Crea una tarjeta por cada numero cargado.
    numeros.forEach((numero, indice) => {
        const card = document.createElement("article");
        card.className = "number-card";
        card.innerHTML = `
            <strong>${escapeHtml(numero)}</strong>
            <div class="card-actions">
                <button class="mini-btn" type="button" data-action="edit" data-index="${indice}" aria-label="Editar ${escapeHtml(numero)}">Editar</button>
                <button class="mini-btn delete" type="button" data-action="delete" data-index="${indice}" aria-label="Borrar ${escapeHtml(numero)}">Borrar</button>
            </div>
        `;
        listaNumeros.appendChild(card);
    });

    // Vista previa del contenido que tendra el TXT.
    concatenados.textContent = numeros.length ? numeros.join(" - ") : "Todavia no agregaste numeros.";
    // Habilita o deshabilita acciones segun el estado actual.
    btnLimpiar.disabled = numeros.length === 0;
    btnDescargarOriginal.disabled = numeros.length < MIN_NUMEROS;
    btnGuardar.disabled = numeros.length >= MAX_NUMEROS && inputIndiceEdicion.value === "";
    btnGuardar.textContent = inputIndiceEdicion.value === "" ? "Agregar numero" : "Guardar cambio";
}

// Activa el modo edicion para un numero existente.
function iniciarEdicion(indice) {
    inputIndiceEdicion.value = String(indice);
    inputNumero.value = numeros[indice];
    btnGuardar.textContent = "Guardar cambio";
    btnCancelar.hidden = false;
    setError("");
    inputNumero.focus();
}

// Sale del modo edicion y limpia el formulario.
function cancelarEdicion() {
    inputIndiceEdicion.value = "";
    inputNumero.value = "";
    btnGuardar.textContent = "Agregar numero";
    btnCancelar.hidden = true;
    btnGuardar.disabled = numeros.length >= MAX_NUMEROS;
    setError("");
}

// Borra un solo numero por indice.
function borrarNumero(indice) {
    numeros.splice(indice, 1);
    guardarNumeros();
    cancelarEdicion();
    renderNumeros();
}

// Pide confirmacion antes de borrar todos los numeros.
function borrarTodo() {
    if (!numeros.length) return;
    abrirModalLimpiar();
}

// Borra toda la lista despues de confirmar el modal.
function confirmarBorradoTotal() {
    numeros = [];
    guardarNumeros();
    cancelarEdicion();
    renderNumeros();
    cerrarModalLimpiar();
}

// Muestra el modal de limpiar lista.
function abrirModalLimpiar() {
    modalLimpiar.hidden = false;
    document.body.classList.add("modal-open");
    btnModalCancelar.focus();
}

// Oculta el modal de limpiar lista.
function cerrarModalLimpiar() {
    modalLimpiar.hidden = true;
    document.body.classList.remove("modal-open");
    btnLimpiar.focus();
}

// Abre el modal que explica la descarga doble: usuario y servidor.
function abrirModalDescarga() {
    if (numeros.length < MIN_NUMEROS) {
        setError(`Para descargar primero carga al menos ${MIN_NUMEROS} numeros.`);
        return;
    }

    modalDescarga.hidden = false;
    document.body.classList.add("modal-open");
    btnDescargaCancelar.focus();
}

// Cierra el modal de descarga sin descargar.
function cerrarModalDescarga() {
    modalDescarga.hidden = true;
    document.body.classList.remove("modal-open");
    btnDescargarOriginal.focus();
}

// Confirma el modal y ejecuta la descarga.
async function confirmarDescargaOriginal() {
    modalDescarga.hidden = true;
    document.body.classList.remove("modal-open");
    await descargarOriginal();
}

// Genera el TXT original, descarga una copia y manda otra al servidor.
async function descargarOriginal() {
    if (numeros.length < MIN_NUMEROS) {
        setError(`Para descargar primero carga al menos ${MIN_NUMEROS} numeros.`);
        return;
    }

    const contenido = numeros.join("\n");
    const nombreArchivo = "numeros-originales.txt";
    const guardadoCliente = await descargarTxt(contenido, nombreArchivo);

    // Si el usuario cancela el selector de guardado, no se manda copia al backend.
    if (!guardadoCliente) {
        mensajeDescargaOriginal.textContent = "Se cancelo la descarga. No se guardo la copia del backend.";
        mensajeDescargaOriginal.className = "status-message";
        return;
    }

    guardarCopiaEnServidor(contenido, nombreArchivo, mensajeDescargaOriginal);
}

// Descarga el TXT en la computadora del usuario.
async function descargarTxt(contenido, nombreArchivo) {
    // API moderna: permite elegir ubicacion y nombre de archivo.
    if ("showSaveFilePicker" in window) {
        try {
            const archivo = await window.showSaveFilePicker({
                suggestedName: nombreArchivo,
                types: [
                    {
                        description: "Archivo de texto",
                        accept: { "text/plain": [".txt"] }
                    }
                ]
            });
            const writable = await archivo.createWritable();
            await writable.write(contenido);
            await writable.close();
            return true;
        } catch (error) {
            if (error.name === "AbortError") return false;
        }
    }

    // Fallback: descarga tradicional con Blob y enlace temporal.
    const blob = new Blob([contenido], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = nombreArchivo;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    return true;
}

// Envia una copia del TXT al backend para guardarla en archivos-servidor.
async function guardarCopiaEnServidor(contenido, nombreArchivo, mensajeEstado) {
    mensajeEstado.textContent = "Copia del usuario lista. Guardando otra copia en el backend...";
    mensajeEstado.className = "status-message";

    try {
        const respuesta = await fetch("/api/guardar-txt", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contenido, nombreArchivo })
        });

        if (!respuesta.ok) {
            mensajeEstado.textContent = "El TXT se descargo, pero no se pudo guardar la copia en el proyecto.";
            mensajeEstado.className = "status-message error";
            return;
        }

        await respuesta.json();
        mensajeEstado.textContent = "Descarga lista. Copia guardada en backend.";
        mensajeEstado.className = "status-message ok";
    } catch {
        mensajeEstado.textContent = "El TXT se descargo, pero el servidor no respondio para guardar la copia.";
        mensajeEstado.className = "status-message error";
    }
}

// Escapa caracteres HTML para evitar que un texto del usuario se interprete como codigo.
function escapeHtml(valor) {
    return String(valor)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

// Evento principal del formulario: agrega o edita numeros.
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

// Valida mientras el usuario escribe.
inputNumero.addEventListener("input", () => {
    const indiceEditando = inputIndiceEdicion.value === "" ? -1 : Number(inputIndiceEdicion.value);
    const error = inputNumero.value.trim() ? validarNumero(inputNumero.value, indiceEditando) : "";
    setError(error);
});

// Delegacion de eventos: un solo listener maneja editar y borrar tarjetas.
listaNumeros.addEventListener("click", (e) => {
    const boton = e.target.closest("button[data-action]");
    if (!boton) return;

    const indice = Number(boton.dataset.index);
    if (boton.dataset.action === "edit") iniciarEdicion(indice);
    if (boton.dataset.action === "delete") borrarNumero(indice);
});

// Eventos de botones principales.
btnTema.addEventListener("click", cambiarTema);
btnCancelar.addEventListener("click", cancelarEdicion);
btnLimpiar.addEventListener("click", borrarTodo);
btnDescargarOriginal.addEventListener("click", abrirModalDescarga);

// Eventos de modales.
btnModalCancelar.addEventListener("click", cerrarModalLimpiar);
btnModalConfirmar.addEventListener("click", confirmarBorradoTotal);
btnDescargaCancelar.addEventListener("click", cerrarModalDescarga);
btnDescargaConfirmar.addEventListener("click", confirmarDescargaOriginal);

// Cierra modales al hacer clic sobre el fondo oscuro.
modalLimpiar.addEventListener("click", (e) => {
    if (e.target === modalLimpiar) cerrarModalLimpiar();
});

modalDescarga.addEventListener("click", (e) => {
    if (e.target === modalDescarga) cerrarModalDescarga();
});

// Cierra modales con Escape.
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modalLimpiar.hidden) cerrarModalLimpiar();
    if (e.key === "Escape" && !modalDescarga.hidden) cerrarModalDescarga();
});
