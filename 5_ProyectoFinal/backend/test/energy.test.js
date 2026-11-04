/**
 * Cálculo de gasto energético y metas (funciones puras: no necesitan base de datos).
 */
import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { ageFrom, energyPlan } from '../src/modules/body/energy.js';

const base = { sex: 'male', birthDate: '1996-05-10', heightCm: 180, weightKg: 80, bodyFatPct: null, activityLevel: 'moderate', goal: 'maintain' };
const TODAY = '2026-11-04';

describe('plan energético', () => {
  test('edad en años cumplidos', () => {
    assert.equal(ageFrom('1996-05-10', TODAY), 30);
    assert.equal(ageFrom('1996-11-05', TODAY), 29); // cumple mañana
  });

  test('Mifflin-St Jeor: hombre de 30 años, 180 cm, 80 kg', () => {
    const plan = energyPlan(base, TODAY);
    assert.equal(plan.bmr, 1780); // 10·80 + 6,25·180 − 5·30 + 5
    assert.equal(plan.tdee, Math.round(1780 * 1.55));
    assert.equal(plan.method, 'Mifflin-St Jeor');
    assert.equal(plan.bmi, 24.7);
    assert.equal(plan.goals.kcal, Math.round((1780 * 1.55) / 10) * 10);
  });

  test('mujer: la constante de Mifflin es −161', () => {
    const plan = energyPlan({ ...base, sex: 'female', weightKg: 60, heightCm: 165 }, TODAY);
    assert.equal(plan.bmr, Math.round(10 * 60 + 6.25 * 165 - 5 * 30 - 161));
  });

  test('con % de grasa usa Katch-McArdle sobre la masa magra', () => {
    const plan = energyPlan({ ...base, bodyFatPct: 15 }, TODAY);
    assert.equal(plan.leanMassKg, 68);
    assert.equal(plan.bmr, Math.round(370 + 21.6 * 68));
    assert.match(plan.method, /Katch-McArdle/);
  });

  test('déficit moderado: ~0,75 % del peso por semana y proteína alta', () => {
    const plan = energyPlan({ ...base, goal: 'cut', pace: 'moderate' }, TODAY);
    const tdee = 1780 * 1.55;
    assert.equal(plan.weeklyChangeKg, -0.6);
    assert.equal(plan.goals.kcal, Math.round((tdee - 0.0075 * 80 * 1100) / 10) * 10);
    assert.equal(plan.goals.protein, 176); // 2,2 g/kg
    // Las calorías de los macros cierran con la meta (±10 kcal por redondeos)
    const { protein, carbs, fat, kcal } = plan.goals;
    assert.ok(Math.abs(protein * 4 + carbs * 4 + fat * 9 - kcal) <= 15);
  });

  test('el déficit nunca supera el 25 % ni baja del basal', () => {
    const plan = energyPlan({ ...base, weightKg: 140, activityLevel: 'sedentary', goal: 'cut', pace: 'fast' }, TODAY);
    assert.ok(plan.goals.kcal >= Math.round(plan.tdee * 0.75 / 10) * 10 - 10);
    assert.ok(plan.goals.kcal >= plan.bmr - 10);
    assert.ok(plan.notes.length > 0);
  });

  test('volumen: superávit chico y grasas entre 0,8 g/kg y el 35 %', () => {
    const plan = energyPlan({ ...base, goal: 'bulk', pace: 'slow' }, TODAY);
    assert.ok(plan.goals.kcal > plan.tdee);
    assert.ok(plan.goals.kcal <= plan.tdee * 1.2);
    assert.ok(plan.goals.fat >= 64 && plan.goals.fat * 9 <= plan.goals.kcal * 0.35 + 9);
  });

  test('IMC bajo con déficit avisa que no se recomienda', () => {
    const plan = energyPlan({ ...base, weightKg: 55, goal: 'cut' }, TODAY);
    assert.equal(plan.bmiCategory, 'Bajo peso');
    assert.ok(plan.notes.some((n) => n.includes('IMC es bajo')));
  });

  test('con obesidad la proteína se calcula sobre un peso de referencia', () => {
    const plan = energyPlan({ ...base, weightKg: 120, goal: 'cut' }, TODAY);
    assert.ok(plan.goals.protein < 2.2 * 120);
    assert.equal(plan.goals.protein, Math.round(2.2 * 25 * 1.8 * 1.8));
  });
});
