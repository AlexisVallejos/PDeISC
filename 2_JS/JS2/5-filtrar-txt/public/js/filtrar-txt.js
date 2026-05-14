// Clave usada para recordar el tema claro/oscuro en localStorage.
const THEME_KEY = "js2-filtrar-txt-tema";
// Valida enteros y decimales con punto. No acepta coma decimal.
const NUMERO_REGEX = /^-?\d+(?:\.\d+)?$/;
// Limite de peso para el TXT subido: 1 MB.
const MAX_ARCHIVO_BYTES = 1024 * 1024;

// Referencias a botones, mensajes, contadores, listas y modal.
const btnTema = document.getElementById("btn-tema");
const btnDescargarFiltrado = document.getElementById("btn-descargar-filtrado");
const mensajeDescargaFiltrado = document.getElementById("mensaje-descarga-filtrado");
const archivoInput = document.getElementById("archivo-txt");
const archivoNombre = document.getElementById("archivo-nombre");
const mensajeArchivo = document.getElementById("mensaje-archivo");
const totalLeidos = document.getElementById("total-leidos");
const totalUtiles = document.getElementById("total-utiles");
const totalNoUtiles = document.getElementById("total-no-utiles");
const porcentajeUtiles = document.getElementById("porcentaje-utiles");
const totalFactoriales = document.getElementById("total-factoriales");
const listaUtiles = document.getElementById("lista-utiles");
const listaNoUtiles = document.getElementById("lista-no-utiles");
const listaFactoriales = document.getElementById("lista-factoriales");
const concatenadosFiltrados = document.getElementById("concatenados-filtrados");
const modalDescarga = document.getElementById("modal-descarga");
const btnDescargaCancelar = document.getElementById("btn-descarga-cancelar");
const btnDescargaConfirmar = document.getElementById("btn-descarga-confirmar");

// Estado central del procesamiento del archivo.
let resultadoActual = {
    leidos: [], // Numeros leidos del TXT.
    utiles: [], // Numeros que empiezan y terminan con el mismo digito.
    noUtiles: [], // Numeros que no cumplen la condicion.
    factoriales: [], // Numeros que son factoriales.
    porcentaje: 0 // Porcentaje de numeros utiles.
};

// Inicializacion de la pantalla.
iniciarTema();
renderResultado();

// Aplica el tema guardado; por defecto usa modo oscuro.
function iniciarTema() {
    const temaGuardado = localStorage.getItem(THEME_KEY);
    const usarOscuro = temaGuardado !== "light";
    document.body.classList.toggle("dark", usarOscuro);
    btnTema.textContent = usarOscuro ? "Modo claro" : "Modo oscuro";
}

// Alterna entre modo claro y oscuro.
function cambiarTema() {
    const usarOscuro = !document.body.classList.contains("dark");
    document.body.classList.toggle("dark", usarOscuro);
    localStorage.setItem(THEME_KEY, usarOscuro ? "dark" : "light");
    btnTema.textContent = usarOscuro ? "Modo claro" : "Modo oscuro";
}

// Convierte texto numerico a Number para ordenar y comparar.
function aNumeroComparable(valor) {
    return Number(String(valor));
}

// Deja solo los digitos relevantes para comparar el primero y el ultimo.
function soloDigitos(valor) {
    return String(valor).replace("-", "").replace(/\./g, "");
}

// Verifica si el valor representa un entero valido.
function esEnteroRepresentado(valor) {
    if (!NUMERO_REGEX.test(String(valor))) return false;
    return Number.isInteger(Number(valor));
}

// Valida el archivo antes de leer su contenido.
function validarArchivoTxt(archivo) {
    if (!archivo) return "Elegi un archivo TXT para procesar.";
    if (!archivo.name.toLowerCase().endsWith(".txt")) return "Elegi un archivo con extension .txt.";
    if (archivo.size === 0) return "El archivo esta vacio.";
    if (archivo.size > MAX_ARCHIVO_BYTES) return "El archivo es demasiado grande. Usa uno de hasta 1 MB.";
    if (archivo.type && archivo.type !== "text/plain") return "El archivo debe ser de texto plano.";
    return "";
}

