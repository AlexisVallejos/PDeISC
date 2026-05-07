const STORAGE_KEY = "admision-pacientes";
const MAX_PERSONAS = 1000;

const SEXOS_VALIDOS = ["Masculino", "Femenino", "Otro"];
const ESTADOS_VALIDOS = ["Soltero/a", "Casado/a", "Divorciado/a", "Viudo/a", "Concubinato"];
const TIENE_HIJOS_VALIDOS = ["Si", "No"];
const PROVINCIAS_VALIDAS = ["Buenos Aires", "CABA", "Córdoba", "Santa Fe", "Mendoza", "Otra"];
const OBRAS_VALIDAS = ["IOMA", "PAMI", "OSDE", "Swiss Medical", "Galeno", "Sin cobertura"];
const GRUPOS_VALIDOS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "No sabe"];
const PARENTESCOS_VALIDOS = ["Madre", "Padre", "Hermano/a", "Hijo/a", "Pareja", "Tutor/a", "Otro"];

const RE_SOLO_LETRAS = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s'.-]+$/;
const RE_TRAMITE_CUIT = /^\d{11}$/;
const RE_EMAIL_BASE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const RE_TEL_AR = /^(?:\+?54)?(?:9)?\d{10}$/;
const RE_AFILIADO = /^[A-Za-z0-9\-\/]{4,20}$/;

const formEl = document.getElementById("form-persona");
const formMsgEl = document.getElementById("form-msg");
const listaNombresEl = document.getElementById("lista-nombres");
const listaDetalleEl = document.getElementById("lista-detalle");
const totalEl = document.getElementById("total");
const btnVaciar = document.getElementById("btn-vaciar");
const submitBtn = formEl.querySelector('button[type="submit"]');
const tieneHijosSel = document.getElementById("tiene-hijos");
const cantidadHijosField = document.getElementById("cantidad-hijos-field");
const cantidadHijosInput = formEl.querySelector('[name="cantidadHijos"]');
const fechaNacimientoInput = formEl.querySelector('[name="fechaNacimiento"]');
const edadInput = formEl.querySelector('[name="edad"]');

let personas = cargarDeLocalStorage();
renderTodo();
actualizarEstadoSubmit();

function escapeHtml(str) {
    return String(str ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function norm(v) {
    return String(v ?? "").trim().replace(/\s+/g, " ");
}

function normalizarDni(v) {
    return String(v ?? "").replace(/\D/g, "").trim();
}

function normalizarTelefonoArg(v) {
    return String(v ?? "").replace(/[^\d+]/g, "").trim();
}

function normalizarEmail(v) {
    return String(v ?? "").trim().toLowerCase();
}

function esPersonaValida(p) {
    return p && typeof p === "object" && typeof p.nombre === "string" && typeof p.documento === "string";
}

function cargarDeLocalStorage() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        const arr = JSON.parse(raw);
        if (!Array.isArray(arr)) return [];
        const filtrados = arr.filter(esPersonaValida);
        const vistos = new Set();
        return filtrados.filter((p) => {
            const dni = normalizarDni(p.documento);
            if (!dni || vistos.has(dni)) return false;
            vistos.add(dni);
            p.documento = dni;
            return true;
        });
    } catch {
        return [];
    }
}

function guardarEnLocalStorage() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(personas));
        return true;
    } catch {
        showFormMessage("No se pudo guardar la ficha en este navegador.", "error");
        return false;
    }
}

function showFormMessage(texto, tipo) {
    formMsgEl.textContent = texto;
    formMsgEl.className = `message show ${tipo}`;
    clearTimeout(formMsgEl._timer);
    formMsgEl._timer = setTimeout(() => formMsgEl.classList.remove("show"), 4000);
}

function setError(campo, mensaje) {
    const small = document.querySelector(`.error-msg[data-error="${campo}"]`);
    if (small) small.textContent = mensaje;
    const input = formEl.querySelector(`[name="${campo}"]`);
    if (input) {
        input.classList.add("invalid");
        input.classList.remove("valid");
    }
}

function limpiarError(campo) {
    const small = document.querySelector(`.error-msg[data-error="${campo}"]`);
    if (small) small.textContent = "";
    const input = formEl.querySelector(`[name="${campo}"]`);
    if (input) {
        input.classList.remove("invalid");
        if (input.type !== "checkbox") input.classList.add("valid");
    }
}

