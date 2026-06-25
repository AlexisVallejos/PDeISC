/**
 * DOCUMENTACION PARA DEFENDER
 * Archivo: Ejercicio1_Formulario/utils/validators.js
 * Rol: agrupa reglas de validacion reutilizables del formulario.
 * Idea clave: el controlador no debe mezclar reglas regex con la respuesta HTTP.
 * Como defenderlo: los datos se validan aca y el controller solo decide que respuesta enviar.
 * Validacion: cada funcion devuelve booleano simple para mantener el flujo claro.
 */
export const VALID_TLDS = ['.com', '.ar', '.net', '.org', '.edu'];

const nameRegex = /^[A-Za-z\u00C1\u00C9\u00CD\u00D3\u00DA\u00E1\u00E9\u00ED\u00F3\u00FA\u00D1\u00F1\s]+$/;

export function isValidName(value, min, max) {
  return Boolean(value) && value.length >= min && value.length <= max && nameRegex.test(value);
}

export function isValidEmailDomain(email) {
  return Boolean(email) && email.includes('@') && VALID_TLDS.some((tld) => email.endsWith(tld));
}
