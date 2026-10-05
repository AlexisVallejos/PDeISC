import type { RowDataPacket } from "mysql2";

export type Rol = "usuario" | "administrador";

export interface PublicUser {
  id: number;
  nombre: string;
  email: string;
  rol: Rol;
  creado_en: string;
  actualizado_en: string;
}

export interface UserWithHash extends PublicUser {
  password_hash: string;
}

export interface PublicUserRow extends PublicUser, RowDataPacket {}
export interface UserWithHashRow extends UserWithHash, RowDataPacket {}

export interface NewUserInput {
  nombre: string;
  email: string;
  passwordHash: string;
  rol?: Rol;
}

export interface UpdateUserInput {
  nombre: string;
  email: string;
  passwordHash?: string;
  rol?: Rol;
}
