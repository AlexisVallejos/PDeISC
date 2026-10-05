import { cleanText } from "./text.js";

const emailPattern = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/;

export const normalizeEmail = (email: unknown): string => cleanText(email).toLowerCase();

export function validateEmail(email: unknown): string {
  const value = normalizeEmail(email);

  if (value.length > 120 || !emailPattern.test(value)) {
    return "Ingresá un correo válido, con @ y un dominio final como .com.";
  }
  return "";
}
