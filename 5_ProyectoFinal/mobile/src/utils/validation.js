/**
 * Validaciones de formularios del lado del cliente. Devuelven un objeto
 * { campo: 'mensaje' } que se muestra debajo de cada input. El backend vuelve a validar.
 */

// Mismas reglas que el backend (backend/src/utils/validation.js).
export const EMAIL_MAX = 190;
export const NAME_MAX = 100;
export const PASSWORD_MAX = 72;

// Misma expresión que usa zod (z.email) en el servidor: solo caracteres ASCII y dominio con extensión de 2+ letras.
const EMAIL_RE = /^(?:[A-Za-z0-9_'+\-]+\.)*[A-Za-z0-9_'+\-]*[A-Za-z0-9_+-]@(?:[A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/;
const utf8Bytes = (v) => new TextEncoder().encode(v).length;

export const isEmail = (v) => {
  const email = typeof v === 'string' ? v.trim() : '';
  return email.length <= EMAIL_MAX && EMAIL_RE.test(email);
};

export function validateEmail(email) {
  if (typeof email === 'string' && email.trim().length > EMAIL_MAX) return `Máximo ${EMAIL_MAX} caracteres`;
  return isEmail(email) ? null : 'Ingresá un email válido';
}

export function validateName(name) {
  const value = typeof name === 'string' ? name.trim() : '';
  if (value.length < 2) return 'Ingresá tu nombre';
  if (value.length > NAME_MAX) return `Máximo ${NAME_MAX} caracteres`;
  if (/[\p{Cc}\p{Cf}]/u.test(value)) return 'El nombre tiene caracteres no permitidos';
  if (!/\p{L}/u.test(value)) return 'El nombre debe tener letras';
  return null;
}

export function validateLogin({ email, password }) {
  const errors = {};
  const mail = validateEmail(email);
  if (mail) errors.email = mail;
  if (typeof password !== 'string' || !password) errors.password = 'Ingresá tu contraseña';
  else if (utf8Bytes(password) > PASSWORD_MAX) errors.password = `Máximo ${PASSWORD_MAX} caracteres`;
  return errors;
}

export function validatePassword(password) {
  if (typeof password !== 'string' || password.length < 8) return 'Mínimo 8 caracteres';
  if (password.length > PASSWORD_MAX) return `Máximo ${PASSWORD_MAX} caracteres`;
  // bcrypt usa 72 bytes: tildes, ñ y emojis ocupan más de uno.
  if (utf8Bytes(password) > PASSWORD_MAX) return 'Es muy larga: las tildes, la ñ y los emojis ocupan más espacio';
  if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) return 'Debe tener letras y números';
  return null;
}

// Mismos dominios que acepta el servidor en el registro (ALLOWED_EMAIL_DOMAINS).
export const ALLOWED_EMAIL_DOMAINS = [
  'gmail.com', 'googlemail.com', 'hotmail.com', 'hotmail.com.ar', 'outlook.com', 'outlook.com.ar',
  'live.com', 'live.com.ar', 'yahoo.com', 'yahoo.com.ar', 'icloud.com', 'me.com', 'proton.me', 'protonmail.com',
];

export function validateRegisterEmail(email) {
  const error = validateEmail(email);
  if (error) return error;
  const domain = email.trim().toLowerCase().split('@')[1];
  return ALLOWED_EMAIL_DOMAINS.includes(domain) ? null : 'Usá un email de Gmail, Outlook/Hotmail, Yahoo, iCloud o Proton';
}

/** Código de 6 números que llega por email. */
export const validateCode = (code) => (/^\d{6}$/.test(String(code ?? '').trim()) ? null : 'El código tiene 6 números');

export function validateRegister({ name, email, password, confirm }) {
  const errors = {};
  const nameError = validateName(name);
  if (nameError) errors.name = nameError;
  const mail = validateRegisterEmail(email);
  if (mail) errors.email = mail;
  const pwd = validatePassword(password);
  if (pwd) errors.password = pwd;
  if (password !== confirm) errors.confirm = 'Las contraseñas no coinciden';
  return errors;
}

/** Valida que los campos sean números >= 0. `required` lista los obligatorios. */
/**
 * Valida campos numéricos. Opciones:
 *  - required: los obligatorios (por defecto, todos)
 *  - positive: los que tienen que ser mayores a 0
 *  - max: { campo: máximo } con los mismos límites que el servidor
 *  - integer: los que no aceptan decimales; el resto acepta uno como máximo
 */
export function validateNumbers(values, fields, { required = fields, positive = [], max = {}, integer = [], min = {} } = {}) {
  const errors = {};
  for (const field of fields) {
    const raw = values[field];
    if (raw === '' || raw === undefined || raw === null) {
      if (required.includes(field)) errors[field] = 'Requerido';
      continue;
    }
    const text = String(raw).trim().replace(',', '.');
    const n = Number(text);
    if (text === '' || Number.isNaN(n)) errors[field] = 'Debe ser un número';
    else if (n < 0) errors[field] = 'No puede ser negativo';
    else if (positive.includes(field) && n === 0) errors[field] = 'Debe ser mayor a 0';
    else if (min[field] !== undefined && n < min[field]) errors[field] = `Mínimo ${min[field]}`;
    else if (max[field] !== undefined && n > max[field]) errors[field] = `Máximo ${max[field]}`;
    else if (integer.includes(field) && !Number.isInteger(n)) errors[field] = 'Sin decimales';
    else if (!integer.includes(field) && Math.round(n * 10) !== n * 10) errors[field] = 'Como máximo un decimal';
  }
  return errors;
}

/**
 * Coherencia nutricional de un alimento o registro (gramos, kcal y macros de la misma cantidad):
 *  - proteínas + carbohidratos + grasas no pueden pesar más que la porción
 *  - las calorías tienen que parecerse a 4·P + 4·C + 9·G (margen por fibra, alcohol y redondeos)
 */
export function validateMacroConsistency({ grams, kcal, protein, carbs, fat }) {
  const errors = {};
  const n = (v) => Number(String(v ?? '').replace(',', '.')) || 0;
  const [g, k, p, c, f] = [grams, kcal, protein, carbs, fat].map(n);
  if (g > 0 && p + c + f > g + 0.5) errors.fat = `Los macros suman ${Math.round(p + c + f)} g y la porción es de ${g} g`;
  const fromMacros = 4 * p + 4 * c + 9 * f;
  if (Math.abs(k - fromMacros) > Math.max(30, 0.3 * Math.max(k, fromMacros))) {
    errors.kcal = `No coincide con los macros: deberían ser unas ${Math.round(fromMacros)} kcal`;
  }
  return errors;
}

/** Texto obligatorio u opcional con largo mínimo y máximo (mismos topes que el servidor). */
export function validateText(value, { min = 0, max, required = min > 0, label = 'este campo' } = {}) {
  const text = String(value ?? '').trim();
  if (!text) return required ? `Completá ${label}` : null;
  if (text.length < min) return `Mínimo ${min} caracteres`;
  if (max && text.length > max) return `Máximo ${max} caracteres`;
  if (/[\p{Cc}]/u.test(text.replace(/[\n\t]/g, ''))) return 'Tiene caracteres no permitidos';
  return null;
}

/** Fecha AAAA-MM-DD que exista. */
export function validateIsoDate(value, label = 'la fecha') {
  const v = String(value ?? '').trim();
  if (!v) return `Completá ${label}`;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return 'Usá el formato AAAA-MM-DD';
  const [y, m, d] = v.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  if (date.getUTCMonth() !== m - 1 || date.getUTCDate() !== d) return 'Esa fecha no existe';
  if (y < 2000 || y > 2100) return 'Año fuera de rango';
  return null;
}

/** Vigencia de un plan: fechas válidas, fin igual o posterior al inicio y como máximo un año. */
export function validateDateRange(start, end) {
  const errors = {};
  const s = validateIsoDate(start, 'el inicio');
  const e = validateIsoDate(end, 'el fin');
  if (s) errors.startDate = s;
  if (e) errors.endDate = e;
  if (!s && !e) {
    const days = (Date.parse(end) - Date.parse(start)) / 86400000;
    if (days < 0) errors.endDate = 'El fin no puede ser anterior al inicio';
    else if (days > 366) errors.endDate = 'La vigencia puede ser de hasta un año';
  }
  return errors;
}

/** URL http(s) opcional. */
export function validateUrl(value) {
  const v = String(value ?? '').trim();
  if (!v) return null;
  if (v.length > 500) return 'Máximo 500 caracteres';
  try {
    const url = new URL(v);
    return ['http:', 'https:'].includes(url.protocol) ? null : 'Tiene que empezar con http:// o https://';
  } catch {
    return 'URL inválida';
  }
}

export const toNumber = (v) => (v === '' || v === undefined || v === null ? undefined : Number(String(v).replace(',', '.')));

// --- Datos corporales: mismos límites que el servidor (backend/src/modules/body/body.schemas.js) ---
export const BODY_LIMITS = {
  age: { min: 14, max: 101 },
  heightCm: { min: 100, max: 250 },
  weightKg: { min: 30, max: 350 },
  bodyFatPct: { min: 3, max: 60 },
};

/** Años cumplidos a `today` (AAAA-MM-DD). */
export function yearsSince(isoDate, today = new Date()) {
  const [y, m, d] = isoDate.split('-').map(Number);
  const tm = today.getMonth() + 1;
  return today.getFullYear() - y - (tm < m || (tm === m && today.getDate() < d) ? 1 : 0);
}

export function validateBirthDate(value, today = new Date()) {
  const v = String(value ?? '').trim();
  if (!v) return 'Ingresá la fecha de nacimiento';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return 'Usá el formato AAAA-MM-DD (ej.: 1998-04-21)';
  const [y, m, d] = v.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  if (date.getUTCMonth() !== m - 1 || date.getUTCDate() !== d) return 'Esa fecha no existe';
  if (date.getTime() > today.getTime()) return 'La fecha de nacimiento no puede ser futura';
  const age = yearsSince(v, today);
  if (age < BODY_LIMITS.age.min || age > BODY_LIMITS.age.max) {
    return `La edad tiene que estar entre ${BODY_LIMITS.age.min} y ${BODY_LIMITS.age.max} años`;
  }
  return null;
}

/** Número con coma o punto, dentro del rango y con un decimal como máximo. */
export function validateMeasure(raw, { min, max }, unit, { required = true, name = 'el valor' } = {}) {
  const text = String(raw ?? '').trim().replace(',', '.');
  if (!text) return required ? `Ingresá ${name}` : null;
  if (!/^\d+(\.\d?)?$/.test(text)) return /^\d+\.\d{2,}$/.test(text) ? 'Usá como máximo un decimal' : 'Ingresá solo números';
  const n = Number(text);
  if (n < min) return `Mínimo ${min} ${unit}`;
  if (n > max) return `Máximo ${max} ${unit}`;
  return null;
}

/** Errores del formulario de datos corporales ({} si está todo bien). */
export function validateBody(form, today = new Date()) {
  const errors = {};
  if (!form.sex) errors.sex = 'Elegí el sexo biológico';
  const birth = validateBirthDate(form.birthDate, today);
  if (birth) errors.birthDate = birth;
  const height = validateMeasure(form.heightCm, BODY_LIMITS.heightCm, 'cm', { name: 'la altura' });
  if (height) errors.heightCm = height;
  const weight = validateMeasure(form.weightKg, BODY_LIMITS.weightKg, 'kg', { name: 'el peso' });
  if (weight) errors.weightKg = weight;
  const fat = validateMeasure(form.bodyFatPct, BODY_LIMITS.bodyFatPct, '%', { required: false });
  if (fat) errors.bodyFatPct = fat;
  if (!form.activityLevel) errors.activityLevel = 'Elegí el nivel de actividad';
  if (!form.goal) errors.goal = 'Elegí un objetivo';
  return errors;
}
