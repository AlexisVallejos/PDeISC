import "dotenv/config";
import { readFile } from "node:fs/promises";
import { config, requireConfig } from "../src/config.js";
import { pool } from "../src/services/db.js";

requireConfig();
const sql = await readFile(new URL(config.dbDriver === "sqlite" ? "./schema.sqlite.sql" : "./schema.sql", import.meta.url), "utf8");
if (config.dbDriver === "sqlite") await pool.query(sql);
else for (const statement of sql.split(";").map((item) => item.trim()).filter(Boolean)) await pool.query(statement);
console.log("Esquema de base de datos creado/verificado.");
await pool.end();
