/**
 * Proyecto 3 — Almacén de Personas con localStorage.
 *
 * Qué hace:
 *  - Permite cargar personas con 12 datos (nombre, apellido, edad, fecha de
 *    nacimiento, sexo, documento, estado civil, nacionalidad, teléfono,
 *    mail, si tiene hijos y, en su caso, cantidad).
 *  - Persiste el array completo en `localStorage` bajo STORAGE_KEY, así
 *    los datos sobreviven a recargas y reinicios del navegador.
 *  - Muestra dos vistas en vivo: chips con los nombres completos y un
 *    detalle por persona con botón "Eliminar".
 *
 * Validaciones (lado cliente):
 *  - 12 validadores individuales (regex + rangos + whitelists).
 *  - Validación campo por campo en `blur` y completa en submit.
 *  - escapeHtml en TODO render para prevenir XSS.
 *  - try/catch en lectura/escritura de localStorage; rollback si falla.
 *  - Filtro `esPersonaValida` al cargar para descartar datos corruptos.
 */

// === Constantes de configuración ===

const STORAGE_KEY = 'almacen-personas';
const MAX_PERSONAS = 1000;

// Whitelists para los <select>: solo se aceptan valores conocidos.
const SEXOS_VALIDOS = ['Masculino', 'Femenino'];
const ESTADOS_VALIDOS = ['Soltero/a', 'Casado/a', 'Divorciado/a', 'Viudo/a', 'Concubinato'];
const TIENE_HIJOS_VALIDOS = ['Si', 'No'];

// Regex usadas por los validadores de texto/mail/dígitos.
const RE_SOLO_LETRAS = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s'.-]+$/;
const RE_MAIL = /^[^\s@<>"']{1,64}@[^\s@<>"']{1,253}\.[^\s@<>"']{2,24}$/;
const RE_SOLO_DIGITOS = /^\d+$/;

// Referencias al DOM que se reutilizan.
const formEl = document.getElementById('form-persona');
const formMsgEl = document.getElementById('form-msg');
const listaNombresEl = document.getElementById('lista-nombres');
const listaDetalleEl = document.getElementById('lista-detalle');
const totalEl = document.getElementById('total');
const btnVaciar = document.getElementById('btn-vaciar');
const tieneHijosSel = document.getElementById('tiene-hijos');
const cantidadHijosField = document.getElementById('cantidad-hijos-field');
const cantidadHijosInput = cantidadHijosField.querySelector('input');

// Estado en memoria: se hidrata desde localStorage al cargar la página.
let personas = cargarDeLocalStorage();
renderTodo();

// === Utilidades ===

/** Escape HTML para prevenir XSS al renderizar texto del usuario. */
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

/** Verifica si un objeto leído del storage tiene la forma mínima esperada. */
function esPersonaValida(p) {
    return p && typeof p === 'object'
        && typeof p.nombre === 'string'
        && typeof p.apellido === 'string'
        && typeof p.documento === 'string'
        && Number.isFinite(p.edad);
}

// === Persistencia (localStorage) ===

/** Lee el array de personas del storage. Resiste storage vacío o JSON corrupto. */
function cargarDeLocalStorage() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        const data = JSON.parse(raw);
        if (!Array.isArray(data)) return [];
        return data.filter(esPersonaValida);
    } catch {
        return [];
    }
}

/** Persiste el array completo. Devuelve true si tuvo éxito. */
function guardarEnLocalStorage() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(personas));
        return true;
    } catch (err) {
        showFormMessage('No se pudo guardar (¿almacenamiento lleno o bloqueado?).', 'error');
        return false;
    }
}

// === UI feedback (mensajes y errores por campo) ===

/** Mensaje global success/error que se oculta solo a los 3.5s. */
function showFormMessage(texto, tipo) {
    formMsgEl.textContent = texto;
    formMsgEl.className = `message show ${tipo}`;
    clearTimeout(formMsgEl._timer);
    formMsgEl._timer = setTimeout(() => formMsgEl.classList.remove('show'), 3500);
}

/** Pinta el mensaje de error de un campo y lo marca con borde rojo. */
function setError(campo, mensaje) {
    const small = document.querySelector(`.error-msg[data-error="${campo}"]`);
    if (small) small.textContent = mensaje;
    const input = formEl.querySelector(`[name="${campo}"]`);
    if (input) {
        input.classList.add('invalid');
        input.classList.remove('valid');
    }
}

/** Limpia el error de un campo y lo marca como válido (verde). */
function limpiarError(campo) {
    const small = document.querySelector(`.error-msg[data-error="${campo}"]`);
    if (small) small.textContent = '';
    const input = formEl.querySelector(`[name="${campo}"]`);
    if (input) {
        input.classList.remove('invalid');
        input.classList.add('valid');
    }
}

