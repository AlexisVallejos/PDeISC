import crypto from 'node:crypto';
import { query, transaction } from '../../config/db.js';
import { HttpError } from '../../utils/httpError.js';
import { sendMail } from '../../utils/mailer.js';

/**
 * Códigos de 6 dígitos que llegan por email: confirmar la cuenta ('verify') y
 * recuperar la contraseña ('reset'). Se guarda solo su hash, vencen a los 10 minutos
 * y se queman después de 5 intentos fallidos.
 */
const TTL_MINUTES = 10;
const MAX_ATTEMPTS = 5;
const RESEND_SECONDS = 60;

const hashCode = (userId, purpose, code) => crypto.createHash('sha256').update(`${userId}:${purpose}:${code}`).digest('hex');

const MESSAGES = {
  verify: {
    subject: 'Tu código para confirmar la cuenta de MacroEntreno',
    intro: 'Usá este código para confirmar tu email y terminar el registro:',
  },
  reset: {
    subject: 'Tu código para cambiar la contraseña de MacroEntreno',
    intro: 'Usá este código para elegir una contraseña nueva. Si no lo pediste, ignorá este email:',
  },
};

/** Genera un código nuevo (invalida los anteriores del mismo tipo) y lo manda por email. */
export async function sendCode(user, purpose) {
  const [recent] = await query(
    'SELECT 1 AS yes FROM email_codes WHERE user_id = ? AND purpose = ? AND created_at > NOW() - INTERVAL ? SECOND',
    [user.id, purpose, RESEND_SECONDS],
  );
  if (recent) throw new HttpError(429, 'CODE_RECENTLY_SENT', 'Ya te mandamos un código hace menos de un minuto: revisá tu email');

  const code = String(crypto.randomInt(0, 1_000_000)).padStart(6, '0');
  await query('DELETE FROM email_codes WHERE user_id = ? AND purpose = ?', [user.id, purpose]);
  await query(
    'INSERT INTO email_codes (user_id, purpose, code_hash, expires_at) VALUES (?, ?, ?, NOW() + INTERVAL ? MINUTE)',
    [user.id, purpose, hashCode(user.id, purpose, code), TTL_MINUTES],
  );
  const { subject, intro } = MESSAGES[purpose];
  await sendMail({
    to: user.email,
    subject,
    text: `Hola ${user.name}:\n\n${intro}\n\n${code}\n\nVence en ${TTL_MINUTES} minutos.\n\nMacroEntreno`,
    html: `<p>Hola ${escapeHtml(user.name)}:</p><p>${intro}</p><p style="font-size:28px;font-weight:700;letter-spacing:6px">${code}</p><p>Vence en ${TTL_MINUTES} minutos.</p><p>MacroEntreno</p>`,
  });
}

/** Comprueba el código y lo consume. Un código equivocado suma un intento. */
export async function consumeCode(userId, purpose, code) {
  const ok = await transaction(async (conn) => {
    const [[row]] = await conn.query(
      'SELECT id, code_hash, attempts, expires_at > NOW() AS alive FROM email_codes WHERE user_id = ? AND purpose = ? FOR UPDATE',
      [userId, purpose],
    );
    if (!row || !row.alive || row.attempts >= MAX_ATTEMPTS) return false;
    if (row.code_hash !== hashCode(userId, purpose, code)) {
      await conn.query('UPDATE email_codes SET attempts = attempts + 1 WHERE id = ?', [row.id]);
      return false;
    }
    await conn.query('DELETE FROM email_codes WHERE id = ?', [row.id]);
    return true;
  });
  if (!ok) throw new HttpError(400, 'INVALID_CODE', 'El código es incorrecto o venció. Pedí uno nuevo.');
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}
