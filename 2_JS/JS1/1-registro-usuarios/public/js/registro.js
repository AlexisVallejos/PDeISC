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
// Este bloque concentra todos los valores "de negocio" para evitar
// "números mágicos" dentro de la lógica.

const AREAS_VALIDAS = ['Clínica', 'Pediatría', 'Cardiología', 'Traumatología'];
const RE_NOMBRE = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s'.-]{2,50}$/;
const RE_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const RE_TEL_AR = /^(?:\+?54)?(?:9)?\d{10}$/;
const MAX_PACIENTES = 500;

// Array global donde se guardan todos los pacientes registrados.
// Es el "estado" principal de la UI.
const pacientes = [];

// Referencias al DOM que se reutilizan.
// Guardarlas evita consultar el DOM repetidamente.
const listaEl = document.getElementById('lista-pacientes');
const totalEl = document.getElementById('total-pacientes');
const AREA_CLASS = {
    'Clínica': 'area-clinica',
    'Pediatría': 'area-pediatria',
    'Cardiología': 'area-cardiologia',
    'Traumatología': 'area-traumatologia'
};

// === Utilidades ===
// Helpers pequeños que simplifican validaciones/render.

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

/** Devuelve identificador normalizado (solo dígitos). */
function normalizarDni(v) {
    return String(v ?? '').replace(/\D/g, '').trim();
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

function validarFechaNac(v) {
    if (!v) return 'La fecha de nacimiento es obligatoria';
    if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return 'Fecha inválida';
    const f = new Date(v + 'T00:00:00');
    if (isNaN(f.getTime())) return 'Fecha inválida';
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    if (f > hoy) return 'No puede ser futura';
    return '';
}

function validarTelefono(v) {
    const tel = String(v ?? '').replace(/[^\d+]/g, '').trim();
    if (!tel) return 'El teléfono es obligatorio';
    if (!RE_TEL_AR.test(tel)) return 'Ingresá un teléfono argentino válido';
    return '';
}

function validarMail(v) {
    const m = String(v ?? '').trim().toLowerCase();
    if (!m) return 'El email es obligatorio';
    if (m.length > 80) return 'Máximo 80 caracteres';
    if (!RE_EMAIL.test(m)) return 'Ingresá un email válido';
    return '';
}

function calcularTextoEdad(edad, fechaNac) {
    // Si la edad es mayor a 0 mostramos en años directamente.
    const n = Number(edad);
    if (n !== 0 || !fechaNac) return `${n} años`;
    // Si la edad es 0, calculamos meses para bebés.
    const f = new Date(fechaNac + 'T00:00:00');
    if (isNaN(f.getTime())) return '0 años';
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    f.setHours(0, 0, 0, 0);
    let meses = (hoy.getFullYear() - f.getFullYear()) * 12 + (hoy.getMonth() - f.getMonth());
    if (hoy.getDate() < f.getDate()) meses--;
    if (meses < 0) meses = 0;
    if (meses === 0) return '0 meses (recién nacido)';
    return `${meses} ${meses === 1 ? 'mes' : 'meses'}`;
}

/** Valida número de trámite o CUIT: solo números, largo 11. */
function validarDni(v) {
    const dni = normalizarDni(v);
    if (!dni) return 'El N° de trámite o CUIT es obligatorio';
    if (!/^\d+$/.test(dni)) return 'Debe tener solo números';
    if (dni.length !== 11) return 'Debe tener 11 dígitos';
    return '';
}

/** Valida área contra whitelist. */
function validarArea(v) {
    if (!v) return 'Seleccioná un área';
    if (!AREAS_VALIDAS.includes(v)) return 'Área inválida';
    return '';
}

/** Verifica que el DNI no esté repetido en el registro. */
function validarDniUnico(dni) {
    const duplicado = pacientes.some((p) => p.dni === dni);
    return duplicado ? 'Ese N° de trámite/CUIT ya está registrado' : '';
}

/** Frena el alta si se alcanzó el tope de pacientes. */
function validarLimite() {
    return pacientes.length >= MAX_PACIENTES ? `Límite de ${MAX_PACIENTES} pacientes alcanzado` : '';
}

// === Helpers de UI (errores y mensajes) ===
// Centralizan cómo se muestran errores/mensajes en pantalla.

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
    // Siempre renderizamos desde cero para mantener consistencia visual.
    listaEl.innerHTML = '';
    pacientes.forEach((p) => {
        const li = document.createElement('li');
        const areaClass = AREA_CLASS[p.area] || '';
        const edadTexto = calcularTextoEdad(p.edad, p.fechaNacimiento);
        li.className = areaClass;
        li.innerHTML = `
            <div class="nombre">${escapeHtml(p.nombre)}</div>
            <div class="detalle">N° trámite/CUIT: ${escapeHtml(p.dni)} · Edad: ${escapeHtml(edadTexto)}</div>
            <span class="area-tag">${escapeHtml(p.area)}</span>
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
// Punto único de registro: los 3 formularios llaman a esta función.

/**
 * Pipeline único de alta usado por los 3 formularios:
 *  1. Limpia errores previos.
 *  2. Valida cada campo.
 *  3. Verifica límite y duplicados.
 *  4. Si todo está OK, agrega al array, redibuja la lista y resetea el form.
 */
function procesarAlta({ form, nombre, dni, fechaNacimiento, edad, telefono, mail, area, metodo, metodoNombre, msgId, prefijoErrores }) {
    clearFieldErrors(form);

    // 1) Validación campo por campo
    const errNombre = validarNombre(nombre);
    const errDni = validarDni(dni);
    const errFecha = validarFechaNac(fechaNacimiento);
    const errEdad = validarEdad(edad);
    const errTel = validarTelefono(telefono);
    const errMail = validarMail(mail);
    const errArea = validarArea(area);

    // 2) Si hay errores, se marcan visualmente y se frena el alta
    if (errNombre || errDni || errFecha || errEdad || errTel || errMail || errArea) {
        if (errNombre) setFieldError(prefijoErrores.nombre, errNombre);
        if (errDni) setFieldError(prefijoErrores.dni, errDni);
        if (errFecha) setFieldError(prefijoErrores.fechaNacimiento, errFecha);
        if (errEdad) setFieldError(prefijoErrores.edad, errEdad);
        if (errTel) setFieldError(prefijoErrores.telefono, errTel);
        if (errMail) setFieldError(prefijoErrores.mail, errMail);
        if (errArea) setFieldError(prefijoErrores.area, errArea);
        showMessage(msgId, 'Revisá los campos marcados', 'error');
        return false;
    }

    const nombreNorm = normalizarNombre(nombre);
    const dniNorm = normalizarDni(dni);
    const edadNum = Number(edad);

    // 3) Validaciones globales del estado (límite y duplicados)
    const errLim = validarLimite();
    if (errLim) {
        showMessage(msgId, errLim, 'error');
        return false;
    }

    const errDniRep = validarDniUnico(dniNorm);
    if (errDniRep) {
        showMessage(msgId, errDniRep, 'error');
        return false;
    }

    // 4) Guardado en memoria + render + mensaje de éxito
    pacientes.push({
        nombre: nombreNorm,
        dni: dniNorm,
        fechaNacimiento: String(fechaNacimiento),
        edad: edadNum,
        telefono: String(telefono).trim(),
        mail: String(mail).trim().toLowerCase(),
        area,
        metodo,
        metodoNombre
    });
    renderLista();
    showMessage(msgId, `Paciente "${nombreNorm}" registrado.`, 'success');
    form.reset();
    return true;
}

// === MÉTODO 1: getElementById ===
// Se demuestra lectura explícita de cada campo por su ID.
// Se obtiene cada campo por su id explícito.
const formId = document.getElementById('form-id');
formId.addEventListener('submit', (e) => {
    e.preventDefault();
    procesarAlta({
        form: formId,
        nombre: document.getElementById('nombre-id').value,
        dni: document.getElementById('dni-id').value,
        fechaNacimiento: document.getElementById('fecha-id').value,
        edad: document.getElementById('edad-id').value,
        telefono: document.getElementById('telefono-id').value,
        mail: document.getElementById('mail-id').value,
        area: document.getElementById('area-id').value,
        metodo: 1,
        metodoNombre: 'getElementById',
        msgId: 'msg-id',
        prefijoErrores: { nombre: 'nombre-id', dni: 'dni-id', fechaNacimiento: 'fecha-id', edad: 'edad-id', telefono: 'telefono-id', mail: 'mail-id', area: 'area-id' }
    });
});

// === MÉTODO 2: querySelector ===
// Se demuestra lectura por selectores CSS dentro del form.
// Se obtiene cada campo con un selector CSS dentro del formulario.
const formQs = document.getElementById('form-qs');
formQs.addEventListener('submit', (e) => {
    e.preventDefault();
    procesarAlta({
        form: formQs,
        nombre: formQs.querySelector('input[name="nombre"]').value,
        dni: formQs.querySelector('input[name="dni"]').value,
        fechaNacimiento: formQs.querySelector('input[name="fechaNacimiento"]').value,
        edad: formQs.querySelector('input[name="edad"]').value,
        telefono: formQs.querySelector('input[name="telefono"]').value,
        mail: formQs.querySelector('input[name="mail"]').value,
        area: formQs.querySelector('select[name="area"]').value,
        metodo: 2,
        metodoNombre: 'querySelector',
        msgId: 'msg-qs',
        prefijoErrores: { nombre: 'qs-nombre', dni: 'qs-dni', fechaNacimiento: 'qs-fechaNacimiento', edad: 'qs-edad', telefono: 'qs-telefono', mail: 'qs-mail', area: 'qs-area' }
    });
});

// === MÉTODO 3: FormData ===
// Se demuestra lectura masiva de campos con FormData.
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
        dni: datos.dni,
        fechaNacimiento: datos.fechaNacimiento,
        edad: datos.edad,
        telefono: datos.telefono,
        mail: datos.mail,
        area: datos.area,
        metodo: 3,
        metodoNombre: 'FormData',
        msgId: 'msg-fd',
        prefijoErrores: { nombre: 'fd-nombre', dni: 'fd-dni', fechaNacimiento: 'fd-fechaNacimiento', edad: 'fd-edad', telefono: 'fd-telefono', mail: 'fd-mail', area: 'fd-area' }
    });
});

// === Validación en vivo ===
// Cada vez que el usuario sale de un campo (blur), se valida solo ese campo
// y se actualiza el mensaje y el borde rojo. Funciona para los 3 forms.
function bindLiveValidation(form, mapping) {
    // mapping define qué validador corresponde a cada input/select.
    form.querySelectorAll('input, select').forEach((input) => {
        input.addEventListener('blur', () => {
            const valor = input.value;
            const tipo = mapping[input.name || input.id];
            if (!tipo) return;

            let err = '';
            if (tipo === 'nombre') err = validarNombre(valor);
            else if (tipo === 'dni') err = validarDni(valor);
            else if (tipo === 'fechaNacimiento') err = validarFechaNac(valor);
            else if (tipo === 'edad') err = validarEdad(valor);
            else if (tipo === 'telefono') err = validarTelefono(valor);
            else if (tipo === 'mail') err = validarMail(valor);
            else if (tipo === 'area') err = validarArea(valor);

            const errorTargetId = input.id || `${form.id.replace('form-', '')}-${input.name}`;
            setFieldError(errorTargetId, err);
            input.classList.toggle('invalid', !!err);
        });
    });
}

bindLiveValidation(formId, { 'nombre-id': 'nombre', 'dni-id': 'dni', 'fecha-id': 'fechaNacimiento', 'edad-id': 'edad', 'telefono-id': 'telefono', 'mail-id': 'mail', 'area-id': 'area' });
bindLiveValidation(formQs, { nombre: 'nombre', dni: 'dni', fechaNacimiento: 'fechaNacimiento', edad: 'edad', telefono: 'telefono', mail: 'mail', area: 'area' });
bindLiveValidation(formFd, { nombre: 'nombre', dni: 'dni', fechaNacimiento: 'fechaNacimiento', edad: 'edad', telefono: 'telefono', mail: 'mail', area: 'area' });
