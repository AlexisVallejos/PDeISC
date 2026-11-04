import bcrypt from 'bcryptjs';
import { query, transaction } from '../../config/db.js';
import { HttpError, badRequest, conflict, forbidden, unauthorized } from '../../utils/httpError.js';
import { EMAIL_MAX } from '../../utils/validation.js';
import { USER_COLUMNS, USER_FROM, toPublicUser } from '../users/users.mapper.js';
import { env } from '../../config/env.js';
import { mailConfigured } from '../../utils/mailer.js';
import { consumeCode, sendCode } from './emailCodes.js';
import { consumeRefreshToken, issueTokens, revokeAllForUser, revokeRefreshToken } from './tokens.js';

const BCRYPT_ROUNDS = 10;
// Hash de relleno: si el email no existe igual se compara, así el tiempo de respuesta no revela qué cuentas hay.
const DUMMY_HASH = bcrypt.hashSync('macroentreno-relleno', BCRYPT_ROUNDS);

export async function findUserById(id) {
  const [row] = await query(`SELECT ${USER_COLUMNS} FROM ${USER_FROM} WHERE u.id = ?`, [id]);
  return row;
}

async function session(row) {
  if (!row.is_active) throw forbidden('Tu cuenta está desactivada');
  return { user: toPublicUser(row), tokens: await issueTokens(row) };
}

const findByEmail = async (email) => (await query(`SELECT ${USER_COLUMNS} FROM ${USER_FROM} WHERE u.email = ?`, [email]))[0];

/**
 * Registro en dos pasos: crea la cuenta sin confirmar y manda un código al email.
 * No hay sesión hasta que se confirma (verifyEmail). Si la cuenta ya existía sin confirmar,
 * se reemplazan sus datos y se manda otro código: solo quien lee ese email puede terminarla.
 */
export async function register({ name, email, password }) {
  const existing = await findByEmail(email);
  if (existing && (existing.email_verified_at || !existing.password_hash)) throw conflict('Ya existe una cuenta con ese email');

  const hash = await bcrypt.hash(password, BCRYPT_ROUNDS);
  let id = existing?.id;
  if (id) {
    await query('UPDATE users SET name = ?, password_hash = ? WHERE id = ?', [name, hash, id]);
  } else {
    // Todo registro público crea un atleta; los otros roles los asigna un admin.
    const result = await query('INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)', [
      name,
      email,
      hash,
      'athlete',
    ]);
    id = result.insertId;
  }
  // Publicado sin servidor de correo: no hay cómo mandar el código, así que la cuenta entra directo.
  if (env.nodeEnv === 'production' && !mailConfigured()) {
    await query('UPDATE users SET email_verified_at = NOW() WHERE id = ?', [id]);
    return session(await findUserById(id));
  }
  await sendCode({ id, name, email }, 'verify');
  return { verificationRequired: true, email };
}

/** Confirma el email con el código y abre la sesión. */
export async function verifyEmail({ email, code }) {
  const row = await findByEmail(email);
  if (!row) throw new HttpError(400, 'INVALID_CODE', 'El código es incorrecto o venció. Pedí uno nuevo.');
  await consumeCode(row.id, 'verify', code);
  await query('UPDATE users SET email_verified_at = COALESCE(email_verified_at, NOW()) WHERE id = ?', [row.id]);
  return session(await findUserById(row.id));
}

/** Vuelve a mandar un código. Responde igual exista o no la cuenta (no revela emails). */
export async function resendCode({ email, purpose }) {
  const row = await findByEmail(email);
  if (!row || !row.is_active) return;
  if (purpose === 'verify' && (row.email_verified_at || !row.password_hash)) return;
  await sendCode(row, purpose);
}

/** "Olvidé mi contraseña": manda un código si la cuenta existe; la respuesta es siempre la misma. */
export async function forgotPassword({ email }) {
  const row = await findByEmail(email);
  if (!row || !row.is_active) return;
  try {
    await sendCode(row, 'reset');
  } catch (err) {
    if (err.code !== 'CODE_RECENTLY_SENT') throw err; // el aviso de espera revelaría que la cuenta existe
  }
}

/** Cambia la contraseña con el código del email, cierra las otras sesiones y abre una nueva. */
export async function resetPassword({ email, code, newPassword }) {
  const row = await findByEmail(email);
  if (!row) throw new HttpError(400, 'INVALID_CODE', 'El código es incorrecto o venció. Pedí uno nuevo.');
  await consumeCode(row.id, 'reset', code);
  const hash = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);
  // Recibir el código también prueba que el email es suyo.
  await query('UPDATE users SET password_hash = ?, email_verified_at = COALESCE(email_verified_at, NOW()) WHERE id = ?', [
    hash,
    row.id,
  ]);
  await revokeAllForUser(row.id);
  return session(await findUserById(row.id));
}

