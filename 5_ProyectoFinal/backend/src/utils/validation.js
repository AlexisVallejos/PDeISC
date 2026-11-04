import { z } from 'zod';
import { env } from '../config/env.js';

export const idParam = z.object({ id: z.coerce.number().int().positive() });

export const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha esperado: AAAA-MM-DD')
  .refine((value) => !Number.isNaN(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value, 'Fecha inválida');

export const pagination = {
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
};

export const paginationMeta = (page, limit, total) => ({
  page,
  limit,
  total,
  totalPages: Math.max(1, Math.ceil(total / limit)),
});

// --- Campos de cuenta: registro, login, cambio de contraseña y alta/edición por un admin ---

export const EMAIL_MAX = 190; // largo de la columna users.email
export const PASSWORD_MAX = 72; // bcrypt solo usa los primeros 72 bytes: lo que sobra se ignoraría

const utf8Bytes = (value) => Buffer.byteLength(value, 'utf8');

// Se recorta y pasa a minúsculas ANTES de validar el formato: con z.email().trim() el
// formato se chequeaba primero y un email con espacios alrededor se rechazaba.
export const emailField = z
  .string({ error: 'Email inválido' })
  .trim()
  .toLowerCase()
  .pipe(z.email('Email inválido').max(EMAIL_MAX, `El email no puede superar ${EMAIL_MAX} caracteres`));

// Registro público: además, el dominio tiene que ser de un proveedor de email conocido.
export const registerEmailField = emailField.refine(
  // Si el formato ya es inválido, ese es el único error que se informa.
  (value) => !z.email().safeParse(value).success || env.allowedEmailDomains.includes(value.split('@')[1]),
  'Usá un email de Gmail, Outlook/Hotmail, Yahoo, iCloud o Proton',
);

// Sin caracteres de control (\0, saltos de línea) ni invisibles (espacios de ancho cero) y con alguna letra.
export const nameField = z
  .string({ error: 'Ingresá el nombre' })
  .trim()
  .min(2, { message: 'El nombre debe tener al menos 2 caracteres', abort: true })
  .max(100, 'El nombre no puede superar 100 caracteres')
  .regex(/\p{L}/u, 'El nombre debe incluir al menos una letra')
  .refine((value) => !/[\p{Cc}\p{Cf}]/u.test(value), 'El nombre tiene caracteres no permitidos');

export const passwordField = z
  .string({ error: 'Ingresá la contraseña' })
  .min(8, 'La contraseña debe tener al menos 8 caracteres')
  .max(PASSWORD_MAX, `La contraseña no puede superar ${PASSWORD_MAX} caracteres`)
  // Tildes, ñ y emojis ocupan más de un byte: se controla también el largo real que ve bcrypt.
  .refine(
    (value) => value.length > PASSWORD_MAX || utf8Bytes(value) <= PASSWORD_MAX,
    'La contraseña es demasiado larga (las tildes, la ñ y los emojis ocupan más espacio)',
  )
  .regex(/[A-Za-z]/, 'La contraseña debe incluir al menos una letra')
  .regex(/\d/, 'La contraseña debe incluir al menos un número');

// Al iniciar sesión no se exigen las reglas de fortaleza, pero sí el tope de bcrypt: si no,
// "clave de 72 caracteres + cualquier cosa" también entraría.
export const loginPasswordField = z
  .string({ error: 'Ingresá la contraseña' })
  .min(1, 'Ingresá la contraseña')
  .refine((value) => utf8Bytes(value) <= PASSWORD_MAX, `La contraseña no puede superar ${PASSWORD_MAX} caracteres`);

/**
 * Coherencia nutricional (misma regla que la app, mobile/src/utils/validation.js):
 *  - proteínas + carbohidratos + grasas no pesan más que la porción
 *  - las calorías se parecen a 4·P + 4·C + 9·G (margen de 30 kcal o 30 %, por fibra, alcohol y redondeos)
 * Para usar con superRefine; solo controla cuando están todos los valores.
 */
export function checkMacros(v, ctx, gramsKey = 'grams') {
  const { kcal, protein, carbs, fat } = v;
  const grams = v[gramsKey];
  if ([kcal, protein, carbs, fat].some((n) => n === undefined || n === null)) return;
  if (grams && protein + carbs + fat > grams + 0.5) {
    ctx.addIssue({ code: 'custom', path: ['fat'], message: `Los macros suman ${Math.round(protein + carbs + fat)} g y la porción es de ${grams} g` });
  }
  const fromMacros = 4 * protein + 4 * carbs + 9 * fat;
  if (Math.abs(kcal - fromMacros) > Math.max(30, 0.3 * Math.max(kcal, fromMacros))) {
    ctx.addIssue({ code: 'custom', path: ['kcal'], message: `No coincide con los macros: deberían ser unas ${Math.round(fromMacros)} kcal` });
  }
}
