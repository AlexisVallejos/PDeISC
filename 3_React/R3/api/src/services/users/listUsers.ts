import type { PublicUserRow } from "../../types/user.js";
import { pool } from "../db.js";
import { fromUsers, publicColumns } from "./userSql.js";

export async function listUsers(search = "") {
  const term = `%${search.trim()}%`;
  const sql = `SELECT ${publicColumns} ${fromUsers} WHERE u.nombre LIKE ? OR u.email LIKE ? ORDER BY u.creado_en DESC`;
  const [rows] = await pool.execute<PublicUserRow[]>(sql, [term, term]);
  return rows;
}
