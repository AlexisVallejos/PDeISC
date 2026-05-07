/**
 * Proyecto 2 — Inventario Deportivo dinámico.
 *
 * Qué hace:
 *  - Captura 10 campos por artículo (deporte, herramienta, marca, modelo,
 *    precio, stock, talle, color, material, fecha) + el método de
 *    almacenaje elegido por el usuario.
 *  - Guarda cada artículo en el array global `inventario` usando uno de
 *    estos 4 métodos: push, unshift, splice o asignación por índice.
 *  - Renderiza en vivo la lista de artículos y un panel de estadísticas
 *    (total, stock acumulado, valor total y deportes únicos).
 *
 * Validaciones (lado cliente):
 *  - Validación por campo en `blur` y limpieza en `input`.
 *  - Validación completa en submit antes de almacenar.
 *  - escapeHtml en TODO render para prevenir XSS.
 *  - Whitelist del método de almacenaje.
 *  - Tope global de MAX_ITEMS para no saturar el DOM.
 */

// === Constantes de configuración ===
// Todo valor de control de negocio/validación vive acá para fácil mantenimiento.

const METODOS_VALIDOS = ['push', 'unshift', 'splice', 'indice'];
const DEPORTES_VALIDOS = ['Fútbol', 'Futsal', 'Básquet', 'Vóley', 'Handball', 'Hockey', 'Natación', 'Atletismo', 'Tenis', 'Otro'];

