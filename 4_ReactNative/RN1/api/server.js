import cors from 'cors';
import express from 'express';
import { createHmac, randomInt } from 'node:crypto';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import mysql from 'mysql2/promise';
import nodemailer from 'nodemailer';

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
         FROM damac_usuarios
        WHERE usuario = ? AND clave = SHA2(?, 256)
        LIMIT 1`,
      [usuario, clave],
    );

    if (rows.length === 0) {
      return res.status(401).json({ ok: false, mensaje: 'Usuario o contraseña incorrectos' });
    }

    const u = rows[0];
    await pool.execute('UPDATE damac_usuarios SET ultimo_acceso = NOW() WHERE id = ?', [u.id]);

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

// ───────────── Recuperar contraseña ─────────────
// 1) POST /api/recuperar   { identificador }              → manda un código de 6 dígitos por Gmail
// 2) POST /api/restablecer { identificador, codigo, clave } → valida el código y cambia la contraseña
// Las respuestas del paso 1 son siempre iguales exista o no la cuenta (no se puede averiguar qué usuarios hay).

const CODIGO_MINUTOS = 10;
const CODIGO_INTENTOS = 5;
const REENVIO_SEGUNDOS = 60;
const CLAVE_MINIMA = 6;
const SECRETO = process.env.RECOVERY_SECRET ?? process.env.DB_PASSWORD ?? 'damac-recuperacion';

// Gmail: GMAIL_USER (tu cuenta) y GMAIL_APP_PASSWORD (contraseña de aplicación de 16 letras, NO la de la cuenta).
const mailListo = Boolean(process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD);
const transporte = mailListo
  ? nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD.replace(/\s+/g, '') },
    })
  : null;

const hashCodigo = (usuarioId, codigo) => createHmac('sha256', SECRETO).update(`${usuarioId}:${codigo}`).digest('hex');
const texto = (v) => (typeof v === 'string' ? v.trim() : '');

async function buscarUsuario(identificador) {
  const [rows] = await pool.execute(
    'SELECT id, nombre, usuario, email FROM damac_usuarios WHERE usuario = ? OR email = ? LIMIT 1',
    [identificador, identificador],
  );
  return rows[0] ?? null;
}

async function enviarCodigo(u, codigo) {
  if (!transporte) {
    console.warn(`[recuperar] Gmail sin configurar (GMAIL_USER / GMAIL_APP_PASSWORD). Código de ${u.usuario}: ${codigo}`);
    return;
  }
  await transporte.sendMail({
    from: `"DAMAC" <${process.env.GMAIL_USER}>`,
    to: u.email,
    subject: `Tu código DAMAC: ${codigo}`,
    text:
      `Hola ${u.nombre},\n\nTu código para cambiar la contraseña es: ${codigo}\n` +
      `Vence en ${CODIGO_MINUTOS} minutos. Si no lo pediste, ignorá este mensaje.\n\nDAMAC`,
    html:
      `<div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;max-width:420px;margin:auto;padding:24px">` +
      `<h2 style="margin:0 0 8px;color:#111113"><span style="color:#E30614">D</span>AMAC</h2>` +
      `<p style="color:#444">Hola ${u.nombre.replace(/[<>&]/g, '')}, usá este código para cambiar tu contraseña:</p>` +
      `<p style="font-size:34px;letter-spacing:10px;font-weight:700;margin:20px 0;color:#111113">${codigo}</p>` +
      `<p style="color:#777;font-size:13px">Vence en ${CODIGO_MINUTOS} minutos. Si no lo pediste, ignorá este mensaje.</p></div>`,
  });
}

