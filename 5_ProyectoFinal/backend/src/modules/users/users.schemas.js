import { z } from 'zod';
import { emailField, nameField, pagination, passwordField } from '../../utils/validation.js';

const goal = (label, min, max) =>
  z.coerce
    .number({ message: `Ingresá ${label}` })
    .int(`${label[0].toUpperCase()}${label.slice(1)} tiene que ser un número entero`)
    .min(min, `${label[0].toUpperCase()}${label.slice(1)} tiene que ser al menos ${min}`)
    .max(max, `${label[0].toUpperCase()}${label.slice(1)} no puede superar ${max}`);

const goals = z
  .object({
    kcal: goal('las calorías', 800, 10000),
    protein: goal('las proteínas', 0, 1000),
    carbs: goal('los carbohidratos', 0, 2000),
    fat: goal('las grasas', 0, 1000),
  })
  .partial()
  // Si vienen las cuatro, los macros tienen que cerrar con las calorías (±15 %).
  .refine(
    (g) => [g.kcal, g.protein, g.carbs, g.fat].some((v) => v == null) || Math.abs(g.protein * 4 + g.carbs * 4 + g.fat * 9 - g.kcal) <= g.kcal * 0.15,
    { message: 'Los macros no cierran con las calorías: proteínas y carbohidratos aportan 4 kcal por gramo y las grasas 9', path: ['kcal'] },
  );

export const roleEnum = z.enum(['admin', 'coach', 'athlete'], { message: 'Rol inválido' });

export const listUsersQuery = z.object({
  ...pagination,
  role: roleEnum.optional(),
  search: z.string().trim().max(100).optional(),
});

export const updateMeSchema = z
  .object({
    name: nameField,
    avatarUrl: z.url('URL inválida').max(500).nullable(),
    goals,
  })
  .partial();

export const goalsSchema = z.object({ goals });

export const createUserSchema = z.object({
  // Mismas reglas que el registro público: un admin tampoco puede crear cuentas con datos inválidos.
  name: nameField,
  email: emailField,
  password: passwordField,
  role: roleEnum.default('athlete'),
  coachId: z.coerce.number().int().positive().nullable().optional(),
});

export const updateUserSchema = z
  .object({
    name: nameField,
    email: emailField,
    role: roleEnum,
    coachId: z.coerce.number().int().positive().nullable(),
    isActive: z.boolean(),
    goals,
  })
  .partial();
