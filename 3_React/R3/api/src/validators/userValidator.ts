import type { Rol } from "../types/user.js";
import { validateEmail } from "./emailValidator.js";
import { validateName } from "./nameValidator.js";
import { validatePassword } from "./passwordValidator.js";

export const roles: Rol[] = ["usuario", "administrador"];

export const isValidRole = (rol: unknown): rol is Rol => roles.includes(rol as Rol);

export interface UserFields {
  nombre?: unknown;
  email?: unknown;
  password?: unknown;
}

export type ValidationErrors = Record<string, string>;

// devuelve un objeto { campo: mensaje }; vacío si todo está bien
export function validateUser({ nombre, email, password }: UserFields, passwordRequired = true): ValidationErrors {
  const errors: ValidationErrors = {};

  const nameError = validateName(nombre);
  if (nameError) errors.nombre = nameError;

  const emailError = validateEmail(email);
  if (emailError) errors.email = emailError;

  const mustCheckPassword = passwordRequired || (password !== undefined && password !== "");
  if (mustCheckPassword) {
    const passwordError = validatePassword(password);
    if (passwordError) errors.password = passwordError;
  }

  return errors;
}

export const hasErrors = (errors: ValidationErrors): boolean => Object.keys(errors).length > 0;
