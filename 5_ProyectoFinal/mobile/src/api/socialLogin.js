import * as Crypto from 'expo-crypto';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { Platform } from 'react-native';
import { colors } from '../theme';
import { API_URL, ApiError, publicApi } from './client';
import { authApi } from './endpoints';

// Web con la ventana emergente bloqueada: el login va en la misma pestaña y el verifier espera acá la vuelta.
const VERIFIER_KEY = 'macroentreno.oauthVerifier';

const toHex = (bytes) => Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');

/** Par PKCE: code_verifier y su SHA-256 en hexadecimal. */
async function createPkce() {
  const verifier = toHex(Crypto.getRandomBytes(32));
  const challenge = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, verifier, {
    encoding: Crypto.CryptoEncoding.HEX,
  });
  return { verifier, challenge };
}

// El par se calcula por adelantado para que el botón responda al instante.
let nextPkce = null;
const preparePkce = () =>
  createPkce()
    .then((pkce) => {
      nextPkce = pkce;
    })
    .catch(() => {});
preparePkce();

/** Qué proveedores tiene configurados el backend: [{ id, label, configured }]. */
export const fetchProviders = () => publicApi('/auth/oauth/providers').then((json) => json.data);

/**
 * Login social completo, sin salir de la app:
 * 1. Toma un code_verifier (PKCE) y su SHA-256, ya calculados.
 * 2. Abre el backend en una ventana emergente encima de la app; el backend redirige a
 *    Google/Facebook/GitHub. Si la cuenta no existe, se crea; si ya existe con ese email, se vincula.
 *    - Android: Custom Tab dentro de la propia app (no abre Chrome aparte ni otra entrada en "recientes").
 *      Si en medio del login se va a otra app y se vuelve tocando el ícono, Android cierra la pestaña:
 *      volver desde "recientes" la conserva.
 *    - iOS: hoja de inicio de sesión del sistema (ASWebAuthenticationSession).
 *    - Web: ventana emergente (popup) chica encima de la página.
 *    Google prohíbe iniciar sesión dentro de un WebView propio: por eso es el navegador del sistema.
 * 3. El backend vuelve a la app (macroentreno://oauth-callback?code=...) y la ventana se cierra sola.
 * 4. Se canjea el código + verifier por los JWT de la API.
 */
export async function socialLogin(provider) {
  const isWeb = Platform.OS === 'web';
  // Web: la ventana se abre YA, en el mismo toque y antes de cualquier await; si no, el navegador la bloquea.
  const popup = isWeb ? openCenteredPopup('about:blank') : null;
  // Cada par se usa una sola vez: se toma el preparado y se calcula el del próximo intento.
  let pkce = nextPkce;
  if (!pkce) {
    try {
      pkce = await createPkce();
    } catch (err) {
      popup?.close();
      throw err;
    }
  }
  const { verifier, challenge } = pkce;
  nextPkce = null;
  preparePkce();
  // En el APK: macroentreno://oauth-callback · En Expo Go: exp://<ip>:8081/--/oauth-callback
  const redirectUri = Linking.createURL('oauth-callback');
  // En la web publicada la API es relativa (/api): el navegador de login necesita la URL completa.
  const apiBase = API_URL.startsWith('/') ? `${globalThis.location?.origin ?? ''}${API_URL}` : API_URL;
  const startUrl = (redirect) =>
    `${apiBase}/auth/oauth/${provider}/start?${new URLSearchParams({ redirect_uri: redirect, code_challenge: challenge })}`;

  if (isWeb) return webPopupLogin(popup, startUrl, verifier);

  const result = await WebBrowser.openAuthSessionAsync(startUrl(redirectUri), redirectUri, {
    createTask: false, // Android: la pestaña de login se abre dentro de la tarea de la app
    enableBarCollapsing: true,
    showTitle: true,
    toolbarColor: colors.background,
    controlsColor: colors.primary,
  });
  if (result.type !== 'success') {
    throw new ApiError('Se canceló el inicio de sesión', { code: 'CANCELLED' });
  }
  const { queryParams = {} } = Linking.parse(result.url);
  return exchange(queryParams, verifier);
}

// --- Web: ventana emergente ---
// La ventana vuelve a /oauth-callback?popup=<id del intento> y avisa a esta pestaña por BroadcastChannel
// (y por localStorage en navegadores viejos). No depende de window.opener ni de popup.closed: Google
// corta el vínculo entre las ventanas por seguridad (Cross-Origin-Opener-Policy) y desde ese momento
// la ventana "parece" cerrada aunque el usuario siga escribiendo. Por eso el intento espera hasta que
// llega el resultado, vence, o el usuario toca "Cancelar" (cancelSocialLogin).
const POPUP_NAME = 'macroentreno-oauth';
const POPUP_CHANNEL = 'macroentreno-oauth';
const POPUP_RESULT_KEY = 'macroentreno.oauthResult';
const POPUP_TIMEOUT_MS = 10 * 60 * 1000; // lo que dura el "state" firmado del backend

let waiter = null; // intento en curso: { id, verifier, resolve, reject, timer }
let listening = false;

function settle(error) {
  if (!waiter) return;
  clearTimeout(waiter.timer);
  const { reject } = waiter;
  waiter = null;
  reject(error);
}