// Regex genérica para campos de texto (letras Unicode, dígitos, signos comunes).
const RE_TEXTO_GEN = /^[\p{L}0-9\s.,'\-+/()]{1,80}$/u;
// Talle: alfanumérico básico (M, XL, 42, etc.).
const RE_TALLE = /^[A-Za-z0-9.\-/ ]{1,20}$/;
// Color: solo letras y guiones (azul, rojo-claro).
const RE_COLOR = /^[\p{L}\s\-]{1,30}$/u;

const MAX_PRECIO = 10_000_000;
const MAX_STOCK = 100_000;
const MAX_ITEMS = 1000;

// Array global donde se guardan todos los artículos.
// Representa el estado en memoria de este módulo.
const inventario = [];

// Referencias al DOM que se reutilizan.
// Se cachean para evitar búsquedas repetidas en cada evento.
const formEl = document.getElementById('form-articulo');
const listaEl = document.getElementById('lista-articulos');
const totalItemsEl = document.getElementById('total-items');

const statTotalEl = document.getElementById('stat-total');
const statStockEl = document.getElementById('stat-stock');
const statValorEl = document.getElementById('stat-valor');
const statDeportesEl = document.getElementById('stat-deportes');

// === Utilidades ===
// Helpers de uso transversal (sanitizado y normalización).

/** Escapa caracteres HTML peligrosos antes de inyectar texto al DOM (XSS). */
function escapeHtml(str) {
    return String(str ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

/** Normaliza texto: trim + colapsa espacios internos. */
function norm(v) {
    return String(v ?? '').trim().replace(/\s+/g, ' ');
}

// === Validadores ===
// Cada validador devuelve '' cuando el dato es correcto.
// Cada uno devuelve '' si es OK o un mensaje de error legible.

/** Valida un texto: trim, longitud y regex configurables. */
function validarTexto(v, { min = 1, max = 80, label = 'Campo', regex = RE_TEXTO_GEN } = {}) {
    const s = norm(v);
    if (!s) return `${label}: obligatorio`;
    if (s.length < min) return `${label}: mín. ${min} caracteres`;
    if (s.length > max) return `${label}: máx. ${max} caracteres`;
    if (!regex.test(s)) return `${label}: caracteres inválidos`;
    return '';
}

/** Valida número: finito, rango cerrado [min, max], opcionalmente entero. */
function validarNumero(v, { min, max, entero = false, label = 'Número' } = {}) {
    const s = String(v ?? '').trim().replace(',', '.');
    if (s === '') return `${label}: obligatorio`;
    const n = Number(s);
    if (!Number.isFinite(n)) return `${label}: numérico inválido`;
    if (entero && !Number.isInteger(n)) return `${label}: debe ser entero`;
    if (n < min) return `${label}: mín. ${min}`;
    if (n > max) return `${label}: máx. ${max}`;
    return '';
}

/** Valida fecha ISO (yyyy-mm-dd): no futura y no anterior a 1900. */
function validarFecha(v) {
    if (!v) return 'Fecha obligatoria';
    if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return 'Formato inválido';
    const f = new Date(v + 'T00:00:00');
    if (isNaN(f.getTime())) return 'Fecha inválida';
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    if (f > hoy) return 'No puede ser futura';
    const minimo = new Date('1900-01-01');
    if (f < minimo) return 'Demasiado antigua';
    return '';
}

/** Valida que el método de almacenaje esté en el whitelist. */
function validarMetodo(v) {
    if (!METODOS_VALIDOS.includes(v)) return 'Método inválido';
    return '';
}

/** Valida deporte contra lista cerrada de opciones del EMDER. */
function validarDeporte(v) {
    if (!DEPORTES_VALIDOS.includes(v)) return 'Seleccioná un deporte de la lista';
    return '';
}

/** Valida un artículo completo. Devuelve { campo: msg } con todos los errores. */
function validarArticulo(art) {
    // Valida todas las propiedades del artículo y arma un objeto de errores.
    const e = {};
    let m;
    if ((m = validarDeporte(art.deporte))) e.deporte = m;
    if ((m = validarTexto(art.herramienta, { min: 2, max: 60, label: 'Herramienta' }))) e.herramienta = m;
    if ((m = validarTexto(art.marca, { min: 1, max: 40, label: 'Marca' }))) e.marca = m;
    if ((m = validarTexto(art.modelo, { min: 1, max: 40, label: 'Modelo' }))) e.modelo = m;
    if ((m = validarNumero(art.precio, { min: 0.01, max: MAX_PRECIO, label: 'Precio' }))) e.precio = m;
    if ((m = validarNumero(art.stock, { min: 0, max: MAX_STOCK, entero: true, label: 'Stock' }))) e.stock = m;
    if ((m = validarTexto(art.talle, { min: 1, max: 20, label: 'Talle', regex: RE_TALLE }))) e.talle = m;
    if ((m = validarTexto(art.color, { min: 2, max: 30, label: 'Color', regex: RE_COLOR }))) e.color = m;
    if ((m = validarTexto(art.material, { min: 2, max: 40, label: 'Material' }))) e.material = m;
    if ((m = validarFecha(art.fecha))) e.fecha = m;
    if ((m = validarMetodo(art.metodoUsado))) e.metodo = m;
    return e;
}

// === Helpers de UI (errores y mensajes) ===
// Encapsulan el feedback visual para no repetir código.

/** Mensaje global success/error que se oculta solo a los 3.5s. */
function showMessage(text, type) {
    const el = document.getElementById('form-msg');
    el.textContent = text;
    el.className = `message show ${type}`;
    clearTimeout(el._timer);
    el._timer = setTimeout(() => el.classList.remove('show'), 3500);
}

/** Pinta el error de un campo y le agrega borde rojo. Vacío = OK. */
function setError(campo, mensaje) {
    const small = document.querySelector(`.error-msg[data-error="${campo}"]`);
    if (small) small.textContent = mensaje;
    const input = formEl.querySelector(`[name="${campo === 'metodo' ? 'metodo' : campo}"]`);
    if (input) input.classList.toggle('invalid', !!mensaje);
}

/** Limpia los errores de todos los campos del formulario. */
function clearAllErrors() {
    formEl.querySelectorAll('.error-msg').forEach((s) => (s.textContent = ''));
    formEl.querySelectorAll('input, select').forEach((i) => i.classList.remove('invalid'));
}

// === Render ===
// Bloque responsable de pintar estadísticas y tarjetas de inventario.

/** Recalcula y muestra el panel de estadísticas. */
function renderStats() {
    // Recalcula métricas en cada cambio de inventario.
    statTotalEl.textContent = inventario.length;

    const stockTotal = inventario.reduce((acc, a) => acc + a.stock, 0);
    statStockEl.textContent = stockTotal;

    const valorTotal = inventario.reduce((acc, a) => acc + a.precio * a.stock, 0);
    statValorEl.textContent = `$${valorTotal.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    const deportesUnicos = new Set(inventario.map((a) => a.deporte.toLowerCase()));
    statDeportesEl.textContent = deportesUnicos.size;
}

/** Redibuja la lista de artículos con HTML escapado en cada campo. */
function renderLista() {
    // Redibuja lista completa para mantener UI consistente.
    listaEl.innerHTML = '';
    inventario.forEach((art, idx) => {
        const div = document.createElement('div');
        div.className = `articulo metodo-${art.metodoUsado}`;
        div.innerHTML = `
            <span class="indice">[${idx}]</span>
            <h3>${escapeHtml(art.herramienta)}</h3>
            <span class="deporte-tag">${escapeHtml(art.deporte)}</span>
            <div class="detalles">
                <div><strong>Marca:</strong> ${escapeHtml(art.marca)}</div>
                <div><strong>Modelo:</strong> ${escapeHtml(art.modelo)}</div>
                <div><strong>Talle:</strong> ${escapeHtml(art.talle)}</div>
                <div><strong>Color:</strong> ${escapeHtml(art.color)}</div>
                <div><strong>Material:</strong> ${escapeHtml(art.material)}</div>
                <div><strong>Stock:</strong> ${escapeHtml(art.stock)}</div>
                <div><strong>Ingreso:</strong> ${escapeHtml(art.fecha)}</div>
            </div>
            <div class="precio">$${art.precio.toFixed(2)}</div>
            <span class="metodo-usado">${escapeHtml(art.metodoUsado)}()</span>
        `;
        listaEl.appendChild(div);
    });
    totalItemsEl.textContent = inventario.length;
    renderStats();
}

// === Almacenaje ===
// Inserta en distintas posiciones según el método elegido por usuario.

/**
 * Inserta el artículo en el array `inventario` con el método elegido:
 *  - push     → al final.
 *  - unshift  → al inicio.
 *  - splice   → en el medio (índice = longitud / 2).
 *  - indice   → asignación manual `arr[arr.length] = art`.
 */
function almacenar(art, metodo) {
    switch (metodo) {
        case 'push':
            inventario.push(art);
            break;
        case 'unshift':
            inventario.unshift(art);
            break;
        case 'splice': {
            const medio = Math.floor(inventario.length / 2);
            inventario.splice(medio, 0, art);
            break;
        }
        case 'indice':
            inventario[inventario.length] = art;
            break;
        default:
            throw new Error('Método de almacenaje no soportado');
    }
}

// === Submit del formulario ===
// Flujo de alta: leer -> validar -> guardar -> renderizar.
// Lee con FormData, valida todos los campos, y si pasa los chequeos
// almacena el artículo y resetea el formulario.
formEl.addEventListener('submit', (e) => {
    e.preventDefault();
    clearAllErrors();

    const fd = new FormData(formEl);
    const art = {
        deporte: norm(fd.get('deporte')),
        herramienta: norm(fd.get('herramienta')),
        marca: norm(fd.get('marca')),
        modelo: norm(fd.get('modelo')),
        precio: parseFloat(String(fd.get('precio') ?? '').replace(',', '.')),
        stock: parseInt(fd.get('stock'), 10),
        talle: norm(fd.get('talle')),
        color: norm(fd.get('color')),
        material: norm(fd.get('material')),
        fecha: String(fd.get('fecha') || ''),
        metodoUsado: String(fd.get('metodo') || '')
    };

    // 1) Validación estructural de todos los campos
    const errores = validarArticulo(art);
    if (Object.keys(errores).length > 0) {
        for (const [campo, msg] of Object.entries(errores)) setError(campo, msg);
        showMessage('Hay errores en el formulario. Revisalos antes de guardar.', 'error');
        return;
    }

    // 2) Regla de límite global
    if (inventario.length >= MAX_ITEMS) {
        showMessage(`Límite de ${MAX_ITEMS} artículos alcanzado.`, 'error');
        return;
    }

    // 3) Persistencia en memoria + render + feedback
    almacenar(art, art.metodoUsado);
    renderLista();
    showMessage(`"${art.herramienta}" agregado con ${art.metodoUsado}()`, 'success');
    formEl.reset();
});

// === Validación en vivo ===
// Feedback inmediato en blur/input por campo.
// Mapeo nombre-de-campo → función que devuelve mensaje de error o ''.
// Se usa al perder el foco (blur) para feedback inmediato por campo.
const validadoresEnVivo = {
    deporte: (v) => validarDeporte(v),
    herramienta: (v) => validarTexto(v, { min: 2, max: 60, label: 'Herramienta' }),
    marca: (v) => validarTexto(v, { min: 1, max: 40, label: 'Marca' }),
    modelo: (v) => validarTexto(v, { min: 1, max: 40, label: 'Modelo' }),
    precio: (v) => validarNumero(v, { min: 0.01, max: MAX_PRECIO, label: 'Precio' }),
    stock: (v) => validarNumero(v, { min: 0, max: MAX_STOCK, entero: true, label: 'Stock' }),
    talle: (v) => validarTexto(v, { min: 1, max: 20, label: 'Talle', regex: RE_TALLE }),
    color: (v) => validarTexto(v, { min: 2, max: 30, label: 'Color', regex: RE_COLOR }),
    material: (v) => validarTexto(v, { min: 2, max: 40, label: 'Material' }),
    fecha: (v) => validarFecha(v),
    metodo: (v) => validarMetodo(v)
};

// Engancha cada input/select del formulario a su validador en vivo.
formEl.querySelectorAll('input, select').forEach((input) => {
    // Al perder el foco: valida ese campo y muestra/oculta el error.
    input.addEventListener('blur', () => {
        const campo = input.name;
        const fn = validadoresEnVivo[campo];
        if (!fn) return;
        const err = fn(input.value);
        setError(campo, err);
    });

    // Mientras el usuario escribe: borra el error previo.
    input.addEventListener('input', () => {
        const campo = input.name;
        const small = document.querySelector(`.error-msg[data-error="${campo}"]`);
        if (small) small.textContent = '';
        input.classList.remove('invalid');
    });
});
