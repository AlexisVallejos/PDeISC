import type { OAuthCallbackValues, ProviderStatus } from "@/types/oauth";
import type { User } from "@/types/user";
import { api } from "./api";

export interface AuthValues {
  nombre?: string;
  email: string;
  password: string;
}

export interface ProfileValues {
  nombre: string;
  email: string;
  password: string;
}

// cada función devuelve directamente el usuario (o nada)
export async function sessionRequest(): Promise<User> {
  const { data } = await api.post<{ user: User }>("/auth/sesion");
  return data.user;
}

export async function loginRequest(values: AuthValues): Promise<User> {
  const { data } = await api.post<{ user: User }>("/auth/login", values);
  return data.user;
}

export async function registerRequest(values: AuthValues): Promise<User> {
  const { data } = await api.post<{ user: User }>("/auth/registro", values);
  return data.user;
}

export async function updateProfileRequest(values: ProfileValues): Promise<User> {
  const { data } = await api.post<{ user: User }>("/auth/perfil", values);
  return data.user;
}

export async function logoutRequest(): Promise<void> {
  await api.post("/auth/logout");
}

// ingreso con redes: 1) pido la dirección del proveedor, 2) al volver canjeo el código por la sesión
export async function oauthUrlRequest(provider: string): Promise<string> {
  const { data } = await api.post<{ url: string }>("/auth/oauth/url", { provider });
  return data.url;
}

export async function oauthCallbackRequest(values: OAuthCallbackValues): Promise<User> {
  const { data } = await api.post<{ user: User }>("/auth/oauth/callback", values);
  return data.user;
}

// qué redes están habilitadas en el servidor
export async function oauthProvidersRequest(): Promise<ProviderStatus[]> {
  const { data } = await api.post<{ providers: ProviderStatus[] }>("/auth/oauth/proveedores");
  return data.providers;
}
