import "dotenv/config";
import { readFile } from "node:fs/promises";
import mysql from "mysql2/promise";
import { config, requireConfig } from "../src/config.js";
import { pool } from "../src/services/db.js";
import { createUser } from "../src/services/users/createUser.js";
import { findByEmail } from "../src/services/users/findUser.js";
import { hashPassword } from "../src/utils/passwords.js";

requireConfig();
const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;
if (!adminEmail || !adminPassword) throw new Error("Definí ADMIN_EMAIL y ADMIN_PASSWORD en .env");

if (config.dbDriver === "mysql") {
  const server = await mysql.createConnection({ host: config.db.host, port: config.db.port, user: config.db.user, password: config.db.password });
  await server.query(`CREATE DATABASE IF NOT EXISTS \`${config.db.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
  await server.end();
}

const schema = await readFile(new URL(config.dbDriver === "sqlite" ? "./schema.sqlite.sql" : "./schema.sql", import.meta.url), "utf8");
if (config.dbDriver === "sqlite") await pool.query(schema);
else for (const statement of schema.split(";").map((item) => item.trim()).filter(Boolean)) await pool.query(statement);

const email = adminEmail.trim().toLowerCase();
if (await findByEmail(email)) console.log("Base, tablas y administrador ya verificados.");
else {
  await createUser({ nombre: "Administrador", email, passwordHash: await hashPassword(adminPassword), rol: "administrador" });
  console.log("Base, tablas y administrador creados.");
}
await pool.end();
