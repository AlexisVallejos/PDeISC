import cors from 'cors';
import express from 'express';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import mysql from 'mysql2/promise';

const PORT = Number(process.env.PORT ?? 3000);
const HOST = process.env.HOST ?? '0.0.0.0';

const pool = mysql.createPool({
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 3306),
  user: process.env.DB_USER ?? 'root',
  password: process.env.DB_PASSWORD ?? '',
  database: process.env.DB_NAME ?? 'damac_acceso',
  waitForConnections: true,
  connectionLimit: 10,
});

const app = express();
app.use(cors());
app.use(express.json());

// Estado de la API y de la conexión a MySQL.
app.get('/api/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ ok: true, db: 'conectada' });
  } catch (err) {
    res.status(500).json({ ok: false, db: 'sin conexión', error: err.code });
  }
});

/**
 * POST /api/login  { usuario, clave }
 * Busca el usuario en MySQL y devuelve JSON indicando si existe.
 *   200 { ok: true,  mensaje, usuario: { id, nombre, usuario, email, rol, ultimoAcceso } }
 *   401 { ok: false, mensaje: 'Usuario o contraseña incorrectos' }
 */
app.post('/api/login', async (req, res) => {
  const usuario = typeof req.body?.usuario === 'string' ? req.body.usuario.trim() : '';
  const clave = typeof req.body?.clave === 'string' ? req.body.clave : '';

  if (!usuario || !clave) {
    return res.status(400).json({ ok: false, mensaje: 'Completá usuario y contraseña' });
  }

  try {
    // Consulta parametrizada: evita inyección SQL.
    const [rows] = await pool.execute(
      `SELECT id, nombre, usuario, email, rol, ultimo_acceso
         FROM usuarios
        WHERE usuario = ? AND clave = SHA2(?, 256)
        LIMIT 1`,
      [usuario, clave],
    );

    if (rows.length === 0) {
      return res.status(401).json({ ok: false, mensaje: 'Usuario o contraseña incorrectos' });
    }

    const u = rows[0];
    await pool.execute('UPDATE usuarios SET ultimo_acceso = NOW() WHERE id = ?', [u.id]);

    res.json({
      ok: true,
      mensaje: `Bienvenido, ${u.nombre}`,
      usuario: {
        id: u.id,
        nombre: u.nombre,
        usuario: u.usuario,
        email: u.email,
        rol: u.rol,
        ultimoAcceso: u.ultimo_acceso ? new Date(u.ultimo_acceso).toISOString() : null,
      },
    });
  } catch (err) {
    console.error('[login]', err.code ?? err.message);
    res.status(500).json({ ok: false, mensaje: 'Error de base de datos. ¿Está encendido MySQL en XAMPP?' });
  }
});

// En producción (Docker / Easypanel) la API también sirve la web exportada de Expo.
const WEB_DIR = process.env.WEB_DIR ?? join(import.meta.dirname, 'public');
if (existsSync(WEB_DIR)) {
  app.use(express.static(WEB_DIR));
  app.get(/^(?!\/api\/).*/, (_req, res) => res.sendFile(join(WEB_DIR, 'index.html')));
}

// Crea la tabla y los usuarios de prueba si no existen (útil en Docker / Easypanel,
// donde no se importa database.sql a mano). Reintenta mientras MySQL arranca.
async function prepararBase(intentos = 60) {
  for (let i = 1; i <= intentos; i++) {
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS usuarios (
          id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
          nombre        VARCHAR(100) NOT NULL,
          usuario       VARCHAR(50)  NOT NULL UNIQUE,
          email         VARCHAR(120) NOT NULL,
          rol           VARCHAR(40)  NOT NULL DEFAULT 'Operador',
          clave         CHAR(64)     NOT NULL,
          ultimo_acceso DATETIME     NULL,
          creado_en     TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
        ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4`);
      const [[{ total }]] = await pool.query('SELECT COUNT(*) AS total FROM usuarios');
      if (total === 0) {
        await pool.query(`
          INSERT INTO usuarios (nombre, usuario, email, rol, clave) VALUES
            ('Administrador DAMAC', 'admin',  'admin@damac.com',  'Administrador', SHA2('1234', 256)),
            ('Alexis Vallejos',     'alexis', 'alexis@damac.com', 'Supervisor',    SHA2('damac2026', 256)),
            ('María López',         'maria',  'maria@damac.com',  'Operador',      SHA2('maria123', 256))`);
        console.log('Usuarios de prueba creados');
      }
      return;
    } catch (err) {
      console.warn(`MySQL no disponible (${err.code ?? err.message}), intento ${i}/${intentos}`);
      await new Promise((r) => setTimeout(r, 2000));
    }
  }
  console.error('No se pudo preparar la base de datos; la API sigue levantada.');
}

app.listen(PORT, HOST, () => {
  console.log(`API DAMAC escuchando en http://${HOST}:${PORT}`);
  prepararBase();
});
