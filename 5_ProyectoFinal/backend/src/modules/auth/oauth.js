import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';
import { query, transaction } from '../../config/db.js';
import { env } from '../../config/env.js';
import { HttpError, badRequest, unauthorized } from '../../utils/httpError.js';
import { socialProviders } from './socialProviders.js';
import { JWT_ALGORITHMS } from './tokens.js';

/**
 * Flujo de login social:
 *  1. La app abre en el navegador  GET /api/auth/oauth/:provider/start?redirect_uri=...&code_challenge=...
 *  2. El backend redirige al proveedor; el usuario inicia sesión y el proveedor vuelve a
 *     GET /api/auth/oauth/:provider/callback?code=...&state=...
 *  3. El backend obtiene el perfil, crea/vincula el usuario y redirige a la app con un
 *     código de un solo uso:  macroentreno://oauth-callback?code=XYZ
 *  4. La app canjea ese código (POST /api/auth/oauth/exchange) enviando el code_verifier
 *     original (PKCE), así ninguna otra app que intercepte el deep link puede usarlo.
 */

// Los códigos se guardan en la base (solo su hash): en Vercel el callback y el canje
// pueden caer en instancias distintas.
const LOGIN_CODE_TTL_SECONDS = 120;

const sha256Hex = (value) => crypto.createHash('sha256').update(value).digest('hex');

export function getProvider(name) {
  const provider = socialProviders[name];
  if (!provider) throw badRequest('Proveedor no soportado. Usá google, facebook o github');
  if (!provider.isConfigured()) {
    throw new HttpError(
      501,
      'PROVIDER_NOT_CONFIGURED',
      `El inicio de sesión con ${provider.label} no está configurado en el servidor`,
    );
  }
  return provider;
}

/**
 * Solo se devuelve el control a la app: su origen web o macroentreno://oauth-callback.
 * exp:// y exps:// (Expo Go) se permiten solo si están en APP_REDIRECT_SCHEMES (desarrollo).
 */
export function assertAppRedirect(uri, webOrigin) {
  let url;
  try {
    url = new URL(uri);
  } catch {
    throw badRequest('redirect_uri inválida');
  }
  // La app web se sirve en el mismo dominio que la API: puede volver a su propio origen.
  if (webOrigin && url.origin === webOrigin) return;
  const scheme = url.protocol.replace(':', '');
  if (!env.oauth.appSchemes.includes(scheme)) {
    throw badRequest(`redirect_uri debe usar uno de estos esquemas: ${env.oauth.appSchemes.join(', ')}`);
  }
  // El esquema propio solo vuelve a la pantalla de login social, nunca a otro destino.
  if (scheme === 'macroentreno' && `${url.host}${url.pathname}`.replace(/\/$/, '') !== 'oauth-callback') {
    throw badRequest('redirect_uri inválida');
  }
}

/** Origen público de la API (y de la app web, que se publica en el mismo dominio). */
export const publicOrigin = (req) => new URL(env.oauth.publicApiUrl || `${req.protocol}://${req.get('host')}`).origin;

export const callbackUrl = (req, providerName) =>
  `${env.oauth.publicApiUrl || `${req.protocol}://${req.get('host')}`}/api/auth/oauth/${providerName}/callback`;

/** El "state" viaja firmado: proveedor, URI de la app y desafío PKCE. Vence en 10 minutos. */
export const signState = (data) => jwt.sign({ ...data, type: 'oauth_state' }, env.jwt.accessSecret, { expiresIn: '10m' });

export function verifyState(state) {
  try {
    const payload = jwt.verify(state, env.jwt.accessSecret, { algorithms: JWT_ALGORITHMS });
    if (payload.type !== 'oauth_state') throw new Error('tipo');
    return payload;
  } catch {
    throw badRequest('La sesión de inicio expiró o es inválida; volvé a intentarlo');
  }
}

export async function createLoginCode(userId, challenge) {
  await query('DELETE FROM oauth_login_codes WHERE expires_at < NOW()');
  const code = crypto.randomBytes(32).toString('hex');
  await query(
    'INSERT INTO oauth_login_codes (code_hash, user_id, challenge, expires_at) VALUES (?, ?, ?, NOW() + INTERVAL ? SECOND)',
    [sha256Hex(code), userId, challenge, LOGIN_CODE_TTL_SECONDS],
  );
  return code;
}

export async function consumeLoginCode(code, codeVerifier) {
  // Un solo uso, aunque falle la verificación: se borra dentro de la misma transacción.
  const data = await transaction(async (conn) => {
    const [[row]] = await conn.query(
      'SELECT user_id, challenge, expires_at > NOW() AS alive FROM oauth_login_codes WHERE code_hash = ? FOR UPDATE',
      [sha256Hex(code)],
    );
    if (row) await conn.query('DELETE FROM oauth_login_codes WHERE code_hash = ?', [sha256Hex(code)]);
    return row;
  });
  if (!data || !data.alive || sha256Hex(codeVerifier) !== data.challenge) {
    throw unauthorized('Código de inicio de sesión inválido o vencido', 'SOCIAL_LOGIN_FAILED');
  }
  return data.user_id;
}

export function appRedirect(appUri, params) {
  const url = new URL(appUri);
  for (const [key, value] of Object.entries(params)) url.searchParams.set(key, value);
  return url.toString();
}
