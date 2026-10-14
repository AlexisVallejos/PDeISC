import { pool } from "../db.js";

export async function removeUser(id: number): Promise<void> {
  await pool.execute("DELETE FROM usuarios WHERE id = ?", [id]);
}
