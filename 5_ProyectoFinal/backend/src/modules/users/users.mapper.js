/** Convierte una fila de `users` en el objeto público (nunca expone el hash). */
export function toPublicUser(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    coachId: row.coach_id,
    coachName: row.coach_name ?? undefined,
    avatarUrl: row.avatar_url,
    goals: {
      kcal: row.kcal_goal,
      protein: row.protein_goal,
      carbs: row.carbs_goal,
      fat: row.fat_goal,
    },
    isActive: Boolean(row.is_active),
    hasPassword: Boolean(row.password_hash),
    // Redes vinculadas (google, facebook, github): la misma cuenta entra con cualquiera de ellas o con la contraseña.
    socialProviders: row.social_providers ? String(row.social_providers).split(',') : [],
    emailVerified: Boolean(row.email_verified_at),
    // Si ya cargó peso, altura y objetivo (para calcular sus metas).
    hasBodyProfile: Boolean(row.sex),
    createdAt: row.created_at,
  };
}

export const USER_COLUMNS = `u.id, u.name, u.email, u.password_hash, u.email_verified_at, u.email_proven, u.sex, u.role, u.coach_id, u.avatar_url,
  u.kcal_goal, u.protein_goal, u.carbs_goal, u.fat_goal, u.is_active, u.created_at,
  c.name AS coach_name,
  (SELECT GROUP_CONCAT(s.provider ORDER BY s.provider) FROM social_accounts s WHERE s.user_id = u.id) AS social_providers`;

export const USER_FROM = 'users u LEFT JOIN users c ON c.id = u.coach_id';
