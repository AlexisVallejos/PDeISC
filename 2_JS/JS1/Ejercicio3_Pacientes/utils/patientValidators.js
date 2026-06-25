/**
 * DOCUMENTACION PARA DEFENDER
 * Archivo: Ejercicio3_Pacientes/utils/patientValidators.js
 * Rol: agrupa validaciones puras del registro de pacientes.
 * Idea clave: el controller se enfoca en el flujo HTTP y este modulo en reglas de negocio.
 * Como defenderlo: cada funcion valida un tipo de dato especifico y se puede probar por separado.
 * Validacion: las regex y calculo de edad quedan centralizados para evitar duplicacion.
 */
const onlyLetters = /^[A-Za-z\u00C1\u00C9\u00CD\u00D3\u00DA\u00E1\u00E9\u00ED\u00F3\u00FA\u00D1\u00F1\s]+$/;
const dniRegex = /^\d{7,8}$/;
const phoneRegex = /^\d{10,15}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function calculateAge(birthDateStr) {
  const today = new Date();
  const birthDate = new Date(birthDateStr);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) age--;
  return age;
}

export function isLetters(value, min, max = 100) {
  const text = String(value || '').trim();
  return text.length >= min && text.length <= max && onlyLetters.test(text);
}

export function isValidDni(value) {
  return dniRegex.test(String(value || ''));
}

export function isValidPhone(value) {
  return phoneRegex.test(String(value || ''));
}

export function isValidEmail(value) {
  return emailRegex.test(String(value || ''));
}

export function isValidAge(value) {
  const age = Number(value);
  return Number.isInteger(age) && age >= 0 && age <= 120;
}

export function hasChildren(value) {
  return value === 'Si' || value === 'S\u00ED';
}