// Valida que el TXT tenga solamente numeros separados por espacios o saltos de linea.
function validarContenidoTxt(texto) {
    const contenido = String(texto ?? "").trim();

    if (!contenido) {
        return { error: "El archivo no tiene contenido para procesar.", numeros: [] };
    }

    const tokens = contenido.split(/\s+/).filter(Boolean);
    const invalidos = tokens.filter((token) => !NUMERO_REGEX.test(token));

    // Si aparece una letra, coma decimal u otro simbolo invalido, se rechaza todo el archivo.
    if (invalidos.length) {
        const muestra = invalidos.slice(0, 3).join(", ");
        return {
            error: `El archivo contiene valores invalidos: ${muestra}. Usa solo numeros separados por espacios o saltos de linea.`,
            numeros: []
        };
    }

    if (!tokens.length) {
        return { error: "No encontramos numeros en este archivo.", numeros: [] };
    }

    return { error: "", numeros: tokens };
}

// Limpia pantalla y resultados cuando el archivo o contenido no es valido.
function limpiarResultadoPorError(mensaje, nombre = "Archivo invalido") {
    archivoNombre.textContent = nombre;
    mensajeArchivo.textContent = mensaje;
    resultadoActual = {
        leidos: [],
        utiles: [],
        noUtiles: [],
        factoriales: [],
        porcentaje: 0
    };
    renderResultado();
}

// Regla de utilidad: al menos dos digitos y primero igual al ultimo.
function empiezaYTerminaIgual(numero) {
    const limpio = soloDigitos(numero);
    if (limpio.length < 2) return false;
    return limpio[0] === limpio[limpio.length - 1];
}

// Ordena de forma numerica ascendente.
function compararNumeros(a, b) {
    const primero = aNumeroComparable(a);
    const segundo = aNumeroComparable(b);

    if (primero < segundo) return -1;
    if (primero > segundo) return 1;
    return String(a).localeCompare(String(b), "es", { numeric: true });
}

// Detecta si un numero entero es factorial de algun valor.
function esFactorial(numero) {
    // Los decimales no pueden ser factoriales.
    if (!esEnteroRepresentado(numero)) return false;

    const comparable = aNumeroComparable(numero);
    if (!Number.isFinite(comparable) || !Number.isSafeInteger(comparable)) return false;

    const valor = BigInt(String(Math.trunc(comparable)));

    if (valor < 1n) return false;
    if (valor === 1n) return true;

    let factorial = 1n;
    let multiplicador = 1n;

    // Calcula 1!, 2!, 3!, etc. hasta alcanzar o superar el numero.
    while (factorial < valor) {
        multiplicador += 1n;
        factorial *= multiplicador;
    }

    return factorial === valor;
}

// Aplica todas las reglas sobre los numeros leidos del archivo.
function procesarNumeros(leidos) {
    const utiles = leidos
        .filter(empiezaYTerminaIgual)
        .sort(compararNumeros);
    const noUtiles = leidos.filter((n) => !empiezaYTerminaIgual(n));
    const factoriales = leidos
        .filter(esFactorial)
        .sort(compararNumeros);
    const porcentaje = leidos.length ? (utiles.length * 100) / leidos.length : 0;

    resultadoActual = { leidos, utiles, noUtiles, factoriales, porcentaje };
    renderResultado();
}

// Actualiza contadores, listas, concatenado y boton de descarga.
function renderResultado() {
    totalLeidos.textContent = resultadoActual.leidos.length;
    totalUtiles.textContent = resultadoActual.utiles.length;
    totalNoUtiles.textContent = resultadoActual.noUtiles.length;
    porcentajeUtiles.textContent = `${resultadoActual.porcentaje.toFixed(2)}%`;
    totalFactoriales.textContent = resultadoActual.factoriales.length;

    // Lista de numeros que cumplen.
    listaUtiles.innerHTML = "";
    resultadoActual.utiles.forEach((numero) => {
        const item = document.createElement("li");
        item.textContent = numero;
        listaUtiles.appendChild(item);
    });

    // Lista de numeros que no cumplen.
    listaNoUtiles.innerHTML = "";
    resultadoActual.noUtiles.forEach((numero) => {
        const item = document.createElement("li");
        item.textContent = numero;
        listaNoUtiles.appendChild(item);
    });

    // Lista de numeros factoriales.
    listaFactoriales.innerHTML = "";
    resultadoActual.factoriales.forEach((numero) => {
        const item = document.createElement("li");
        item.textContent = numero;
        listaFactoriales.appendChild(item);
    });

    concatenadosFiltrados.textContent = resultadoActual.utiles.length
        ? resultadoActual.utiles.join(" - ")
        : "Sin resultados";

    btnDescargarFiltrado.disabled = resultadoActual.leidos.length === 0;
    mensajeDescargaFiltrado.textContent = resultadoActual.leidos.length
        ? "Resultado listo. Elegi donde guardar tu copia y el backend guardara otra."
        : "Subi un TXT para generar el resultado.";
    mensajeDescargaFiltrado.className = resultadoActual.leidos.length ? "status-message ok" : "status-message";
}