/** Resetea todos los mensajes y bordes del formulario. */
function limpiarTodosLosErrores() {
    document.querySelectorAll('.error-msg').forEach((s) => (s.textContent = ''));
    formEl.querySelectorAll('input, select').forEach((i) => i.classList.remove('invalid', 'valid'));
}

// === Validadores individuales ===
// Cada uno devuelve '' si es OK o un mensaje de error legible.

/** Nombre: 2-40 chars, solo letras y signos comunes. */
function validarNombre(v) {
    const n = norm(v);
    if (!n) return 'Requerido';
    if (n.length < 2) return 'Mínimo 2 caracteres';
    if (n.length > 40) return 'Máximo 40 caracteres';
    if (!RE_SOLO_LETRAS.test(n)) return 'Solo letras y espacios';
    return '';
}

/** Apellido: mismas reglas que el nombre. */
function validarApellido(v) { return validarNombre(v); }

/** Fecha de nacimiento: ISO yyyy-mm-dd, no futura, no anterior a 1900. */
function validarFechaNac(v) {
    if (!v) return 'Requerida';
    if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return 'Formato inválido';
    const f = new Date(v + 'T00:00:00');
    if (isNaN(f.getTime())) return 'Fecha inválida';
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    if (f > hoy) return 'No puede ser futura';
    const minimo = new Date('1900-01-01');
    if (f < minimo) return 'Fecha demasiado antigua';
    return '';
}

/** Calcula la edad a partir de la fecha de nacimiento (años cumplidos hoy). */
function calcularEdadDesdeFecha(fechaStr) {
    const f = new Date(fechaStr + 'T00:00:00');
    if (isNaN(f.getTime())) return null;
    const hoy = new Date();
    let edad = hoy.getFullYear() - f.getFullYear();
    const m = hoy.getMonth() - f.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < f.getDate())) edad--;
    return edad;
}

/** Edad: entero 0-120, debe coincidir con la fecha de nacimiento (±1 año). */
function validarEdad(v, fechaNac) {
    const s = String(v ?? '').trim();
    if (s === '') return 'Requerida';
    if (!/^\d+$/.test(s)) return 'Entero positivo';
    const n = Number(s);
    if (!Number.isFinite(n) || !Number.isInteger(n)) return 'Edad inválida';
    if (n < 0) return 'No negativa';
    if (n > 120) return 'Máximo 120';
    if (fechaNac && validarFechaNac(fechaNac) === '') {
        const calc = calcularEdadDesdeFecha(fechaNac);
        if (calc !== null && Math.abs(calc - n) > 1) return `No coincide con la fecha (~${calc})`;
    }
    return '';
}

/** Sexo: solo "Masculino" o "Femenino". */
function validarSexo(v) {
    if (!SEXOS_VALIDOS.includes(v)) return 'Requerido';
    return '';
}

/** Documento: 7-8 dígitos, no todo ceros, único entre los registrados. */
function validarDocumento(v, ignorarDoc) {
    const s = String(v ?? '').trim();
    if (!s) return 'Requerido';
    if (!RE_SOLO_DIGITOS.test(s)) return 'Solo números';
    if (s.length < 7 || s.length > 8) return '7 u 8 dígitos';
    if (s === '0'.repeat(s.length)) return 'No puede ser todo ceros';
    const yaExiste = personas.some((p) => p.documento === s && p.documento !== ignorarDoc);
    if (yaExiste) return 'Documento ya registrado';
    return '';
}

/** Estado civil: debe estar en el whitelist. */
function validarEstadoCivil(v) {
    if (!ESTADOS_VALIDOS.includes(v)) return 'Requerido';
    return '';
}

/** Nacionalidad: 3-40 chars, solo letras y espacios. */
function validarNacionalidad(v) {
    const n = norm(v);
    if (!n) return 'Requerida';
    if (n.length < 3) return 'Mínimo 3 caracteres';
    if (n.length > 40) return 'Máximo 40 caracteres';
    if (!RE_SOLO_LETRAS.test(n)) return 'Solo letras y espacios';
    return '';
}

/** Teléfono: 6-15 dígitos (admite +, -, espacios y paréntesis). */
function validarTelefono(v) {
    const s = String(v ?? '').trim();
    if (!s) return 'Requerido';
    // Permite +, espacios, guiones y paréntesis pero quita para contar.
    if (!/^[\d\s\-+()]+$/.test(s)) return 'Caracteres inválidos';
    const limpio = s.replace(/[\s\-+()]/g, '');
    if (!RE_SOLO_DIGITOS.test(limpio)) return 'Solo dígitos (con +,-,())';
    if (limpio.length < 6 || limpio.length > 15) return 'Entre 6 y 15 dígitos';
    return '';
}

