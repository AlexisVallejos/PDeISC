export type Rol = "usuario" | "administrador";

export interface User {
  id: number;
  nombre: string;
  email: string;
  rol: Rol;
  creado_en: string;
  actualizado_en: string;
}

export interface UserFormValues {
  nombre: string;
  email: string;
  password: string;
  rol: Rol;
}