// Abre el modal previo a descargar el resultado.
function abrirModalDescarga() {
    if (resultadoActual.leidos.length === 0) return;

    modalDescarga.hidden = false;
    document.body.classList.add("modal-open");
    btnDescargaCancelar.focus();
}

// Cierra el modal sin descargar.
function cerrarModalDescarga() {
    modalDescarga.hidden = true;
    document.body.classList.remove("modal-open");
    btnDescargarFiltrado.focus();
}

// Confirma y ejecuta la descarga filtrada.
async function confirmarDescargaFiltrada() {
    modalDescarga.hidden = true;
    document.body.classList.remove("modal-open");
    await descargarFiltrado();
}

// Genera el TXT final con estadisticas y resultados.
async function descargarFiltrado() {
    if (resultadoActual.leidos.length === 0) return;

    const contenido = [
        "RESULTADO DE FILTRADO",
        `Total leidos: ${resultadoActual.leidos.length}`,
        `Numeros utiles: ${resultadoActual.utiles.length}`,
        `Numeros no utiles: ${resultadoActual.noUtiles.length}`,
        `Porcentaje de utiles: ${resultadoActual.porcentaje.toFixed(2)}%`,
        `Numeros factoriales: ${resultadoActual.factoriales.length}`,
        "",
        "Numeros utiles ordenados:",
        resultadoActual.utiles.length ? resultadoActual.utiles.join("\n") : "No hubo numeros utiles.",
        "",
        "Numeros que no cumplen:",
        resultadoActual.noUtiles.length ? resultadoActual.noUtiles.join("\n") : "Todos los numeros cumplen.",
        "",
        "Numeros factoriales encontrados:",
        resultadoActual.factoriales.length ? resultadoActual.factoriales.join("\n") : "No hubo numeros factoriales.",
        "",
        `Concatenados utiles: ${resultadoActual.utiles.length ? resultadoActual.utiles.join(" - ") : "Sin resultados"}`
    ].join("\n");

    const nombreArchivo = "numeros-filtrados.txt";
    const guardadoCliente = await descargarTxt(contenido, nombreArchivo);

    // Si el usuario cancela el guardado, no se guarda copia en el backend.
    if (!guardadoCliente) {
        mensajeDescargaFiltrado.textContent = "Se cancelo la descarga. No se guardo la copia del backend.";
        mensajeDescargaFiltrado.className = "status-message";
        return;
    }

    guardarCopiaEnServidor(contenido, nombreArchivo, mensajeDescargaFiltrado);
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

// Envia una copia del TXT final al backend.
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

// Evento de subida de archivo: valida, lee y procesa el TXT.
archivoInput.addEventListener("change", () => {
    const archivo = archivoInput.files[0];
    const errorArchivo = validarArchivoTxt(archivo);

    if (errorArchivo) {
        limpiarResultadoPorError(errorArchivo);
        archivoInput.value = "";
        return;
    }

    const reader = new FileReader();
    reader.onload = () => {
        const { error, numeros: leidos } = validarContenidoTxt(reader.result);

        if (error) {
            limpiarResultadoPorError(error, archivo.name);
            return;
        }

        archivoNombre.textContent = archivo.name;
        mensajeArchivo.textContent = `Listo: se leyeron ${leidos.length} numeros validos.`;
        procesarNumeros(leidos);
    };
    reader.onerror = () => {
        limpiarResultadoPorError("No se pudo leer el archivo. Elegi otro TXT e intenta de nuevo.", "Error");
    };
    reader.readAsText(archivo);
});

// Eventos de botones y modal.
btnTema.addEventListener("click", cambiarTema);
btnDescargarFiltrado.addEventListener("click", abrirModalDescarga);
btnDescargaCancelar.addEventListener("click", cerrarModalDescarga);
btnDescargaConfirmar.addEventListener("click", confirmarDescargaFiltrada);

// Cierra el modal al hacer clic fuera de la tarjeta.
modalDescarga.addEventListener("click", (e) => {
    if (e.target === modalDescarga) cerrarModalDescarga();
});

// Cierra el modal con Escape.
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modalDescarga.hidden) cerrarModalDescarga();
});