/** Mail: formato local@dominio.tld, máx. 80 chars, sin caracteres peligrosos. */
function validarMail(v) {
    const s = String(v ?? '').trim();
    if (!s) return 'Requerido';
    if (s.length > 80) return 'Máximo 80 caracteres';
    if (!RE_MAIL.test(s)) return 'Formato inválido';
    return '';
}

/** Tiene hijos: solo "Si" o "No". */
function validarTieneHijos(v) {
    if (!TIENE_HIJOS_VALIDOS.includes(v)) return 'Requerido';
    return '';
}

/** Cantidad de hijos: solo se valida si tieneHijos === "Si". Entero 1-20. */
function validarCantidadHijos(tiene, cantidad) {
    if (tiene !== 'Si') return '';
    const s = String(cantidad ?? '').trim();
    if (s === '') return 'Requerida';
    if (!/^\d+$/.test(s)) return 'Entero positivo';
    const n = Number(s);
    if (!Number.isFinite(n) || !Number.isInteger(n)) return 'Inválida';
    if (n < 1) return 'Mínimo 1';
    if (n > 20) return 'Máximo 20';
    return '';
}

/** Corre los 12 validadores y devuelve { campo: msg } con los errores. */
function validarFormulario(datos) {
    const errores = {};
    const e1 = validarNombre(datos.nombre); if (e1) errores.nombre = e1;
    const e2 = validarApellido(datos.apellido); if (e2) errores.apellido = e2;
    const e4 = validarFechaNac(datos.fechaNacimiento); if (e4) errores.fechaNacimiento = e4;
    const e3 = validarEdad(datos.edad, datos.fechaNacimiento); if (e3) errores.edad = e3;
    const e5 = validarSexo(datos.sexo); if (e5) errores.sexo = e5;
    const e6 = validarDocumento(datos.documento); if (e6) errores.documento = e6;
    const e7 = validarEstadoCivil(datos.estadoCivil); if (e7) errores.estadoCivil = e7;
    const e8 = validarNacionalidad(datos.nacionalidad); if (e8) errores.nacionalidad = e8;
    const e9 = validarTelefono(datos.telefono); if (e9) errores.telefono = e9;
    const e10 = validarMail(datos.mail); if (e10) errores.mail = e10;
    const e11 = validarTieneHijos(datos.tieneHijos); if (e11) errores.tieneHijos = e11;
    const e12 = validarCantidadHijos(datos.tieneHijos, datos.cantidadHijos); if (e12) errores.cantidadHijos = e12;
    return errores;
}

// === Lectura del formulario ===

/** Lee TODOS los campos con FormData y devuelve un objeto normalizado. */
function leerFormulario() {
    const fd = new FormData(formEl);
    return {
        nombre: norm(fd.get('nombre')),
        apellido: norm(fd.get('apellido')),
        edad: String(fd.get('edad') ?? '').trim(),
        fechaNacimiento: String(fd.get('fechaNacimiento') ?? ''),
        sexo: String(fd.get('sexo') ?? ''),
        documento: String(fd.get('documento') ?? '').trim(),
        estadoCivil: String(fd.get('estadoCivil') ?? ''),
        nacionalidad: norm(fd.get('nacionalidad')),
        telefono: String(fd.get('telefono') ?? '').trim(),
        mail: String(fd.get('mail') ?? '').trim(),
        tieneHijos: String(fd.get('tieneHijos') ?? ''),
        cantidadHijos: String(fd.get('cantidadHijos') ?? '').trim()
    };
}

// === UI: mostrar/ocultar cantidad de hijos según selección ===

tieneHijosSel.addEventListener('change', () => {
    if (tieneHijosSel.value === 'Si') {
        cantidadHijosField.style.display = 'flex';
    } else {
        cantidadHijosField.style.display = 'none';
        cantidadHijosInput.value = '';
        limpiarError('cantidadHijos');
        cantidadHijosInput.classList.remove('invalid', 'valid');
    }
});

// === Validación en vivo ===
// Cada input se valida al perder el foco; el error se borra al volver a escribir.
formEl.querySelectorAll('input, select').forEach((input) => {
    input.addEventListener('blur', () => {
        const datos = leerFormulario();
        const errores = validarFormulario(datos);
        const campo = input.name;
        if (!campo) return;
        if (errores[campo]) {
            setError(campo, errores[campo]);
        } else if (datos[campo] !== '') {
            limpiarError(campo);
        }
    });

    // Limpia el mensaje al volver a tocar el campo.
    input.addEventListener('input', () => {
        const campo = input.name;
        if (!campo) return;
        const small = document.querySelector(`.error-msg[data-error="${campo}"]`);
        if (small) small.textContent = '';
        input.classList.remove('invalid');
    });
});

