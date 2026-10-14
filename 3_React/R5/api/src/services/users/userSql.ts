// partes de SQL que se repiten en las consultas de usuarios
export const publicColumns = "u.id, u.nombre, u.email, r.nombre AS rol, u.creado_en, u.actualizado_en";

export const fromUsers = "FROM usuarios u JOIN roles r ON r.id = u.rol_id";