function limpiarTodosLosErrores() {
    document.querySelectorAll(".error-msg").forEach((s) => (s.textContent = ""));
    formEl.querySelectorAll("input, select").forEach((i) => i.classList.remove("invalid", "valid"));
}

function calcularEdadDesdeFecha(fechaStr) {
    const f = new Date(fechaStr + "T00:00:00");
    if (isNaN(f.getTime())) return null;
    const hoy = new Date();
    let edad = hoy.getFullYear() - f.getFullYear();
    const m = hoy.getMonth() - f.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < f.getDate())) edad--;
    return edad;
}

function formatearEdadConMeses(edad, fechaNacimiento) {
    const n = Number(edad);
    if (n !== 0) return String(n);
    const f = new Date(String(fechaNacimiento || "") + "T00:00:00");
    if (isNaN(f.getTime())) return "0";
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    f.setHours(0, 0, 0, 0);
    let meses = (hoy.getFullYear() - f.getFullYear()) * 12 + (hoy.getMonth() - f.getMonth());
    if (hoy.getDate() < f.getDate()) meses--;
    if (meses < 0) meses = 0;
    if (meses === 0) return "0 meses (recién nacido)";
    return `${meses} ${meses === 1 ? "mes" : "meses"}`;
}

function validarTexto(v, min, max, label) {
    const s = norm(v);
    if (!s) return `${label} es obligatorio`;
    if (s.length < min) return `${label}: mínimo ${min} caracteres`;
    if (s.length > max) return `${label}: máximo ${max} caracteres`;
    if (!RE_SOLO_LETRAS.test(s)) return `${label}: solo letras y espacios`;
    return "";
}

function validarNombre(v) { return validarTexto(v, 2, 40, "Nombre"); }
function validarApellido(v) { return validarTexto(v, 2, 40, "Apellido"); }
function validarCiudad(v) { return validarTexto(v, 2, 50, "Ciudad"); }
function validarNacionalidad(v) { return validarTexto(v, 3, 40, "Nacionalidad"); }

function validarFechaNac(v) {
    if (!v) return "Fecha de nacimiento obligatoria";
    if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return "Formato de fecha inválido";
    const f = new Date(v + "T00:00:00");
    if (isNaN(f.getTime())) return "Fecha inválida";
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    if (f > hoy) return "La fecha de nacimiento no puede ser futura";
    return "";
}

function validarEdad(v, fechaNac) {
    const s = String(v ?? "").trim();
    if (!s) return "Edad obligatoria";
    if (!/^\d+$/.test(s)) return "Edad: solo números";
    const n = Number(s);
    if (n < 0 || n > 120) return "Edad: entre 0 y 120";
    if (validarFechaNac(fechaNac) === "") {
        const calc = calcularEdadDesdeFecha(fechaNac);
        if (calc !== null && calc !== n) return `La edad no coincide con la fecha (${calc})`;
    }
    return "";
}

function validarSexo(v) { return SEXOS_VALIDOS.includes(v) ? "" : "Seleccioná un sexo"; }

function validarDni(v) {
    const dni = normalizarDni(v);
    if (!dni) return "N° de trámite/CUIT obligatorio";
    if (!RE_TRAMITE_CUIT.test(dni)) return "N° de trámite/CUIT: 11 dígitos";
    const rep = personas.some((p) => p.documento === dni);
    if (rep) return "N° de trámite/CUIT ya registrado";
    return "";
}

function validarEstadoCivil(v) { return ESTADOS_VALIDOS.includes(v) ? "" : "Seleccioná un estado civil"; }
function validarProvincia(v) { return PROVINCIAS_VALIDAS.includes(v) ? "" : "Seleccioná una provincia"; }
function validarObraSocial(v) { return OBRAS_VALIDAS.includes(v) ? "" : "Seleccioná una obra social"; }
function validarGrupo(v) { return GRUPOS_VALIDOS.includes(v) ? "" : "Seleccioná un grupo sanguíneo"; }
function validarParentesco(v) { return PARENTESCOS_VALIDOS.includes(v) ? "" : "Seleccioná un parentesco"; }
function validarTieneHijos(v) { return TIENE_HIJOS_VALIDOS.includes(v) ? "" : "Seleccioná una opción"; }

function validarDireccion(v) {
    const s = norm(v);
    if (!s) return "Dirección obligatoria";
    if (s.length < 4 || s.length > 100) return "Dirección: entre 4 y 100 caracteres";
    return "";
}

