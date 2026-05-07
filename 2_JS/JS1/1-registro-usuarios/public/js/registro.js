/**
 * Proyecto 1 — Registro dinámico de pacientes (Hospital Central).
 *
 * Demuestra las 3 formas más comunes de leer formularios en JavaScript,
 * cada una en una tarjeta independiente:
 *  1) document.getElementById() + .value         (clásica, campo a campo)
 *  2) document.querySelector()  + .value         (selectores CSS)
 *  3) new FormData(form) + iteración con .get()  (moderna, en bloque)
 *
 * Flujo común:
 *  1. El usuario completa un formulario y hace submit.
 *  2. `e.preventDefault()` evita que el navegador recargue la página.
 *  3. Se leen los campos con el método correspondiente.
 *  4. Se ejecuta `procesarAlta(...)` que valida + guarda + renderiza.
 *
 * Validaciones (lado cliente):
 *  - escapeHtml en TODO render → previene XSS.
 *  - Nombre: regex Unicode + longitud 2-50.
 *  - Edad: entero finito en [0, 120].
 *  - Área: whitelist (solo se aceptan valores conocidos).
 *  - No se permite cargar pacientes idénticos (mismo nombre+edad+área).
 *  - Tope global de MAX_PACIENTES para no saturar el DOM.
 */

// === Constantes de configuración ===

const AREAS_VALIDAS = ['Clínica', 'Pediatría', 'Cardiología', 'Traumatología'];
const RE_NOMBRE = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s'.-]{2,50}$/;
const MAX_PACIENTES = 500;

// Array global donde se guardan todos los pacientes registrados.
const pacientes = [];

// Referencias al DOM que se reutilizan.
const listaEl = document.getElementById('lista-pacientes');
const totalEl = document.getElementById('total-pacientes');

// === Utilidades ===

/** Escapa caracteres HTML peligrosos antes de inyectar texto al DOM (XSS). */
function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

/** Devuelve un nombre normalizado (trim + colapsa espacios internos). */
function normalizarNombre(v) {
    return String(v ?? '').trim().replace(/\s+/g, ' ');
}

// === Validadores ===
// Cada uno devuelve '' si es OK o un mensaje de error legible.

/** Valida nombre del paciente. */
function validarNombre(v) {
    const n = normalizarNombre(v);
    if (!n) return 'El nombre es obligatorio';
    if (n.length < 2) return 'Mínimo 2 caracteres';
    if (n.length > 50) return 'Máximo 50 caracteres';
    if (!RE_NOMBRE.test(n)) return 'Solo letras, espacios, apóstrofo, guion y punto';
    return '';
}

/** Valida edad: entero finito en [0, 120]. */
function validarEdad(v) {
    const s = String(v ?? '').trim();
    if (s === '') return 'La edad es obligatoria';
    if (!/^-?\d+$/.test(s)) return 'Debe ser un entero';
    const n = Number(s);
    if (!Number.isFinite(n)) return 'Edad inválida';
    if (!Number.isInteger(n)) return 'Sin decimales';
    if (n < 0) return 'No puede ser negativa';
    if (n > 120) return 'Máximo 120';
    return '';
}

/** Valida área contra whitelist. */
function validarArea(v) {
    if (!v) return 'Seleccioná un área';
    if (!AREAS_VALIDAS.includes(v)) return 'Área inválida';
    return '';
}

/** Verifica que el paciente no esté ya cargado (mismo nombre+edad+área). */
function validarDuplicado(nombre, edad, area) {
    const dup = pacientes.some((p) =>
        p.nombre.toLowerCase() === nombre.toLowerCase() &&
        p.edad === Number(edad) &&
        p.area === area
    );
    return dup ? 'Ya existe un paciente idéntico cargado' : '';
}

/** Frena el alta si se alcanzó el tope de pacientes. */
function validarLimite() {
    return pacientes.length >= MAX_PACIENTES ? `Límite de ${MAX_PACIENTES} pacientes alcanzado` : '';
}

// === Helpers de UI (errores y mensajes) ===

/** Pinta un mensaje de error debajo de un campo, ubicado por su id. */
function setFieldError(targetId, msg) {
    const el = document.querySelector(`.error-msg[data-error-for="${targetId}"]`);
    if (el) el.textContent = msg;
}

/** Limpia todos los errores de un formulario antes de revalidar. */
function clearFieldErrors(form) {
    form.querySelectorAll('.error-msg').forEach((s) => (s.textContent = ''));
    form.querySelectorAll('input, select').forEach((i) => i.classList.remove('invalid'));
}

/** Redibuja la lista completa de pacientes con HTML escapado. */
function renderLista() {
    listaEl.innerHTML = '';
    pacientes.forEach((p) => {
        const li = document.createElement('li');
        li.className = `metodo-${p.metodo}`;
        li.innerHTML = `
            <div class="nombre">${escapeHtml(p.nombre)}</div>
            <div class="detalle">Edad: ${escapeHtml(p.edad)} · Área: ${escapeHtml(p.area)}</div>
            <span class="metodo-tag">Método ${p.metodo}: ${escapeHtml(p.metodoNombre)}</span>
        `;
        listaEl.appendChild(li);
    });
    totalEl.textContent = pacientes.length;
}

