// cada regla: [cómo se comprueba, mensaje si falla]
const checks: Array<[(v: string) => boolean, string]> = [
  [(v) => v.length >= 8, "La contraseña debe tener al menos 8 caracteres."],
  [(v) => v.length <= 72, "La contraseña no puede superar los 72 caracteres."],
  [(v) => /[A-Z]/.test(v), "La contraseña debe incluir una letra mayúscula."],
  [(v) => /[a-z]/.test(v), "La contraseña debe incluir una letra minúscula."],
  [(v) => /[0-9]/.test(v), "La contraseña debe incluir un número."],
  [(v) => /[^A-Za-z0-9\s]/.test(v), "La contraseña debe incluir un carácter especial, por ejemplo ! o @."],
];

// devuelve true si está bien, o el primer mensaje de error
function checkPassword(value: string): true | string {
  for (const [isOk, message] of checks) {
    if (!isOk(value)) return message;
  }
  return true;
}

export const passwordRules = {
  required: "La contraseña es obligatoria.",
  validate: (value: string) => checkPassword(value),
};

// para editar: la contraseña puede quedar vacía
export const optionalPasswordRules = {
  validate: (value: string) => !value || checkPassword(value),
};
