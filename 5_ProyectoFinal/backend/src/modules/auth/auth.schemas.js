import { z } from 'zod';
import {
  emailField as email,
  loginPasswordField,
  nameField as name,
  passwordField as password,
  registerEmailField,
} from '../../utils/validation.js';

// z.object descarta las claves desconocidas: un "role" o "isActive" en el cuerpo nunca llega al servicio.
export const registerSchema = z.object({ name, email: registerEmailField, password });

const code = z.string({ error: 'Ingresá el código' }).trim().regex(/^\d{6}$/, 'El código tiene 6 números');

export const verifyEmailSchema = z.object({ email, code });

export const resendCodeSchema = z.object({ email, purpose: z.enum(['verify', 'reset']).default('verify') });

export const forgotPasswordSchema = z.object({ email });

export const resetPasswordSchema = z.object({ email, code, newPassword: password });

export const loginSchema = z.object({
  email,
  password: loginPasswordField,
});

export const refreshSchema = z.object({
  refreshToken: z.string({ error: 'Falta refreshToken' }).min(1, 'Falta refreshToken').max(2000),
});

export const logoutSchema = z.object({
  refreshToken: z.string().max(2000).optional(),
});

export const oauthParams = z.object({
  provider: z.enum(['google', 'facebook', 'github'], { message: 'Proveedor no soportado' }),
});

export const oauthStartQuery = z.object({
  redirect_uri: z.string().min(1, 'Falta redirect_uri'),
  code_challenge: z.string().regex(/^[a-f0-9]{64}$/, 'code_challenge debe ser un SHA-256 en hexadecimal'),
});

export const oauthExchangeSchema = z.object({
  code: z.string().min(1, 'Falta code'),
  codeVerifier: z.string().min(43, 'code_verifier inválido').max(128),
});

export const changePasswordSchema = z.object({
  currentPassword: loginPasswordField.optional(),
  newPassword: password,
});
