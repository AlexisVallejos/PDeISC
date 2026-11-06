import fs from 'node:fs/promises';
import bcrypt from 'bcryptjs';
import { MICRO_COLUMNS, MICROS } from '../modules/nutrition/micros.js';

/** Todas las migraciones aditivas, en orden. Se pueden correr varias veces. */
export async function runMigrations(conn) {
  await migrateCoaching(conn);
  await migrateFoodSources(conn);
  await migrateOAuthLoginCodes(conn);
  await migrateEmailVerification(conn);
  await migrateTypicalFoods(conn);
  await migrateBodyProfile(conn);
  await migrateEmailProven(conn);
  await migrateUploadedImages(conn);
  await once(conn, 'demo-staff-2026-11', ensureDemoStaff);
}

/** Imágenes subidas desde la app (en Vercel no hay disco que dure): ver modules/uploads. */
async function migrateUploadedImages(conn) {
  await conn.query(`CREATE TABLE IF NOT EXISTS uploaded_images (
    id         CHAR(32) NOT NULL,
    owner_id   INT UNSIGNED NULL,
    mime       VARCHAR(20) NOT NULL,
    data       MEDIUMBLOB NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_uploaded_images_owner (owner_id),
    CONSTRAINT fk_uploaded_images_owner FOREIGN KEY (owner_id) REFERENCES users (id) ON DELETE SET NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);
}

/** Pasos que corren UNA sola vez por base (quedan anotados en app_migrations). */
async function once(conn, name, step) {
  await conn.query(`CREATE TABLE IF NOT EXISTS app_migrations (
    name   VARCHAR(100) NOT NULL PRIMARY KEY,
    ran_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);
  const [[done]] = await conn.query('SELECT 1 AS yes FROM app_migrations WHERE name = ?', [name]);
  if (done) return;
  await step(conn);
  await conn.query('INSERT IGNORE INTO app_migrations (name) VALUES (?)', [name]);
}

/**
 * Cuentas de admin y coach para probar la app publicada (contraseña Demo1234).
 * Si ya existían, se reactivan y se les vuelve a poner esa contraseña. Corre una sola vez:
 * si después se cambia la contraseña desde la app, no se pisa.
 */
async function ensureDemoStaff(conn) {
  const hash = await bcrypt.hash('Demo1234', 10);
  const staff = [
    ['Admin MacroEntreno', 'admin@macroentreno.com', 'admin'],
    ['Coach Laura', 'coach@macroentreno.com', 'coach'],
  ];
  for (const [name, email, role] of staff) {
    await conn.query(
      `INSERT INTO users (name, email, password_hash, role, email_verified_at, email_proven, is_active)
       VALUES (?, ?, ?, ?, NOW(), 1, 1)
       ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash), role = VALUES(role),
         email_verified_at = COALESCE(email_verified_at, NOW()), email_proven = 1, is_active = 1`,
      [name, email, hash, role],
    );
  }
}

/**
 * email_proven: el dueño del email lo probó (código que llegó al correo o proveedor que lo verificó).
 * No alcanza con email_verified_at, que también se marca solo cuando el servidor no tiene correo.
 * Solo una cuenta con el email probado se vincula sin más a un login social con ese email.
 * Las cuentas que ya existían quedan sin probar: si entran con Google, se les pide crear la contraseña de nuevo.
 */
async function migrateEmailProven(conn) {
  const [column] = await conn.query("SHOW COLUMNS FROM users LIKE 'email_proven'");
  if (!column.length) {
    await conn.query('ALTER TABLE users ADD COLUMN email_proven TINYINT(1) NOT NULL DEFAULT 0 AFTER email_verified_at');
  }
}

/** Datos corporales para calcular calorías y macros, e historial de peso. */
async function migrateBodyProfile(conn) {
  const [column] = await conn.query("SHOW COLUMNS FROM users LIKE 'sex'");
  if (!column.length) {
    await conn.query(`ALTER TABLE users
      ADD COLUMN sex ENUM('male','female') NULL,
      ADD COLUMN birth_date DATE NULL,
      ADD COLUMN height_cm DECIMAL(5,1) NULL,
      ADD COLUMN weight_kg DECIMAL(5,1) NULL,
      ADD COLUMN body_fat_pct DECIMAL(4,1) NULL,
      ADD COLUMN activity_level ENUM('sedentary','light','moderate','active','very_active') NULL,
      ADD COLUMN goal_type ENUM('cut','recomp','maintain','bulk') NULL,
      ADD COLUMN goal_pace ENUM('slow','moderate','fast') NULL`);
  }
  await conn.query(`CREATE TABLE IF NOT EXISTS body_weights (
    user_id   INT UNSIGNED NOT NULL,
    date      DATE NOT NULL,
    weight_kg DECIMAL(5,1) NOT NULL,
    PRIMARY KEY (user_id, date),
    CONSTRAINT fk_body_weights_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);
}

/**
 * Comidas típicas (milanesas, empanadas, asado, guisos…) en el catálogo global.
 * Solo agrega las que faltan por nombre: no pisa correcciones ni duplica.
 */
async function migrateTypicalFoods(conn) {
  const foods = JSON.parse(await fs.readFile(new URL('../../database/seeds/typical-foods.json', import.meta.url), 'utf8'));
  const [existing] = await conn.query('SELECT LOWER(name) AS name FROM foods WHERE owner_id IS NULL');
  const known = new Set(existing.map((r) => r.name));
  const missing = foods.filter((f) => !known.has(f.name.toLowerCase()));
  if (!missing.length) return;
  await conn.query(
    `INSERT INTO foods (owner_id, name, category, brand, portion_grams, portion_description, kcal, protein, carbs, fat, ${MICRO_COLUMNS.join(', ')}) VALUES ?`,
    [missing.map((f) => [null, f.name, f.category, f.brand, f.portionGrams, f.portionDescription, f.kcal, f.protein, f.carbs, f.fat, ...MICROS.map((m) => f.micros?.[m.key] ?? null)])],
  );
}

/** Verificación de email con código. Las cuentas que ya existían se dan por verificadas. */
async function migrateEmailVerification(conn) {
  const [column] = await conn.query("SHOW COLUMNS FROM users LIKE 'email_verified_at'");
  if (!column.length) {
    await conn.query('ALTER TABLE users ADD COLUMN email_verified_at DATETIME NULL AFTER password_hash');
    await conn.query('UPDATE users SET email_verified_at = created_at');
  }
  await conn.query(`CREATE TABLE IF NOT EXISTS email_codes (
    id         INT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id    INT UNSIGNED NOT NULL,
    purpose    ENUM('verify','reset') NOT NULL,
    code_hash  CHAR(64) NOT NULL,
    attempts   TINYINT UNSIGNED NOT NULL DEFAULT 0,
    expires_at DATETIME NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_email_codes_user_purpose (user_id, purpose),
    CONSTRAINT fk_email_codes_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);
}

/** Códigos de un solo uso del login social (antes vivían en memoria de cada instancia). */
async function migrateOAuthLoginCodes(conn) {
  await conn.query(`CREATE TABLE IF NOT EXISTS oauth_login_codes (
    code_hash  CHAR(64) NOT NULL,
    user_id    INT UNSIGNED NOT NULL,
    challenge  CHAR(64) NOT NULL,
    expires_at DATETIME NOT NULL,
    PRIMARY KEY (code_hash),
    KEY idx_oauth_codes_expires (expires_at),
    CONSTRAINT fk_oauth_codes_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);
}

/** Código de barras y nuevas fuentes externas de alimentos (Open Food Facts, USDA). */
async function migrateFoodSources(conn) {
  const [barcode] = await conn.query("SHOW COLUMNS FROM foods LIKE 'barcode'");
  if (!barcode.length) {
    await conn.query('ALTER TABLE foods ADD COLUMN barcode VARCHAR(32) NULL AFTER vitamin_d, ADD KEY idx_foods_barcode (barcode)');
  }
  const [[source]] = await conn.query("SHOW COLUMNS FROM foods LIKE 'external_source'");
  if (!source.Type.includes('usda')) {
    await conn.query("ALTER TABLE foods MODIFY external_source ENUM('fatsecret','openfoodfacts','usda') NULL");
  }
}

/** Migración aditiva: conserva usuarios, comidas y sesiones existentes. */
export async function migrateCoaching(conn) {
  await conn.query("SET time_zone = '-03:00'");
  const sql = await fs.readFile(new URL('../../database/migrations/001-coaching.sql', import.meta.url), 'utf8');
  for (const statement of sql.split(';').map((s) => s.trim()).filter(Boolean)) await conn.query(statement);
  const [columns] = await conn.query("SHOW COLUMNS FROM workouts LIKE 'status'");
  if (!columns.length) {
    await conn.query("ALTER TABLE workouts ADD COLUMN status ENUM('planned','completed') NOT NULL DEFAULT 'completed'");
    await conn.query("UPDATE workouts SET status = 'planned' WHERE created_by <> user_id");
  }
  // No inventamos fechas de altas de clientes anteriores a esta migración.
  await conn.query(`INSERT INTO coach_assignments (athlete_id, coach_id, is_baseline)
    SELECT u.id, u.coach_id, 1 FROM users u
    WHERE u.role = 'athlete' AND u.coach_id IS NOT NULL AND NOT EXISTS
      (SELECT 1 FROM coach_assignments a WHERE a.athlete_id = u.id AND a.ended_at IS NULL)`);
}
