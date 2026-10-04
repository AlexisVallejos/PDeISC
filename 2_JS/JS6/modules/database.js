// ARCHIVO: modules/database.js
// QUÉ HACE: decide dónde se guardan los puntajes. Primero intenta MySQL (la base del TP); si no se
// puede conectar, usa un archivo JSON local para que el ranking funcione igual. Ambos "almacenes"
// exponen la misma interfaz { tipo, guardar(datos), listar() }, así el resto del código no sabe cuál usa.

import mysql from "mysql2/promise"; // Cliente MySQL con soporte de promesas (async/await).
import { mkdir, readFile, writeFile } from "node:fs/promises"; // Funciones de archivos que devuelven promesas.
import path from "node:path"; // Armado de rutas de archivo.
import { fileURLToPath } from "node:url"; // Para reconstruir __dirname en módulos ES.

const RUTA_ARCHIVO = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "data", "puntajes.json"); // Archivo de respaldo: JS6/data/puntajes.json.
const LIMITE = 100; // Máximo de puntajes que se devuelven (los mejores 100).

const configuracion = { // Datos de conexión que vienen del archivo .env (con valores por defecto para uso local).
  host: process.env.DB_HOST || "localhost", // Servidor MySQL.
  port: Number(process.env.DB_PORT || 3306), // Puerto (3306 es el estándar de MySQL).
  user: process.env.DB_USER || "root", // Usuario.
  password: process.env.DB_PASSWORD || "" // Contraseña.
};
const nombreBase = process.env.DB_NAME || "Score"; // Nombre de la base de datos.

// Compruebo la conexión y creo la tabla si falta. La base solo se crea si no existe,
// porque en servicios como Easypanel el usuario suele tener permiso solo sobre su base ya creada.
async function prepararMysql() {
  let conexion; // Conexión puntual de preparación (después se usa un pool).
  try {
    conexion = await mysql.createConnection({ ...configuracion, database: nombreBase, connectTimeout: 3000 }); // Intento entrar directo a la base; espera máximo 3 s.
  } catch (error) {
    if (error.code !== "ER_BAD_DB_ERROR") throw error; // Si el problema NO es "la base no existe", no hay nada que arreglar: propago el error.
    const admin = await mysql.createConnection({ ...configuracion, connectTimeout: 3000 }); // Me conecto sin elegir base.
    await admin.query(`CREATE DATABASE IF NOT EXISTS \`${nombreBase}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`); // Creo la base con soporte completo de tildes y emojis.
    await admin.end(); // Cierro la conexión administrativa.
    conexion = await mysql.createConnection({ ...configuracion, database: nombreBase, connectTimeout: 3000 }); // Ahora sí entro a la base recién creada.
  }
  try {
    await conexion.query(`CREATE TABLE IF NOT EXISTS score (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      tiempo INT UNSIGNED NOT NULL,
      puntos INT UNSIGNED NOT NULL,
      fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      nombre VARCHAR(40) NOT NULL,
      PRIMARY KEY (id),
      INDEX idx_score_puntos_tiempo (puntos DESC, tiempo ASC, fecha ASC)
    )`); // Tabla con los campos pedidos; "IF NOT EXISTS" hace que sea seguro ejecutarla siempre. El índice acelera el ORDER BY del ranking.
  } finally {
    await conexion.end(); // Siempre cierro la conexión, haya salido bien o mal.
  }
}

// Almacén MySQL: usa consultas con parámetros para evitar inyección SQL.
function almacenMysql() {
  const pool = mysql.createPool({ ...configuracion, database: nombreBase, waitForConnections: true, connectionLimit: 5, charset: "utf8mb4" }); // Pool: conjunto de conexiones reutilizables (máx. 5).
  return {
    tipo: "MySQL", // Se muestra en la consola al arrancar.
    async guardar({ tiempo, puntos, nombre }) {
      const [resultado] = await pool.execute("INSERT INTO score (tiempo, puntos, nombre) VALUES (?, ?, ?)", [tiempo, puntos, nombre]); // Los "?" se rellenan con el array: MySQL nunca interpreta los datos como SQL.
      return { id: resultado.insertId, tiempo, puntos, nombre }; // insertId es el id autoincremental que asignó MySQL.
    },
    async listar() {
      const [filas] = await pool.execute(`SELECT id, tiempo, puntos, fecha, nombre FROM score ORDER BY puntos DESC, tiempo ASC, fecha ASC LIMIT ${LIMITE}`); // Más puntos primero; si empatan, menor tiempo; luego el más antiguo.
      return filas; // Array de objetos con las columnas pedidas.
    }
  };
}

// Almacén de respaldo en un archivo JSON, con el mismo orden que la consulta SQL.
function almacenArchivo() {
  const leer = async () => { // Lee y convierte el archivo en un array.
    try {
      return JSON.parse(await readFile(RUTA_ARCHIVO, "utf8")); // De texto JSON a array de objetos.
    } catch {
      return []; // Si el archivo no existe todavía (o está vacío), arranco con lista vacía.
    }
  };
  let escritura = Promise.resolve(); // Cadena de promesas: serializa las escrituras para que dos guardados simultáneos no se pisen.
  return {
    tipo: "archivo local",
    guardar(datos) {
      const tarea = escritura.then(async () => { // Espero a que termine la escritura anterior.
        const filas = await leer(); // Traigo lo ya guardado.
        const fila = { id: filas.reduce((mayor, item) => Math.max(mayor, item.id), 0) + 1, ...datos, fecha: new Date().toISOString() }; // Id = mayor id existente + 1 (imita el AUTO_INCREMENT) y fecha actual.
        filas.push(fila); // Agrego el nuevo puntaje.
        await mkdir(path.dirname(RUTA_ARCHIVO), { recursive: true }); // Creo la carpeta data/ si no existe.
        await writeFile(RUTA_ARCHIVO, JSON.stringify(filas, null, 2)); // Guardo todo el array como JSON con sangría de 2 espacios.
        return fila;
      });
      escritura = tarea.catch(() => {}); // Si esta tarea falla, la cadena sigue viva para los próximos guardados.
      return tarea; // Quien llamó recibe el resultado (o el error).
    },
    async listar() {
      const filas = await leer();
      return filas
        .sort((a, b) => b.puntos - a.puntos || a.tiempo - b.tiempo || a.fecha.localeCompare(b.fecha)) // Mismo criterio que el ORDER BY de SQL.
        .slice(0, LIMITE); // Me quedo con los primeros 100.
    }
  };
}

// Intento usar MySQL; si no responde, sigo con el archivo para que el ranking funcione igual.
export async function crearAlmacen() {
  try {
    await prepararMysql(); // Verifica conexión, base y tabla.
    return almacenMysql(); // Todo bien: uso MySQL.
  } catch (error) {
    console.warn(`MySQL no disponible (${error.code || error.message}). Uso archivo local: data/puntajes.json`); // Aviso el motivo en la consola.
    return almacenArchivo(); // Plan B.
  }
}
