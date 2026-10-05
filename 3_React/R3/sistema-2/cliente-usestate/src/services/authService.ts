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
