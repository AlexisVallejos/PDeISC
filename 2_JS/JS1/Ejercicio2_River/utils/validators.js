/**
 * DOCUMENTACION PARA DEFENDER
 * Archivo: Ejercicio2_River/utils/validators.js
 * Rol: agrupa reglas de validacion para socios e inventario.
 * Idea clave: los controladores quedan atomizados y no repiten regex ni condiciones.
 * Como defenderlo: cada funcion responde una pregunta concreta sobre un dato.
 * Validacion: se devuelven booleanos para cortar rapido el flujo cuando algo es invalido.
 */
export const VALID_TLDS = ['.com', '.ar', '.net', '.org', '.edu'];

const nameRegex = /^[A-Za-z\u00C1\u00C9\u00CD\u00D3\u00DA\u00E1\u00E9\u00ED\u00F3\u00FA\u00D1\u00F1\s]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[.!@#$%^&*()\-+?]).{12,}$/;

export function isValidName(value, min = 2, max = 100) {
  const text = String(value || '').trim();
  return text.length >= min && text.length <= max && nameRegex.test(text);
}

export function isNumericText(value) {
  return /^\d+$/.test(String(value || ''));
}

export function isValidPhone(value) {
  return /^\+?\d{8,20}$/.test(String(value || ''));
}

export function isValidEmailDomain(email) {
  return Boolean(email) && email.includes('@') && VALID_TLDS.some((tld) => email.endsWith(tld));
}

export function isStrongPassword(value) {
  return passwordRegex.test(String(value || ''));
}

export function isNonNegativeNumber(value) {
  return value !== undefined && !Number.isNaN(Number(value)) && Number(value) >= 0;
}
