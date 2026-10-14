import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { DatabaseSync } from "node:sqlite";
import mysql from "mysql2/promise";
import { config } from "../config.js";

const mysqlPool = config.dbDriver === "mysql"
  ? mysql.createPool({ ...config.db, waitForConnections: true, connectionLimit: 10 })
  : null;

const sqliteFile = resolve(process.cwd(), config.sqliteFile);
if (config.dbDriver === "sqlite") mkdirSync(dirname(sqliteFile), { recursive: true });
const sqlite = config.dbDriver === "sqlite" ? new DatabaseSync(sqliteFile) : null;
sqlite?.exec("PRAGMA foreign_keys = ON");

// Una interfaz pequeña mantiene las consultas parametrizadas para ambos motores SQL.
export const pool = {
  async execute<T>(sql: string, values: Array<string | number | null> = []): Promise<[T]> {
    if (sqlite) {
      const statement = sqlite.prepare(sql);
      if (/^\s*SELECT\b/i.test(sql)) return [statement.all(...values) as T];
      const result = statement.run(...values);
      return [{ insertId: Number(result.lastInsertRowid), affectedRows: Number(result.changes) } as T];
    }
    const [rows] = await mysqlPool!.execute(sql, values);
    return [rows as T];
  },
  async query(sql: string): Promise<void> {
    if (sqlite) { sqlite.exec(sql); return; }
    await mysqlPool!.query(sql);
  },
  async end(): Promise<void> {
    if (sqlite) { sqlite.close(); return; }
    await mysqlPool!.end();
  },
};
