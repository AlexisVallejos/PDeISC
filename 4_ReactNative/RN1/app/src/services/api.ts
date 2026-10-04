import Constants from 'expo-constants';
import { Platform } from 'react-native';
import type { LoginResponse } from '../types/usuario';

const API_PORT = 3000;

/**
 * URL de la API:
 * 1. EXPO_PUBLIC_API_URL si está definida (archivo .env).
 * 2. La IP de la PC que corre Expo (sirve para celular físico con Expo Go).
 * 3. 10.0.2.2 en emulador Android, localhost en web / iOS simulator.
 */
function resolveApiUrl(): string {
  const fromEnv = process.env.EXPO_PUBLIC_API_URL;
  if (fromEnv) return fromEnv.replace(/\/$/, '');

  if (Platform.OS === 'web') {
    // En desarrollo (expo start, puerto 8081) la API corre aparte; en producción
    // (Easypanel / Docker) la web la sirve la misma API, así que es el mismo origen.
    const { hostname, port, origin } = window.location;
    return port === '8081' ? `http://${hostname}:${API_PORT}` : origin;
  }

  const host = Constants.expoConfig?.hostUri?.split(':')[0];
  if (host && host !== 'localhost' && host !== '127.0.0.1') return `http://${host}:${API_PORT}`;

  return Platform.OS === 'android' ? `http://10.0.2.2:${API_PORT}` : `http://localhost:${API_PORT}`;
}

export const API_URL = resolveApiUrl();

export async function login(usuario: string, clave: string): Promise<LoginResponse> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch(`${API_URL}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario, clave }),
      signal: controller.signal,
    });
    return (await res.json()) as LoginResponse;
  } catch {
    return { ok: false, mensaje: `No se pudo conectar con el servidor (${API_URL})` };
  } finally {
    clearTimeout(timer);
  }
}
