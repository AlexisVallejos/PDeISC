import "dotenv/config";
import { readFile } from "node:fs/promises";
import { requireConfig } from "../src/config.js";
import { pool } from "../src/services/db.js";

requireConfig();
const sql = await readFile(new URL("./schema.sql", import.meta.url), "utf8");
for (const statement of sql.split(";").map((item) => item.trim()).filter(Boolean)) await pool.query(statement);
console.log("Esquema de base de datos creado/verificado.");
await pool.end();
