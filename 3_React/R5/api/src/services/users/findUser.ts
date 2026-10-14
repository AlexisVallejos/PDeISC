import type { PublicUserRow, UserWithHashRow } from "../../types/user.js";
import { pool } from "../db.js";
import { fromUsers, publicColumns } from "./userSql.js";

// incluye password_hash: solo para usar en el login
export async function findByEmail(email: string) {
  const sql = `SELECT ${publicColumns}, u.password_hash ${fromUsers} WHERE u.email = ?`;
  const [rows] = await pool.execute<UserWithHashRow[]>(sql, [email]);
  return rows[0];
}

export async function findById(id: number) {
  const [rows] = await pool.execute<PublicUserRow[]>(`SELECT ${publicColumns} ${fromUsers} WHERE u.id = ?`, [id]);
  return rows[0];
}
