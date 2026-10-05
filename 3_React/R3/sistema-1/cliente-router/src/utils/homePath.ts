import type { User } from "@/types/user";

// ruta principal de cada tipo de usuario
export const homePath = (user: User): string => (user.rol === "administrador" ? "/usuarios" : "/");