app.post('/api/recuperar', async (req, res) => {
  const identificador = texto(req.body?.identificador);
  if (!identificador) {
    return res.status(400).json({ ok: false, mensaje: 'Ingresá tu usuario o tu email' });
  }
  const generico = { ok: true, mensaje: 'Si la cuenta existe, te enviamos un código por email.' };

  try {
    const u = await buscarUsuario(identificador);
    if (!u) return res.json(generico);

    const [[reciente]] = await pool.execute(
      `SELECT COUNT(*) AS n FROM damac_recuperacion
        WHERE usuario_id = ? AND creado_en > NOW() - INTERVAL ? SECOND`,
      [u.id, REENVIO_SEGUNDOS],
    );
    if (reciente.n > 0) {
      return res.status(429).json({ ok: false, mensaje: `Esperá ${REENVIO_SEGUNDOS} segundos antes de pedir otro código.` });
    }

    const codigo = String(randomInt(0, 1_000_000)).padStart(6, '0');
    await pool.execute('DELETE FROM damac_recuperacion WHERE usuario_id = ?', [u.id]);
    await pool.execute(
      `INSERT INTO damac_recuperacion (usuario_id, codigo_hash, expira_en)
       VALUES (?, ?, NOW() + INTERVAL ? MINUTE)`,
      [u.id, hashCodigo(u.id, codigo), CODIGO_MINUTOS],
    );
    await enviarCodigo(u, codigo);
    res.json(generico);
  } catch (err) {
    console.error('[recuperar]', err.code ?? err.message);
    res.status(500).json({ ok: false, mensaje: 'No se pudo enviar el código. Probá de nuevo en un rato.' });
  }
});

app.post('/api/restablecer', async (req, res) => {
  const identificador = texto(req.body?.identificador);
  const codigo = texto(req.body?.codigo);
  const clave = typeof req.body?.clave === 'string' ? req.body.clave : '';

  if (!identificador || !/^\d{6}$/.test(codigo)) {
    return res.status(400).json({ ok: false, mensaje: 'Ingresá el código de 6 dígitos' });
  }
  if (clave.length < CLAVE_MINIMA) {
    return res.status(400).json({ ok: false, mensaje: `La contraseña debe tener al menos ${CLAVE_MINIMA} caracteres` });
  }
  const invalido = { ok: false, mensaje: 'Código incorrecto o vencido' };

  try {
    const u = await buscarUsuario(identificador);
    if (!u) return res.status(400).json(invalido);

    const [rows] = await pool.execute(
      'SELECT id, codigo_hash, intentos, expira_en > NOW() AS vigente FROM damac_recuperacion WHERE usuario_id = ? LIMIT 1',
      [u.id],
    );
    const pedido = rows[0];
    if (!pedido || !pedido.vigente || pedido.intentos >= CODIGO_INTENTOS) {
      return res.status(400).json(invalido);
    }

    if (pedido.codigo_hash !== hashCodigo(u.id, codigo)) {
      await pool.execute('UPDATE damac_recuperacion SET intentos = intentos + 1 WHERE id = ?', [pedido.id]);
      return res.status(400).json(invalido);
    }

    await pool.execute('UPDATE damac_usuarios SET clave = SHA2(?, 256) WHERE id = ?', [clave, u.id]);
    await pool.execute('DELETE FROM damac_recuperacion WHERE usuario_id = ?', [u.id]);
    res.json({ ok: true, mensaje: 'Contraseña actualizada. Ya podés ingresar.' });
  } catch (err) {
    console.error('[restablecer]', err.code ?? err.message);
    res.status(500).json({ ok: false, mensaje: 'No se pudo cambiar la contraseña. Probá de nuevo.' });
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
        CREATE TABLE IF NOT EXISTS damac_usuarios (
          id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
          nombre        VARCHAR(100) NOT NULL,
          usuario       VARCHAR(50)  NOT NULL UNIQUE,
          email         VARCHAR(120) NOT NULL,
          rol           VARCHAR(40)  NOT NULL DEFAULT 'Operador',
          clave         CHAR(64)     NOT NULL,
          ultimo_acceso DATETIME     NULL,
          creado_en     TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
        ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4`);
      await pool.query(`
        CREATE TABLE IF NOT EXISTS damac_recuperacion (
          id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
          usuario_id  INT UNSIGNED NOT NULL,
          codigo_hash CHAR(64)     NOT NULL,
          expira_en   DATETIME     NOT NULL,
          intentos    TINYINT UNSIGNED NOT NULL DEFAULT 0,
          creado_en   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
          INDEX (usuario_id)
        ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4`);
      const [[{ total }]] = await pool.query('SELECT COUNT(*) AS total FROM damac_usuarios');
      if (total === 0) {
        await pool.query(`
          INSERT INTO damac_usuarios (nombre, usuario, email, rol, clave) VALUES
            ('Administrador DAMAC', 'admin',  'admin@damac.com',  'Administrador', SHA2('1234', 256)),
            ('Alexis Vallejos',     'alexis', 'alexisvallejos803@gmail.com', 'Supervisor',    SHA2('damac2026', 256)),
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
