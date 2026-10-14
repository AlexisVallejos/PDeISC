import type { AxiosResponse } from "axios";
import type { Rol, User } from "@/types/user";
import { api } from "./api";

export interface UserWriteValues {
  nombre: string;
  email: string;
  password: string;
  rol: Rol;
}

export async function listUsersRequest(search = ""): Promise<User[]> {
  const { data } = await api.post<{ users: User[] }>("/usuarios/listar", { search });
  return data.users;
}

export const createUserRequest = (values: UserWriteValues): Promise<AxiosResponse<{ user: User }>> =>
  api.post("/usuarios/crear", values);

export const updateUserRequest = (values: UserWriteValues & { id: number }): Promise<AxiosResponse<{ user: User }>> =>
  api.post("/usuarios/actualizar", values);

export const deleteUserRequest = (id: number): Promise<AxiosResponse<{ message: string }>> =>
  api.post("/usuarios/eliminar", { id });