function validarTelefono(v) {
    const tel = normalizarTelefonoArg(v);
    if (!tel) return "Teléfono obligatorio";
    if (!RE_TEL_AR.test(tel)) return "Ingresá un teléfono argentino válido";
    return "";
}

function validarEmail(v) {
    const m = normalizarEmail(v);
    if (!m) return "Email obligatorio";
    if (m.length > 80) return "Email: máximo 80 caracteres";
    if (!RE_EMAIL_BASE.test(m)) return "Ingresá un email válido";

    const partes = m.split("@");
    if (partes.length !== 2) return "Ingresá un email válido";
    const dominio = partes[1];

    if (dominio === "gmail.com") return "";

    if (
        dominio.endsWith(".com") ||
        dominio.endsWith(".edu") ||
        dominio.endsWith(".org") ||
        dominio.endsWith(".gob") ||
        dominio.endsWith(".gov")
    ) {
        return "";
    }

    return "Dominio no permitido. Usá @gmail.com o dominios .com/.edu/.org/.gob/.gov";
}

function validarAfiliado(obra, nro) {
    const s = norm(nro);
    if (obra === "Sin cobertura") return "";
    if (!s) return "Número de afiliado obligatorio";
    if (!RE_AFILIADO.test(s)) return "Número de afiliado inválido";
    return "";
}

function validarTextoLibre(v, label) {
    const s = norm(v);
    if (!s) return `${label} es obligatorio`;
    if (s.length < 2 || s.length > 120) return `${label}: entre 2 y 120 caracteres`;
    return "";
}

function validarCantidadHijos(tiene, cantidad) {
    if (tiene !== "Si") return "";
    const s = String(cantidad ?? "").trim();
    if (!s) return "Cantidad de hijos obligatoria";
    if (!/^\d+$/.test(s)) return "Cantidad de hijos: solo números";
    const n = Number(s);
    if (n < 1 || n > 20) return "Cantidad de hijos: entre 1 y 20";
    return "";
}

function validarAceptaDatos(v) {
    return v ? "" : "Debés aceptar el almacenamiento de datos";
}

function leerFormulario() {
    const fd = new FormData(formEl);
    return {
        nombre: norm(fd.get("nombre")),
        apellido: norm(fd.get("apellido")),
        edad: String(fd.get("edad") ?? "").trim(),
        fechaNacimiento: String(fd.get("fechaNacimiento") ?? ""),
        sexo: String(fd.get("sexo") ?? ""),
        documento: normalizarDni(fd.get("documento")),
        estadoCivil: String(fd.get("estadoCivil") ?? ""),
        nacionalidad: norm(fd.get("nacionalidad")),
        telefono: normalizarTelefonoArg(fd.get("telefono")),
        mail: normalizarEmail(fd.get("mail")),
        direccion: norm(fd.get("direccion")),
        ciudad: norm(fd.get("ciudad")),
        provincia: String(fd.get("provincia") ?? ""),
        obraSocial: String(fd.get("obraSocial") ?? ""),
        numeroAfiliado: norm(fd.get("numeroAfiliado")),
        grupoSanguineo: String(fd.get("grupoSanguineo") ?? ""),
        alergias: norm(fd.get("alergias")),
        enfermedades: norm(fd.get("enfermedades")),
        medicacion: norm(fd.get("medicacion")),
        emergenciaNombre: norm(fd.get("emergenciaNombre")),
        emergenciaTelefono: normalizarTelefonoArg(fd.get("emergenciaTelefono")),
        emergenciaParentesco: String(fd.get("emergenciaParentesco") ?? ""),
        tieneHijos: String(fd.get("tieneHijos") ?? ""),
        cantidadHijos: String(fd.get("cantidadHijos") ?? "").trim(),
        aceptaDatos: !!fd.get("aceptaDatos")
    };
}

