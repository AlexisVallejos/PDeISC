/**
 * Cálculo de gasto energético y metas de calorías y macros a partir de los datos corporales.
 * Funciones puras: no tocan la base, así se pueden probar y reutilizar en la vista previa.
 *
 * Referencias:
 *  - Metabolismo basal: Mifflin-St Jeor (1990), la ecuación que recomienda la Academy of Nutrition
 *    and Dietetics para adultos. Con % de grasa conocido se usa Katch-McArdle (masa magra).
 *  - Factores de actividad: 1,2 (sedentario) a 1,9 (muy activo).
 *  - Ritmo de descenso: 0,5–1 % del peso por semana; ~0,7 %/semana conserva mejor la masa magra
 *    en atletas (Garthe et al., 2011). Volumen: 0,25–0,5 %/semana para limitar la ganancia de grasa.
 *  - Proteína: 1,6–2,2 g/kg con entrenamiento de fuerza; en déficit, hasta 2,4 g/kg
 *    (ISSN, posiciones sobre proteína y ejercicio y sobre dietas para bajar de peso).
 *  - Grasas: 20–35 % de las calorías y al menos 0,8 g/kg (salud hormonal). Carbohidratos: el resto.
 */

export const ACTIVITY = {
  sedentary: { factor: 1.2, label: 'Sedentario', detail: 'Trabajo sentado y poco o nada de ejercicio' },
  light: { factor: 1.375, label: 'Actividad ligera', detail: 'Ejercicio 1 a 3 días por semana' },
  moderate: { factor: 1.55, label: 'Actividad moderada', detail: 'Ejercicio 3 a 5 días por semana' },
  active: { factor: 1.725, label: 'Muy activo', detail: 'Ejercicio intenso 6 a 7 días por semana' },
  very_active: { factor: 1.9, label: 'Extremadamente activo', detail: 'Doble turno de entrenamiento o trabajo físico pesado' },
};

/** Cambio de peso semanal, en % del peso corporal (negativo = bajar). */
export const GOALS = {
  cut: { label: 'Déficit (bajar grasa)', pace: { slow: -0.5, moderate: -0.75, fast: -1 }, protein: 2.2 },
  recomp: { label: 'Recomposición (bajar grasa y ganar músculo)', pace: null, kcalFactor: 0.95, protein: 2.2 },
  maintain: { label: 'Mantenimiento', pace: null, kcalFactor: 1, protein: 1.8 },
  bulk: { label: 'Volumen (ganar músculo)', pace: { slow: 0.25, moderate: 0.35, fast: 0.5 }, protein: 1.8 },
};

const KCAL_PER_KG = 7700; // energía aproximada de 1 kg de tejido corporal
// Redondea a múltiplos de `step` (1, 10, 0,1, 0,05) sin arrastrar errores de coma flotante.
const round = (n, step = 1) => Number((Math.round(n / step) * step).toFixed(Math.max(0, -Math.floor(Math.log10(step)) + 1)));

/** Edad en años cumplidos a la fecha `today` (AAAA-MM-DD). */
export function ageFrom(birthDate, today = new Date().toISOString().slice(0, 10)) {
  const [by, bm, bd] = birthDate.split('-').map(Number);
  const [ty, tm, td] = today.split('-').map(Number);
  return ty - by - (tm < bm || (tm === bm && td < bd) ? 1 : 0);
}

/**
 * Plan energético completo.
 * @param {{ sex: 'male'|'female', birthDate: string, heightCm: number, weightKg: number,
 *   bodyFatPct?: number|null, activityLevel: keyof ACTIVITY, goal: keyof GOALS, pace?: 'slow'|'moderate'|'fast' }} p
 */
export function energyPlan(p, today) {
  const age = ageFrom(p.birthDate, today);
  const heightM = p.heightCm / 100;
  const bmi = p.weightKg / (heightM * heightM);
  const leanMass = p.bodyFatPct != null ? p.weightKg * (1 - p.bodyFatPct / 100) : null;

  const mifflin = 10 * p.weightKg + 6.25 * p.heightCm - 5 * age + (p.sex === 'male' ? 5 : -161);
  const bmr = leanMass != null ? 370 + 21.6 * leanMass : mifflin;
  const activity = ACTIVITY[p.activityLevel];
  const tdee = bmr * activity.factor;

  const goal = GOALS[p.goal];
  const pace = goal.pace ? (p.pace ?? 'moderate') : null;
  const weeklyPct = goal.pace ? goal.pace[pace] : 0;
  const notes = [];

  let target = goal.pace ? tdee + (weeklyPct / 100) * p.weightKg * (KCAL_PER_KG / 7) : tdee * goal.kcalFactor;
  // Límites de seguridad: un déficit de más del 25 % o comer por debajo del basal deja de ser sostenible.
  if (target < tdee * 0.75) {
    target = tdee * 0.75;
    notes.push('El ritmo elegido pedía un déficit mayor al 25 %: se limitó para proteger la masa muscular.');
  }
  if (target < bmr) {
    target = bmr;
    notes.push('Las calorías no bajan del metabolismo basal.');
  }
  if (target > tdee * 1.2) target = tdee * 1.2;

  // Con obesidad, la proteína se calcula sobre un peso de referencia (IMC 25) o sobre la masa magra.
  const refWeight = leanMass != null ? Math.min(p.weightKg, leanMass / 0.85) : bmi >= 30 ? 25 * heightM * heightM : p.weightKg;
  const proteinPerKg = goal.protein + (p.goal === 'cut' && pace === 'fast' ? 0.2 : 0);
  const protein = proteinPerKg * refWeight;
  const fat = Math.min(Math.max(0.25 * target / 9, 0.8 * refWeight), 0.35 * target / 9);
  const carbs = Math.max(0, (target - protein * 4 - fat * 9) / 4);

  if (bmi < 18.5 && (p.goal === 'cut' || p.goal === 'recomp')) {
    notes.push('Tu IMC es bajo: no se recomienda un déficit. Consultá con un profesional.');
  }
  if (age < 18) notes.push('Sos menor de 18 años: los cálculos son orientativos y conviene el seguimiento de un profesional.');
  if (bmi >= 30 && leanMass == null) {
    notes.push('Con IMC mayor a 30 la proteína se calcula sobre un peso de referencia. Si sabés tu % de grasa, cargalo para mayor precisión.');
  }

  return {
    age,
    bmi: round(bmi, 0.1),
    bmiCategory: bmi < 18.5 ? 'Bajo peso' : bmi < 25 ? 'Normal' : bmi < 30 ? 'Sobrepeso' : 'Obesidad',
    leanMassKg: leanMass != null ? round(leanMass, 0.1) : null,
    method: leanMass != null ? 'Katch-McArdle (con masa magra)' : 'Mifflin-St Jeor',
    bmr: round(bmr),
    activityFactor: activity.factor,
    tdee: round(tdee),
    goal: p.goal,
    pace,
    // Cambio real según las kcal finales (después de los topes de seguridad), no según el ritmo pedido.
    weeklyChangeKg: goal.pace ? round(((target - tdee) * 7) / KCAL_PER_KG, 0.05) : 0,
    goals: {
      kcal: round(target, 10),
      protein: round(protein),
      carbs: round(carbs),
      fat: round(fat),
    },
    proteinPerKg: round(protein / p.weightKg, 0.1),
    waterLiters: round(p.weightKg * 0.035, 0.1),
    fiberGrams: round((target / 1000) * 14),
    notes,
  };
}