export async function login({ email, password }) {
  const [row] = await query(`SELECT ${USER_COLUMNS} FROM ${USER_FROM} WHERE u.email = ?`, [email]);
  // Mismo mensaje para email o contraseña incorrectos: no revela qué cuentas existen.
  const invalid = unauthorized('Email o contraseña incorrectos', 'INVALID_CREDENTIALS');
  if (!row) {
    await bcrypt.compare(password, DUMMY_HASH);
    throw invalid;
  }
  if (!row.password_hash) {
    await bcrypt.compare(password, DUMMY_HASH);
    throw new HttpError(
      401,
      'SOCIAL_ACCOUNT',
      'Esta cuenta se creó con una red social. Iniciá sesión con Google, Facebook o GitHub.',
    );
  }
  if (!(await bcrypt.compare(password, row.password_hash))) throw invalid;
  if (!row.email_verified_at) {
    // Contraseña correcta pero el email sin confirmar: se manda otro código para terminar el registro.
    await sendCode(row, 'verify').catch((err) => {
      if (err.code !== 'CODE_RECENTLY_SENT') throw err;
    });
    throw new HttpError(403, 'EMAIL_NOT_VERIFIED', 'Confirmá tu email: te mandamos un código para terminar el registro.');
  }
  return session(row);
}

export async function refresh(refreshToken) {
  const userId = await consumeRefreshToken(refreshToken);
  const row = await findUserById(userId);
  if (!row) throw unauthorized('El usuario ya no existe', 'REFRESH_INVALID');
  return session(row);
}

export async function logout(refreshToken, { allDevices = false, userId } = {}) {
  if (allDevices && userId) await revokeAllForUser(userId);
  else if (refreshToken) await revokeRefreshToken(refreshToken);
}

/** Nombre del proveedor recortado sin partir emojis, con un valor por defecto si queda vacío. */
const socialName = (name) => Array.from(String(name || '').trim()).slice(0, 100).join('').trim() || 'Usuario';

/**
 * Login social: busca la cuenta vinculada; si no existe, crea un atleta nuevo.
 * Solo se vincula sola a una cuenta existente con el mismo email si el proveedor lo verificó
 * y esa cuenta es un atleta sin contraseña (creado por otro login social). Si no, alguien que
 * registrara el email ajeno con su contraseña se quedaría con la cuenta de la víctima.
 */
export async function linkSocialAccount(provider, profile, { retried = false } = {}) {
  if (!profile.providerUserId) throw badRequest('El proveedor no devolvió un identificador de usuario');
  // El email del proveedor se normaliza igual que en el registro; si no entra en la columna, se ignora.
  const email = String(profile.email || '').trim().toLowerCase();
  profile = { ...profile, email: email && email.length <= EMAIL_MAX ? email : null };

  let userId;
  try {
    userId = await linkInTransaction(provider, profile);
  } catch (err) {
    // Dos callbacks a la vez para el mismo usuario: el segundo choca con la clave única y reintenta.
    if (err.code === 'ER_DUP_ENTRY' && !retried) return linkSocialAccount(provider, profile, { retried: true });
    throw err;
  }

  const row = await findUserById(userId);
  if (!row.is_active) throw forbidden('Tu cuenta está desactivada');
  return userId;
}

function linkInTransaction(provider, profile) {
  return transaction(async (conn) => {
    const [[linked]] = await conn.query(
      'SELECT user_id FROM social_accounts WHERE provider = ? AND provider_user_id = ?',
      [provider, profile.providerUserId],
    );
    if (linked) return linked.user_id;

    let id;
    if (profile.email) {
      const [[byEmail]] = await conn.query('SELECT id, role, password_hash FROM users WHERE email = ?', [profile.email]);
      if (byEmail) {
        if (!profile.emailVerified || byEmail.password_hash || byEmail.role !== 'athlete') {
          throw conflict('Ya existe una cuenta con ese email. Iniciá sesión con tu email y contraseña.');
        }
        id = byEmail.id;
      }
    }
    if (!id) {
      const [created] = await conn.query(
        'INSERT INTO users (name, email, email_verified_at, avatar_url, role) VALUES (?, ?, IF(?, NOW(), NULL), ?, ?)',
        [socialName(profile.name), profile.email, Boolean(profile.email && profile.emailVerified), profile.avatarUrl, 'athlete'],
      );
      id = created.insertId;
    }
    await conn.query('INSERT INTO social_accounts (user_id, provider, provider_user_id) VALUES (?, ?, ?)', [
      id,
      provider,
      profile.providerUserId,
    ]);
    return id;
  });
}

export async function sessionForUser(userId) {
  return session(await findUserById(userId));
}

export async function changePassword(userId, { currentPassword, newPassword }) {
  const [row] = await query('SELECT password_hash FROM users WHERE id = ?', [userId]);
  // Si la cuenta es solo social puede definir una contraseña sin dar la anterior.
  if (row.password_hash) {
    if (!currentPassword || !(await bcrypt.compare(currentPassword, row.password_hash))) {
      throw new HttpError(400, 'INVALID_PASSWORD', 'La contraseña actual no es correcta');
    }
  }
  const hash = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);
  await query('UPDATE users SET password_hash = ? WHERE id = ?', [hash, userId]);
  await revokeAllForUser(userId);
}