function validarFormulario(d) {
    const e = {};
    let m = "";
    if ((m = validarNombre(d.nombre))) e.nombre = m;
    if ((m = validarApellido(d.apellido))) e.apellido = m;
    if ((m = validarEdad(d.edad, d.fechaNacimiento))) e.edad = m;
    if ((m = validarFechaNac(d.fechaNacimiento))) e.fechaNacimiento = m;
    if ((m = validarSexo(d.sexo))) e.sexo = m;
    if ((m = validarDni(d.documento))) e.documento = m;
    if ((m = validarEstadoCivil(d.estadoCivil))) e.estadoCivil = m;
    if ((m = validarNacionalidad(d.nacionalidad))) e.nacionalidad = m;
    if ((m = validarTelefono(d.telefono))) e.telefono = m;
    if ((m = validarEmail(d.mail))) e.mail = m;
    if ((m = validarDireccion(d.direccion))) e.direccion = m;
    if ((m = validarCiudad(d.ciudad))) e.ciudad = m;
    if ((m = validarProvincia(d.provincia))) e.provincia = m;
    if ((m = validarObraSocial(d.obraSocial))) e.obraSocial = m;
    if ((m = validarAfiliado(d.obraSocial, d.numeroAfiliado))) e.numeroAfiliado = m;
    if ((m = validarGrupo(d.grupoSanguineo))) e.grupoSanguineo = m;
    if ((m = validarTextoLibre(d.alergias, "Alergias"))) e.alergias = m;
    if ((m = validarTextoLibre(d.enfermedades, "Enfermedades preexistentes"))) e.enfermedades = m;
    if ((m = validarTextoLibre(d.medicacion, "Medicación actual"))) e.medicacion = m;
    if ((m = validarTextoLibre(d.emergenciaNombre, "Contacto de emergencia"))) e.emergenciaNombre = m;
    if ((m = validarTelefono(d.emergenciaTelefono))) e.emergenciaTelefono = m;
    if ((m = validarParentesco(d.emergenciaParentesco))) e.emergenciaParentesco = m;
    if ((m = validarTieneHijos(d.tieneHijos))) e.tieneHijos = m;
    if ((m = validarCantidadHijos(d.tieneHijos, d.cantidadHijos))) e.cantidadHijos = m;
    if ((m = validarAceptaDatos(d.aceptaDatos))) e.aceptaDatos = m;
    return e;
}

function autocompletarEdadDesdeFecha() {
    const fecha = String(fechaNacimientoInput.value || "");
    if (!fecha || validarFechaNac(fecha) !== "") return;
    const edad = calcularEdadDesdeFecha(fecha);
    if (edad === null || edad < 0) return;
    edadInput.value = String(edad);
    edadInput.dispatchEvent(new Event("input", { bubbles: true }));
}

function toggleCantidadHijos() {
    const tiene = tieneHijosSel.value;
    if (tiene === "Si") {
        cantidadHijosField.style.display = "flex";
        cantidadHijosInput.disabled = false;
    } else {
        cantidadHijosField.style.display = "none";
        cantidadHijosInput.disabled = true;
        cantidadHijosInput.value = "";
        limpiarError("cantidadHijos");
    }
}

function actualizarEstadoSubmit() {
    const datos = leerFormulario();
    const errores = validarFormulario(datos);
    submitBtn.disabled = Object.keys(errores).length > 0 || personas.length >= MAX_PERSONAS;
}

tieneHijosSel.addEventListener("change", () => {
    toggleCantidadHijos();
    actualizarEstadoSubmit();
});

fechaNacimientoInput.addEventListener("change", () => {
    autocompletarEdadDesdeFecha();
    actualizarEstadoSubmit();
});

formEl.querySelectorAll("input, select").forEach((input) => {
    const evt = input.type === "checkbox" ? "change" : "input";
    input.addEventListener(evt, () => {
        const datos = leerFormulario();
        const errores = validarFormulario(datos);
        const campo = input.name;
        if (!campo) return;
        if (errores[campo]) setError(campo, errores[campo]);
        else if ((input.type === "checkbox" && input.checked) || (input.type !== "checkbox" && String(input.value).trim() !== "")) limpiarError(campo);
        else {
            const small = document.querySelector(`.error-msg[data-error="${campo}"]`);
            if (small) small.textContent = "";
            input.classList.remove("invalid", "valid");
        }
        actualizarEstadoSubmit();
    });

    input.addEventListener("blur", () => {
        const datos = leerFormulario();
        const errores = validarFormulario(datos);
        const campo = input.name;
        if (!campo) return;
        if (errores[campo]) setError(campo, errores[campo]);
        else if (input.type !== "checkbox" && String(input.value).trim() !== "") limpiarError(campo);
        actualizarEstadoSubmit();
    });
});

