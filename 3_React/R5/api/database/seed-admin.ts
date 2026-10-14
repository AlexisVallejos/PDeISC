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

const server = await mysql.createConnection({ host: config.db.host, port: config.db.port, user: config.db.user, password: config.db.password });
await server.query(`CREATE DATABASE IF NOT EXISTS \`${config.db.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
await server.end();

const schema = await readFile(new URL("./schema.sql", import.meta.url), "utf8");
for (const statement of schema.split(";").map((item) => item.trim()).filter(Boolean)) await pool.query(statement);

const email = adminEmail.trim().toLowerCase();
const existing = await findByEmail(email);
if (existing?.rol === "administrador") {
  // si cambiaste ADMIN_PASSWORD en el .env, acá se actualiza
  await pool.execute("UPDATE usuarios SET password_hash = ? WHERE id = ?", [await hashPassword(adminPassword), existing.id]);
  console.log("Base, tablas y administrador verificados (contraseña sincronizada con el .env).");
} else if (existing) throw new Error(`El correo ${email} ya lo usa un usuario que no es administrador.`);
else { await createUser({ nombre: "Administrador", email, passwordHash: await hashPassword(adminPassword), rol: "administrador" }); console.log("Base, tablas y administrador creados."); }
await pool.end();
