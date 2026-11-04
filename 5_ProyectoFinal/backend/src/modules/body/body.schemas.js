import { z } from 'zod';
import { isoDate } from '../../utils/validation.js';
import { ACTIVITY, GOALS } from './energy.js';

/** Límites de los datos corporales (la app usa los mismos en mobile/src/utils/validation.js). */
export const BODY_LIMITS = {
  age: { min: 14, max: 101 },
  heightCm: { min: 100, max: 250 },
  weightKg: { min: 30, max: 350 },
  bodyFatPct: { min: 3, max: 60 },
};

/** Años cumplidos a hoy (misma cuenta que energy.js). */
function yearsSince(isoDate) {
  const [y, m, d] = isoDate.split('-').map(Number);
  const now = new Date();
  return now.getFullYear() - y - (now.getMonth() + 1 < m || (now.getMonth() + 1 === m && now.getDate() < d) ? 1 : 0);
}

/** Un solo mensaje por fecha: formato, que exista, que no sea futura y la edad. */
function birthDateError(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return 'Usá el formato AAAA-MM-DD (ej.: 1998-04-21)';
  const [y, m, d] = value.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  if (date.getUTCMonth() !== m - 1 || date.getUTCDate() !== d) return 'Esa fecha no existe';
  if (date.getTime() > Date.now()) return 'La fecha de nacimiento no puede ser futura';
  const age = yearsSince(value);
  if (age < BODY_LIMITS.age.min || age > BODY_LIMITS.age.max) {
    return `La edad tiene que estar entre ${BODY_LIMITS.age.min} y ${BODY_LIMITS.age.max} años`;
  }
  return null;
}

const birthDate = z.string({ error: 'Ingresá la fecha de nacimiento' }).trim().superRefine((value, ctx) => {
  const message = birthDateError(value);
  if (message) ctx.addIssue({ code: 'custom', message });
});

/** Número dentro de un rango y con un decimal como máximo (72,5 sí; 72,55 no). */
const measure = (name, unit, { min, max }) =>
  z.coerce
    .number({ error: `Ingresá ${name}` })
    .refine(Number.isFinite, `Ingresá ${name}`)
    .refine((v) => v >= min, `Mínimo ${min} ${unit}`)
    .refine((v) => v <= max, `Máximo ${max} ${unit}`)
    .refine((v) => Math.round(v * 10) === v * 10, 'Usá como máximo un decimal');

/** Datos que hacen falta para calcular el plan. */
export const bodyProfileSchema = z.object({
  sex: z.enum(['male', 'female'], { message: 'Elegí el sexo biológico' }),
  birthDate,
  heightCm: measure('la altura', 'cm', BODY_LIMITS.heightCm),
  weightKg: measure('el peso', 'kg', BODY_LIMITS.weightKg),
  bodyFatPct: measure('el % de grasa', '%', BODY_LIMITS.bodyFatPct).nullable().optional(),
  activityLevel: z.enum(Object.keys(ACTIVITY), { message: 'Elegí el nivel de actividad' }),
  goal: z.enum(Object.keys(GOALS), { message: 'Elegí un objetivo' }),
  pace: z.enum(['slow', 'moderate', 'fast']).nullable().optional(),
});

/** Guardar: además, si se aplican las metas calculadas al diario. */
export const saveBodySchema = bodyProfileSchema.extend({ applyGoals: z.boolean().default(true) });

export const weightLogSchema = z.object({
  weightKg: measure('el peso', 'kg', BODY_LIMITS.weightKg),
  date: isoDate.refine((value) => Date.parse(value) <= Date.now(), 'La fecha no puede ser futura').optional(),
});

export const bodyQuery = z.object({ userId: z.coerce.number().int().positive().optional() });
