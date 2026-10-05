import { cleanText } from "./text.js";

const onlyLetters = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ ]+$/;

// devuelve el mensaje de error, o "" si el nombre está bien
export function validateName(nombre: unknown): string {
  const name = cleanText(nombre);

  if (name.length < 2 || name.length > 80) return "El nombre debe tener entre 2 y 80 caracteres.";
  if (!onlyLetters.test(name)) return "El nombre solo puede contener letras y espacios, sin números.";
  return "";
}