// === Submit del formulario ===
// 1) chequea el tope global, 2) lee y valida, 3) construye la persona final
// con tipos correctos, 4) la persiste en localStorage (con rollback si falla).
formEl.addEventListener('submit', (e) => {
    e.preventDefault();
    limpiarTodosLosErrores();

    if (personas.length >= MAX_PERSONAS) {
        showFormMessage(`Límite de ${MAX_PERSONAS} personas alcanzado.`, 'error');
        return;
    }

    const datos = leerFormulario();
    const errores = validarFormulario(datos);

    if (Object.keys(errores).length > 0) {
        for (const [campo, msg] of Object.entries(errores)) setError(campo, msg);
        showFormMessage('Hay campos con errores. Revisalos antes de guardar.', 'error');
        return;
    }

    const personaFinal = {
        nombre: datos.nombre,
        apellido: datos.apellido,
        edad: Number(datos.edad),
        fechaNacimiento: datos.fechaNacimiento,
        sexo: datos.sexo,
        documento: datos.documento,
        estadoCivil: datos.estadoCivil,
        nacionalidad: datos.nacionalidad,
        telefono: datos.telefono,
        mail: datos.mail,
        tieneHijos: datos.tieneHijos,
        cantidadHijos: datos.tieneHijos === 'Si' ? Number(datos.cantidadHijos) : 0,
        registradoEn: new Date().toISOString()
    };

    personas.push(personaFinal);
    if (!guardarEnLocalStorage()) {
        // Rollback si no se pudo persistir.
        personas.pop();
        return;
    }
    renderTodo();

    showFormMessage(`✓ ${personaFinal.nombre} ${personaFinal.apellido} guardado correctamente.`, 'success');
    formEl.reset();
    cantidadHijosField.style.display = 'none';
});

// === Vaciar almacén ===
// Pide confirmación al usuario y borra todo. Si falla el storage, revierte.
btnVaciar.addEventListener('click', () => {
    if (personas.length === 0) {
        showFormMessage('El almacén ya está vacío.', 'error');
        return;
    }
    if (!confirm(`¿Eliminar las ${personas.length} personas almacenadas?`)) return;
    const backup = personas.slice();
    personas = [];
    if (!guardarEnLocalStorage()) {
        personas = backup;
        return;
    }
    renderTodo();
    showFormMessage('Almacén vaciado.', 'success');
});

// === Eliminar individual ===

/** Elimina una persona por documento (clave única) y persiste el cambio. */
function eliminarPersona(documento) {
    const backup = personas.slice();
    personas = personas.filter((p) => p.documento !== documento);
    if (!guardarEnLocalStorage()) {
        personas = backup;
        return;
    }
    renderTodo();
}

// === Render principal ===
// Redibuja: contador total, chips de nombres y tarjetas de detalle.
// Todo el texto se inserta con escapeHtml para prevenir XSS.
function renderTodo() {
    totalEl.textContent = personas.length;

    listaNombresEl.innerHTML = '';
    personas.forEach((p) => {
        const li = document.createElement('li');
        li.textContent = `${p.nombre} ${p.apellido}`;
        listaNombresEl.appendChild(li);
    });

    listaDetalleEl.innerHTML = '';
    personas.forEach((p) => {
        const div = document.createElement('div');
        div.className = 'persona';
        const hijosTxt = p.tieneHijos === 'Si' ? String(p.cantidadHijos) : 'No';
        div.innerHTML = `
            <button class="btn-eliminar" data-doc="${escapeHtml(p.documento)}">Eliminar</button>
            <div class="nombre-completo">${escapeHtml(p.nombre)} ${escapeHtml(p.apellido)}</div>
            <div class="info">
                <span>DNI:</span> ${escapeHtml(p.documento)} ·
                <span>Edad:</span> ${escapeHtml(p.edad)} ·
                <span>Sexo:</span> ${escapeHtml(p.sexo)}<br>
                <span>Nac.:</span> ${escapeHtml(p.fechaNacimiento)} ·
                <span>Nacionalidad:</span> ${escapeHtml(p.nacionalidad)}<br>
                <span>Estado civil:</span> ${escapeHtml(p.estadoCivil)} ·
                <span>Hijos:</span> ${escapeHtml(hijosTxt)}<br>
                <span>Tel:</span> ${escapeHtml(p.telefono)} ·
                <span>Mail:</span> ${escapeHtml(p.mail)}
            </div>
        `;
        listaDetalleEl.appendChild(div);
    });

    listaDetalleEl.querySelectorAll('.btn-eliminar').forEach((btn) => {
        btn.addEventListener('click', () => eliminarPersona(btn.dataset.doc));
    });
}
