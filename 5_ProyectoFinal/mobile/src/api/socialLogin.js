import * as Crypto from 'expo-crypto';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { Platform } from 'react-native';
import { API_URL, ApiError, publicApi } from './client';
import { authApi } from './endpoints';

// En la web el login es una redirección en la misma pestaña: el verifier espera acá la vuelta.
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
 * Login social completo:
 * 1. Toma un code_verifier (PKCE) y su SHA-256, ya calculados.
 * 2. Abre el backend, que redirige a Google/Facebook/GitHub. Si la cuenta no existe, se crea.
 * 3. El backend vuelve a la app (macroentreno://oauth-callback?code=...).
 * 4. Se canjea el código + verifier por los JWT de la API.
 * En la web la pestaña entera va al proveedor y vuelve a /oauth-callback (ver completeWebSocialLogin).
 */
export async function socialLogin(provider) {
  // Cada par se usa una sola vez: se toma el preparado y se calcula el del próximo intento.
  const { verifier, challenge } = nextPkce ?? (await createPkce());
  nextPkce = null;
  preparePkce();
  // En el APK: macroentreno://oauth-callback · En Expo Go: exp://<ip>:8081/--/oauth-callback
  const redirectUri = Linking.createURL('oauth-callback');
  // En la web publicada la API es relativa (/api): el navegador de login necesita la URL completa.
  const apiBase = API_URL.startsWith('/') ? `${globalThis.location?.origin ?? ''}${API_URL}` : API_URL;
  const startUrl = `${apiBase}/auth/oauth/${provider}/start?${new URLSearchParams({
    redirect_uri: redirectUri,
    code_challenge: challenge,
  })}`;

  if (Platform.OS === 'web') {
    globalThis.sessionStorage.setItem(VERIFIER_KEY, verifier);
    globalThis.location.assign(startUrl);
    return new Promise(() => {}); // la página se va: no hay nada que devolver
  }

  const result = await WebBrowser.openAuthSessionAsync(startUrl, redirectUri);
  if (result.type !== 'success') {
    throw new ApiError('Se canceló el inicio de sesión', { code: 'CANCELLED' });
  }
  const { queryParams = {} } = Linking.parse(result.url);
  return exchange(queryParams, verifier);
}

/** Web: la pestaña volvió a /oauth-callback con ?code=... (o ?error=...). */
export function completeWebSocialLogin(queryParams) {
  const verifier = globalThis.sessionStorage.getItem(VERIFIER_KEY);
  globalThis.sessionStorage.removeItem(VERIFIER_KEY);
  if (!verifier && !queryParams.error) {
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
  if (queryParams.error || !queryParams.code) {
    const code = String(queryParams.error || 'SOCIAL_LOGIN_FAILED');
    throw new ApiError(SOCIAL_ERRORS[code] ?? 'No se pudo iniciar sesión con la red social. Probá de nuevo.', { code });
  }
  return authApi.oauthExchange({ code: String(queryParams.code), codeVerifier: verifier });
}
