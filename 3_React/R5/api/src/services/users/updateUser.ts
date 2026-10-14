import type { UpdateUserInput } from "../../types/user.js";
import { pool } from "../db.js";
import { config } from "../../config.js";
import { findById } from "./findUser.js";

// solo actualiza la contraseña o el rol si vienen con valor
export async function updateUser(id: number, { nombre, email, passwordHash, rol }: UpdateUserInput) {
  const fields = ["nombre = ?", "email = ?"];
  const values: Array<string | number> = [nombre.trim(), email];

  if (passwordHash) {
    fields.push("password_hash = ?");
    values.push(passwordHash);
  }
  if (rol) {
    fields.push("rol_id = (SELECT id FROM roles WHERE nombre = ?)");
    values.push(rol);
  }

  if (config.dbDriver === "sqlite") fields.push("actualizado_en = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')");

  await pool.execute(`UPDATE usuarios SET ${fields.join(", ")} WHERE id = ?`, [...values, id]);
  return findById(id);
}
