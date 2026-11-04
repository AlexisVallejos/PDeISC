import { z } from 'zod';
import { isoDate } from '../../utils/validation.js';
import { ACTIVITY, GOALS } from './energy.js';

const birthDate = isoDate.refine((value) => {
  const years = (Date.now() - Date.parse(value)) / (365.25 * 24 * 3600 * 1000);
  return years >= 14 && years <= 100;
}, 'La edad tiene que estar entre 14 y 100 años');

/** Datos que hacen falta para calcular el plan. */
export const bodyProfileSchema = z.object({
  sex: z.enum(['male', 'female'], { message: 'Elegí el sexo biológico' }),
  birthDate,
  heightCm: z.coerce.number({ error: 'Ingresá la altura' }).min(120, 'Altura mínima: 120 cm').max(230, 'Altura máxima: 230 cm'),
  weightKg: z.coerce.number({ error: 'Ingresá el peso' }).min(35, 'Peso mínimo: 35 kg').max(300, 'Peso máximo: 300 kg'),
  bodyFatPct: z.coerce.number().min(3, 'Mínimo 3 %').max(60, 'Máximo 60 %').nullable().optional(),
  activityLevel: z.enum(Object.keys(ACTIVITY), { message: 'Elegí el nivel de actividad' }),
  goal: z.enum(Object.keys(GOALS), { message: 'Elegí un objetivo' }),
  pace: z.enum(['slow', 'moderate', 'fast']).nullable().optional(),
});

/** Guardar: además, si se aplican las metas calculadas al diario. */
export const saveBodySchema = bodyProfileSchema.extend({ applyGoals: z.boolean().default(true) });

export const weightLogSchema = z.object({
  weightKg: z.coerce.number({ error: 'Ingresá el peso' }).min(35, 'Peso mínimo: 35 kg').max(300, 'Peso máximo: 300 kg'),
  date: isoDate.optional(),
});

export const bodyQuery = z.object({ userId: z.coerce.number().int().positive().optional() });
