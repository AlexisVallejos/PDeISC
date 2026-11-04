import { query, transaction } from '../../config/db.js';
import { today as localToday } from '../../utils/dates.js';
import { energyPlan } from './energy.js';

const PROFILE_COLUMNS = `sex, DATE_FORMAT(birth_date, '%Y-%m-%d') AS birth_date, height_cm, weight_kg, body_fat_pct,
  activity_level, goal_type, goal_pace`;

const toProfile = (row) =>
  row?.sex
    ? {
        sex: row.sex,
        birthDate: row.birth_date,
        heightCm: Number(row.height_cm),
        weightKg: Number(row.weight_kg),
        bodyFatPct: row.body_fat_pct == null ? null : Number(row.body_fat_pct),
        activityLevel: row.activity_level,
        goal: row.goal_type,
        pace: row.goal_pace,
      }
    : null;

/** Datos corporales, plan calculado y las últimas 30 pesadas. Sin datos cargados, `profile` es null. */
export async function getBody(userId) {
  const [row] = await query(`SELECT ${PROFILE_COLUMNS} FROM users WHERE id = ?`, [userId]);
  const profile = toProfile(row);
  const weights = await query(
    `SELECT DATE_FORMAT(date, '%Y-%m-%d') AS date, weight_kg AS weightKg FROM body_weights
     WHERE user_id = ? ORDER BY date DESC LIMIT 30`,
    [userId],
  );
  return {
    profile,
    plan: profile ? energyPlan(profile) : null,
    weights: weights.map((w) => ({ date: w.date, weightKg: Number(w.weightKg) })).reverse(),
  };
}

/** Guarda los datos, registra la pesada del día y, si se pide, aplica las metas calculadas. */
export async function saveBody(userId, { applyGoals, ...profile }) {
  const plan = energyPlan(profile);
  await transaction(async (conn) => {
    await conn.query(
      `UPDATE users SET sex = ?, birth_date = ?, height_cm = ?, weight_kg = ?, body_fat_pct = ?,
        activity_level = ?, goal_type = ?, goal_pace = ? WHERE id = ?`,
      [profile.sex, profile.birthDate, profile.heightCm, profile.weightKg, profile.bodyFatPct ?? null,
        profile.activityLevel, profile.goal, plan.pace, userId],
    );
    await upsertWeight(conn, userId, profile.weightKg, localToday());
    if (applyGoals) {
      await conn.query('UPDATE users SET kcal_goal = ?, protein_goal = ?, carbs_goal = ?, fat_goal = ? WHERE id = ?', [
        plan.goals.kcal, plan.goals.protein, plan.goals.carbs, plan.goals.fat, userId,
      ]);
    }
  });
  return getBody(userId);
}

/** Pesada rápida: actualiza el peso actual (si es de hoy o más nueva) y el historial. */
export async function logWeight(userId, { weightKg, date = localToday() }) {
  await transaction(async (conn) => {
    await upsertWeight(conn, userId, weightKg, date);
    const [[latest]] = await conn.query(
      "SELECT DATE_FORMAT(MAX(date), '%Y-%m-%d') AS last FROM body_weights WHERE user_id = ?",
      [userId],
    );
    if (date >= latest.last) await conn.query('UPDATE users SET weight_kg = ? WHERE id = ?', [weightKg, userId]);
  });
  return getBody(userId);
}

const upsertWeight = (conn, userId, weightKg, date) =>
  conn.query(
    'INSERT INTO body_weights (user_id, date, weight_kg) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE weight_kg = VALUES(weight_kg)',
    [userId, date, weightKg],
  );