formEl.addEventListener("submit", (e) => {
    e.preventDefault();
    limpiarTodosLosErrores();

    if (personas.length >= MAX_PERSONAS) {
        showFormMessage(`Límite de ${MAX_PERSONAS} pacientes alcanzado.`, "error");
        actualizarEstadoSubmit();
        return;
    }

    const datos = leerFormulario();
    const errores = validarFormulario(datos);

    if (Object.keys(errores).length > 0) {
        for (const [campo, msg] of Object.entries(errores)) setError(campo, msg);
        showFormMessage("Hay campos con errores. Revisá la ficha antes de guardar.", "error");
        actualizarEstadoSubmit();
        return;
    }

    const paciente = {
        ...datos,
        edad: Number(datos.edad),
        cantidadHijos: datos.tieneHijos === "Si" ? Number(datos.cantidadHijos) : 0,
        registradoEn: new Date().toISOString()
    };

    personas.push(paciente);
    if (!guardarEnLocalStorage()) {
        personas.pop();
        actualizarEstadoSubmit();
        return;
    }

    renderTodo();
    showFormMessage(`Paciente ${paciente.nombre} ${paciente.apellido} registrado correctamente.`, "success");
    formEl.reset();
    toggleCantidadHijos();
    limpiarTodosLosErrores();
    actualizarEstadoSubmit();
});

btnVaciar.addEventListener("click", () => {
    if (personas.length === 0) {
        showFormMessage("No hay pacientes para eliminar.", "error");
        return;
    }
    if (!confirm(`¿Eliminar las ${personas.length} fichas registradas?`)) return;
    const backup = personas.slice();
    personas = [];
    if (!guardarEnLocalStorage()) {
        personas = backup;
        return;
    }
    renderTodo();
    actualizarEstadoSubmit();
    showFormMessage("Se eliminaron todas las fichas.", "success");
});

function eliminarPersona(documento) {
    const backup = personas.slice();
    personas = personas.filter((p) => p.documento !== documento);
    if (!guardarEnLocalStorage()) {
        personas = backup;
        return;
    }
    renderTodo();
    actualizarEstadoSubmit();
}

function renderTodo() {
    totalEl.textContent = personas.length;

    listaNombresEl.innerHTML = "";
    personas.forEach((p) => {
        const li = document.createElement("li");
        li.textContent = `${p.apellido}, ${p.nombre}`;
        listaNombresEl.appendChild(li);
    });

    listaDetalleEl.innerHTML = "";
    personas.forEach((p) => {
        const div = document.createElement("div");
        div.className = "persona";
        const edadTexto = formatearEdadConMeses(p.edad, p.fechaNacimiento);
        div.innerHTML = `
            <button class="btn-eliminar" data-doc="${escapeHtml(p.documento)}">Eliminar</button>
            <div class="nombre-completo">${escapeHtml(p.nombre)} ${escapeHtml(p.apellido)}</div>
            <div class="info">
                <span>N° trámite/CUIT:</span> ${escapeHtml(p.documento)} ·
                <span>Edad:</span> ${escapeHtml(edadTexto)} ·
                <span>Sexo:</span> ${escapeHtml(p.sexo)}<br>
                <span>Nac.:</span> ${escapeHtml(p.fechaNacimiento)} ·
                <span>Estado civil:</span> ${escapeHtml(p.estadoCivil)}<br>
                <span>Tel:</span> ${escapeHtml(p.telefono)} ·
                <span>Email:</span> ${escapeHtml(p.mail)}<br>
                <span>Dirección:</span> ${escapeHtml(p.direccion)}, ${escapeHtml(p.ciudad)} (${escapeHtml(p.provincia)})<br>
                <span>Obra social:</span> ${escapeHtml(p.obraSocial)} ·
                <span>Afiliado:</span> ${escapeHtml(p.numeroAfiliado || "-")}<br>
                <span>Grupo:</span> ${escapeHtml(p.grupoSanguineo)} ·
                <span>Hijos:</span> ${escapeHtml(p.tieneHijos === "Si" ? String(p.cantidadHijos) : "No")}<br>
                <span>Emergencia:</span> ${escapeHtml(p.emergenciaNombre)} (${escapeHtml(p.emergenciaParentesco)}) · ${escapeHtml(p.emergenciaTelefono)}
            </div>
        `;
        listaDetalleEl.appendChild(div);
    });

    listaDetalleEl.querySelectorAll(".btn-eliminar").forEach((btn) => {
        btn.addEventListener("click", () => eliminarPersona(btn.dataset.doc));
    });
}

toggleCantidadHijos();
