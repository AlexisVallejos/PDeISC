import { isText } from "./text.js";

// bcrypt solo lee los primeros 72 caracteres, por eso ese es el máximo
const rules: Array<[(p: string) => boolean, string]> = [
  [(p) => p.length >= 8, "La contraseña debe tener al menos 8 caracteres."],
  [(p) => p.length <= 72, "La contraseña no puede superar los 72 caracteres."],
  [(p) => /[A-Z]/.test(p), "La contraseña debe incluir al menos una letra mayúscula."],
  [(p) => /[a-z]/.test(p), "La contraseña debe incluir al menos una letra minúscula."],
  [(p) => /[0-9]/.test(p), "La contraseña debe incluir al menos un número."],
  [(p) => /[^A-Za-z0-9\s]/.test(p), "La contraseña debe incluir al menos un carácter especial, por ejemplo ! o @."],
];

export function validatePassword(password: unknown): string {
  if (!isText(password)) return "La contraseña es obligatoria.";

  for (const [isOk, message] of rules) {
    if (!isOk(password)) return message;
  }
  return "";
}
