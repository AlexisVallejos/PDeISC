import type { RowDataPacket } from "mysql2";
import type { PublicUserRow } from "../../types/user.js";
import { pool } from "../db.js";
import { fromUsers, publicColumns } from "./userSql.js";

// usuario que ya entró antes con esa red (o undefined)
export async function findByIdentity(provider: string, providerUid: string) {
  const sql = `SELECT ${publicColumns} ${fromUsers} JOIN identidades_oauth i ON i.usuario_id = u.id WHERE i.proveedor = ? AND i.proveedor_uid = ?`;
  const [rows] = await pool.execute<PublicUserRow[]>(sql, [provider, providerUid]);
  return rows[0];
}

export async function linkIdentity(userId: number, provider: string, providerUid: string): Promise<void> {
  await pool.execute("INSERT INTO identidades_oauth (usuario_id, proveedor, proveedor_uid) VALUES (?, ?, ?)", [userId, provider, providerUid]);
}

// red con la que se creó la cuenta (la primera vinculada), o undefined si no tiene ninguna
export async function findProviderOfUser(userId: number): Promise<string | undefined> {
  const [rows] = await pool.execute<RowDataPacket[]>("SELECT proveedor FROM identidades_oauth WHERE usuario_id = ? ORDER BY id LIMIT 1", [userId]);
  return rows[0]?.proveedor;
}
