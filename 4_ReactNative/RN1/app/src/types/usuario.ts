export interface Usuario {
  id: number;
  nombre: string;
  usuario: string;
  email: string;
  rol: string;
  /** Fecha ISO del ingreso anterior, o null si es el primer ingreso. */
  ultimoAcceso: string | null;
}

/** Respuesta simple de los endpoints de recuperación de contraseña. */
export interface AccionResponse {
  ok: boolean;
  mensaje: string;
}

export interface LoginResponse {
  ok: boolean;
  mensaje: string;
  usuario?: Usuario;
}
