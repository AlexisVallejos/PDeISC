export interface Usuario {
  id: number;
  nombre: string;
  usuario: string;
  email: string;
  rol: string;
  /** Fecha ISO del ingreso anterior, o null si es el primer ingreso. */
  ultimoAcceso: string | null;
}

export interface LoginResponse {
  ok: boolean;
  mensaje: string;
  usuario?: Usuario;
}