/** Muestra un mensaje global (success/error) que se oculta solo a los 3.5s. */
function showMessage(elementId, text, type) {
    const el = document.getElementById(elementId);
    el.textContent = text;
    el.className = `message show ${type}`;
    clearTimeout(el._timer);
    el._timer = setTimeout(() => el.classList.remove('show'), 3500);
}

// === Lógica de alta ===

/**
 * Pipeline único de alta usado por los 3 formularios:
 *  1. Limpia errores previos.
 *  2. Valida cada campo.
 *  3. Verifica límite y duplicados.
 *  4. Si todo está OK, agrega al array, redibuja la lista y resetea el form.
 */
function procesarAlta({ form, nombre, edad, area, metodo, metodoNombre, msgId, prefijoErrores }) {
    clearFieldErrors(form);

    const errNombre = validarNombre(nombre);
    const errEdad = validarEdad(edad);
    const errArea = validarArea(area);

    if (errNombre || errEdad || errArea) {
        if (errNombre) setFieldError(prefijoErrores.nombre, errNombre);
        if (errEdad) setFieldError(prefijoErrores.edad, errEdad);
        if (errArea) setFieldError(prefijoErrores.area, errArea);
        showMessage(msgId, 'Revisá los campos marcados', 'error');
        return false;
    }

    const nombreNorm = normalizarNombre(nombre);
    const edadNum = Number(edad);

    const errLim = validarLimite();
    if (errLim) {
        showMessage(msgId, errLim, 'error');
        return false;
    }

    const errDup = validarDuplicado(nombreNorm, edadNum, area);
    if (errDup) {
        showMessage(msgId, errDup, 'error');
        return false;
    }

    pacientes.push({ nombre: nombreNorm, edad: edadNum, area, metodo, metodoNombre });
    renderLista();
    showMessage(msgId, `Paciente "${nombreNorm}" registrado.`, 'success');
    form.reset();
    return true;
}

// === MÉTODO 1: getElementById ===
// Se obtiene cada campo por su id explícito.
const formId = document.getElementById('form-id');
formId.addEventListener('submit', (e) => {
    e.preventDefault();
    procesarAlta({
        form: formId,
        nombre: document.getElementById('nombre-id').value,
        edad: document.getElementById('edad-id').value,
        area: document.getElementById('area-id').value,
        metodo: 1,
        metodoNombre: 'getElementById',
        msgId: 'msg-id',
        prefijoErrores: { nombre: 'nombre-id', edad: 'edad-id', area: 'area-id' }
    });
});

// === MÉTODO 2: querySelector ===
// Se obtiene cada campo con un selector CSS dentro del formulario.
const formQs = document.getElementById('form-qs');
formQs.addEventListener('submit', (e) => {
    e.preventDefault();
    procesarAlta({
        form: formQs,
        nombre: formQs.querySelector('input[name="nombre"]').value,
        edad: formQs.querySelector('input[name="edad"]').value,
        area: formQs.querySelector('select[name="area"]').value,
        metodo: 2,
        metodoNombre: 'querySelector',
        msgId: 'msg-qs',
        prefijoErrores: { nombre: 'qs-nombre', edad: 'qs-edad', area: 'qs-area' }
    });
});

// === MÉTODO 3: FormData ===
// Se leen TODOS los campos del form en una sola operación, iterando entries().
const formFd = document.getElementById('form-fd');
formFd.addEventListener('submit', (e) => {
    e.preventDefault();

    const fd = new FormData(formFd);
    const datos = {};
    for (const [campo, valor] of fd.entries()) {
        datos[campo] = typeof valor === 'string' ? valor : '';
    }

    procesarAlta({
        form: formFd,
        nombre: datos.nombre,
        edad: datos.edad,
        area: datos.area,
        metodo: 3,
        metodoNombre: 'FormData',
        msgId: 'msg-fd',
        prefijoErrores: { nombre: 'fd-nombre', edad: 'fd-edad', area: 'fd-area' }
    });
});

// === Validación en vivo ===
// Cada vez que el usuario sale de un campo (blur), se valida solo ese campo
// y se actualiza el mensaje y el borde rojo. Funciona para los 3 forms.
function bindLiveValidation(form, mapping) {
    form.querySelectorAll('input, select').forEach((input) => {
        input.addEventListener('blur', () => {
            const valor = input.value;
            const tipo = mapping[input.name || input.id];
            if (!tipo) return;

            let err = '';
            if (tipo === 'nombre') err = validarNombre(valor);
            else if (tipo === 'edad') err = validarEdad(valor);
            else if (tipo === 'area') err = validarArea(valor);

            const errorTargetId = input.id || `${form.id.replace('form-', '')}-${input.name}`;
            setFieldError(errorTargetId, err);
            input.classList.toggle('invalid', !!err);
        });
    });
}

bindLiveValidation(formId, { 'nombre-id': 'nombre', 'edad-id': 'edad', 'area-id': 'area' });
bindLiveValidation(formQs, { nombre: 'nombre', edad: 'edad', area: 'area' });
bindLiveValidation(formFd, { nombre: 'nombre', edad: 'edad', area: 'area' });
