import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

/**
 * Persistencia de la sesión. En el celular usa el almacenamiento cifrado del sistema
 * (Keychain / Keystore); en web, localStorage (solo para pruebas).
 *
 * "Recordarme" desmarcado: los tokens no se guardan en el disco. En el celular quedan solo en
 * memoria (al cerrar la app hay que volver a entrar); en la web, en sessionStorage (dura lo que la pestaña).
 */
const TOKENS_KEY = 'macroentreno.tokens';
const USER_KEY = 'macroentreno.user';
const LOGIN_PREFS_KEY = 'macroentreno.loginPrefs';

const browserStore = (getStorage) => ({
  getItemAsync: async (k) => getStorage()?.getItem(k) ?? null,
  setItemAsync: async (k, v) => getStorage()?.setItem(k, v),
  deleteItemAsync: async (k) => getStorage()?.removeItem(k),
});
const isWeb = Platform.OS === 'web';
const store = isWeb ? browserStore(() => globalThis.localStorage) : SecureStore;
// Sesión que no se recuerda: en la web vive en la pestaña; en el celular, solo en memoria (no hay store).
const tabStore = isWeb ? browserStore(() => globalThis.sessionStorage) : null;

async function read(key, from = store) {
  try {
    const raw = await from.getItemAsync(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

const removeQuietly = (from, key) => from?.deleteItemAsync(key).catch(() => {});

/** Devuelve { tokens, remember } o null si no hay sesión guardada. */
export async function loadSession() {
  const saved = await read(TOKENS_KEY);
  if (saved) return { tokens: saved, remember: true };
  const tab = tabStore ? await read(TOKENS_KEY, tabStore) : null;
  return tab ? { tokens: tab, remember: false } : null;
}

export async function saveSession(tokens, { remember = true } = {}) {
  const value = JSON.stringify(tokens);
  if (remember) {
    await store.setItemAsync(TOKENS_KEY, value);
    await removeQuietly(tabStore, TOKENS_KEY);
  } else {
    await removeQuietly(store, TOKENS_KEY);
    await tabStore?.setItemAsync(TOKENS_KEY, value);
  }
}

/** Copia del usuario para poder abrir la app sin conexión (solo si la sesión se recuerda). */
export const loadCachedUser = () => read(USER_KEY);
export const saveCachedUser = (user, { remember = true } = {}) =>
  remember ? store.setItemAsync(USER_KEY, JSON.stringify(user)) : removeQuietly(store, USER_KEY);

export async function clearSession() {
  await Promise.all([removeQuietly(store, TOKENS_KEY), removeQuietly(store, USER_KEY), removeQuietly(tabStore, TOKENS_KEY)]);
}

/** Preferencias del login: si "Recordarme" está marcado y el último email usado. */
export async function loadLoginPrefs() {
  const prefs = await read(LOGIN_PREFS_KEY);
  return { remember: prefs?.remember !== false, email: typeof prefs?.email === 'string' ? prefs.email : '' };
}

export async function saveLoginPrefs({ remember, email }) {
  try {
    // Sin "Recordarme" tampoco queda el email guardado.
    await store.setItemAsync(LOGIN_PREFS_KEY, JSON.stringify({ remember, email: remember ? email || '' : '' }));
  } catch {
    // No poder guardar la preferencia no impide entrar.
  }
}