/** Cancela el login social web en curso (botón "Cancelar" o cerrar la ventana a mano). */
export function cancelSocialLogin() {
  settle(new ApiError('Se canceló el inicio de sesión', { code: 'CANCELLED' }));
}

function handlePopupResult(data) {
  if (!data || typeof data !== 'object') return;
  // Solo el intento que abrió esa ventana: otra pestaña de la app o un intento viejo no gastan el código.
  if (!waiter || data.popup !== waiter.id) return;
  const { verifier, resolve, reject, timer } = waiter;
  clearTimeout(timer);
  waiter = null;
  const { popup: _id, ...params } = data;
  exchange(params, verifier).then(resolve, reject);
}

function listenForPopup() {
  if (listening) return;
  listening = true;
  if (typeof globalThis.BroadcastChannel === 'function') {
    new globalThis.BroadcastChannel(POPUP_CHANNEL).onmessage = (event) => handlePopupResult(event.data);
  }
  globalThis.addEventListener?.('storage', (event) => {
    if (event.key !== POPUP_RESULT_KEY || !event.newValue) return;
    try {
      handlePopupResult(JSON.parse(event.newValue));
    } catch {
      // valor ajeno: se ignora
    }
  });
}

function openCenteredPopup(url) {
  const w = 480;
  const h = 680;
  const win = globalThis;
  const left = Math.max(0, (win.screenX ?? 0) + ((win.outerWidth ?? w) - w) / 2);
  const top = Math.max(0, (win.screenY ?? 0) + ((win.outerHeight ?? h) - h) / 2);
  return win.open(url, POPUP_NAME, `popup=yes,width=${w},height=${h},left=${Math.round(left)},top=${Math.round(top)}`);
}

function webPopupLogin(popup, startUrl, verifier) {
  listenForPopup();
  cancelSocialLogin(); // un intento nuevo reemplaza al anterior

  if (!popup) {
    // El navegador bloqueó la ventana emergente: se hace el login en la misma pestaña.
    globalThis.sessionStorage.setItem(VERIFIER_KEY, verifier);
    globalThis.location.assign(startUrl(Linking.createURL('oauth-callback')));
    return new Promise(() => {}); // la página se va: no hay nada que devolver
  }
  const id = toHex(Crypto.getRandomBytes(8));
  popup.location.href = startUrl(`${globalThis.location.origin}/oauth-callback?popup=${id}`);
  popup.focus?.();

  return new Promise((resolve, reject) => {
    const timer = setTimeout(
      () => settle(new ApiError('El inicio de sesión venció: probá de nuevo', { code: 'CANCELLED' })),
      POPUP_TIMEOUT_MS,
    );
    waiter = { id, verifier, resolve, reject, timer };
  });
}

/**
 * Corre dentro de la ventana emergente cuando vuelve a /oauth-callback?popup=<id>:
 * le pasa el resultado (con el id del intento) a la pestaña de la app y se cierra.
 */
export function relayPopupResult(queryParams) {
  const data = Object.fromEntries(Object.entries(queryParams).map(([k, v]) => [k, String(Array.isArray(v) ? v[0] : v)]));
  if (typeof globalThis.BroadcastChannel === 'function') {
    const channel = new globalThis.BroadcastChannel(POPUP_CHANNEL);
    channel.postMessage(data);
    channel.close();
  } else {
    globalThis.localStorage.setItem(POPUP_RESULT_KEY, JSON.stringify(data));
    globalThis.localStorage.removeItem(POPUP_RESULT_KEY); // el evento "storage" ya salió: no queda guardado
  }
  globalThis.close();
}

/** Web sin ventana emergente: la pestaña volvió a /oauth-callback con ?code=... (o ?error=...). */
export function completeWebSocialLogin(queryParams) {
  const verifier = globalThis.sessionStorage.getItem(VERIFIER_KEY);
  globalThis.sessionStorage.removeItem(VERIFIER_KEY);
  if (!verifier && !queryParams.error && !queryParams.verify) {
    return Promise.reject(new ApiError('El inicio de sesión venció: probá de nuevo', { code: 'CANCELLED' }));
  }
  return exchange(queryParams, verifier);
}

// Textos propios por código: el mensaje no se lee de la URL, que cualquiera podría armar.
const SOCIAL_ERRORS = {
  cancelled: 'Se canceló el inicio de sesión',
  CONFLICT: 'Ya existe una cuenta con ese email. Iniciá sesión con tu email y contraseña.',
  FORBIDDEN: 'Tu cuenta está desactivada',
};

async function exchange(queryParams, verifier) {
  // Cuenta nueva con email: primero hay que confirmar el código que llegó al correo.
  if (queryParams.verify) {
    throw new ApiError('Te mandamos un código a tu email para activar la cuenta.', {
      code: 'EMAIL_NOT_VERIFIED',
      details: [{ field: 'email', message: String(queryParams.verify) }],
    });
  }
  if (queryParams.error || !queryParams.code) {
    const code = String(queryParams.error || 'SOCIAL_LOGIN_FAILED');
    throw new ApiError(SOCIAL_ERRORS[code] ?? 'No se pudo iniciar sesión con la red social. Probá de nuevo.', { code });
  }
  return authApi.oauthExchange({ code: String(queryParams.code), codeVerifier: verifier });
}
