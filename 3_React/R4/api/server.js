import cors from 'cors';
import express from 'express';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import mysql from 'mysql2/promise';

const PORT = Number(process.env.PORT ?? 3000);
const HOST = process.env.HOST ?? '0.0.0.0';
const ADMIN_TOKEN = process.env.ADMIN_TOKEN ?? '';
// Las reseñas se publican recién cuando las aprobás; con RESENAS_AUTOAPROBAR=true se publican al instante.
const RESENAS_AUTOAPROBAR = process.env.RESENAS_AUTOAPROBAR === 'true';

const pool = mysql.createPool({
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 3306),
  user: process.env.DB_USER ?? 'root',
  password: process.env.DB_PASSWORD ?? '',
  database: process.env.DB_NAME ?? 'portfolio',
  waitForConnections: true,
  connectionLimit: 10,
});

const semilla = JSON.parse(readFileSync(join(import.meta.dirname, 'semilla.json'), 'utf8'));

const app = express();
app.set('trust proxy', 1); // detrás del proxy de Easypanel, req.ip es la IP real
app.use(cors());
app.use(express.json({ limit: '20kb' }));

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
 * GET /api/portfolio
 * Todo el contenido del portfolio, leído de MySQL.
 *   200 { ok: true, fuente: 'mysql', perfil, estadisticas, habilidades, experiencias, logros, proyectos, resenas, visitas }
 * Solo incluye las reseñas aprobadas.
 */
app.get('/api/portfolio', async (_req, res) => {
  try {
    const [[perfil]] = await pool.query('SELECT * FROM portfolio_perfil WHERE id = 1');
    const [habilidades] = await pool.query(
      'SELECT categoria, nombre, nivel FROM portfolio_habilidades ORDER BY orden, id',
    );
    const [experiencias] = await pool.query(
      'SELECT periodo, rol, lugar, descripcion FROM portfolio_experiencias ORDER BY orden, id',
    );
    const [logros] = await pool.query('SELECT valor, titulo, detalle FROM portfolio_logros ORDER BY orden, id');
    const [proyectos] = await pool.query(
      'SELECT titulo, tipo, lema, descripcion, tecnologias, repo, demo, imagen FROM portfolio_proyectos ORDER BY orden, id',
    );
    const [estadisticas] = await pool.query(
      'SELECT valor, etiqueta FROM portfolio_estadisticas ORDER BY orden, id',
    );
    const [resenas] = await pool.query(
      'SELECT id, nombre, rol, texto, puntaje FROM portfolio_resenas WHERE aprobada = 1 ORDER BY creado_en DESC LIMIT 30',
    );
    const [[{ total: visitas }]] = await pool.query('SELECT total FROM portfolio_visitas WHERE id = 1');

    res.json({
      ok: true,
      fuente: 'mysql',
      perfil: perfil ? { ...perfil, id: undefined, disponible: Boolean(perfil.disponible) } : semilla.perfil,
      estadisticas,
      habilidades,
      experiencias,
      logros,
      proyectos: proyectos.map((p) => ({ ...p, tecnologias: p.tecnologias.split(',').filter(Boolean) })),
      resenas,
      visitas,
    });
  } catch (err) {
    console.error('[portfolio]', err.code ?? err.message);
    res.status(500).json({ ok: false, mensaje: 'No se pudo leer la base de datos' });
  }
});

// POST /api/visitas → suma una visita y devuelve el total.
app.post('/api/visitas', async (_req, res) => {
  try {
    await pool.query('UPDATE portfolio_visitas SET total = total + 1 WHERE id = 1');
    const [[{ total }]] = await pool.query('SELECT total FROM portfolio_visitas WHERE id = 1');
    res.json({ ok: true, visitas: total });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.code });
  }
});

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const ultimosEnvios = new Map(); // ip → timestamp, frena el spam más obvio

/**
 * POST /api/mensajes  { nombre, email, mensaje }
 * Guarda un mensaje del formulario de contacto.
 *   201 { ok: true, mensaje }
 *   400 { ok: false, errores: { campo: 'motivo' } }
 */
app.post('/api/mensajes', async (req, res) => {
  const nombre = String(req.body?.nombre ?? '').trim();
  const email = String(req.body?.email ?? '').trim();
  const mensaje = String(req.body?.mensaje ?? '').trim();

  const errores = {};
  if (nombre.length < 2 || nombre.length > 80) errores.nombre = 'Escribí tu nombre';
  if (!EMAIL.test(email) || email.length > 120) errores.email = 'Revisá el email';
  if (mensaje.length < 10 || mensaje.length > 2000) errores.mensaje = 'El mensaje necesita al menos 10 caracteres';
  if (Object.keys(errores).length) return res.status(400).json({ ok: false, errores });

  const ip = req.ip ?? 'desconocida';
  if (Date.now() - (ultimosEnvios.get(ip) ?? 0) < 30_000) {
    return res.status(429).json({ ok: false, mensaje: 'Esperá unos segundos antes de enviar otro mensaje' });
  }

  try {
    await pool.execute('INSERT INTO portfolio_mensajes (nombre, email, mensaje) VALUES (?, ?, ?)', [
      nombre,
      email,
      mensaje,
    ]);
    ultimosEnvios.set(ip, Date.now());
    res.status(201).json({ ok: true, mensaje: '¡Gracias! Tu mensaje quedó guardado.' });
  } catch (err) {
    console.error('[mensajes]', err.code ?? err.message);
    res.status(500).json({ ok: false, mensaje: 'No se pudo guardar el mensaje' });
  }
});

// Rutas de administración: piden el header "x-admin-token" igual a ADMIN_TOKEN (si no está configurado, no hay acceso).
function soloAdmin(req, res, next) {
  if (!ADMIN_TOKEN || req.get('x-admin-token') !== ADMIN_TOKEN) {
    return res.status(401).json({ ok: false, mensaje: 'No autorizado' });
  }
  next();
}

// GET /api/mensajes → mensajes recibidos.
app.get('/api/mensajes', soloAdmin, async (_req, res) => {
  const [mensajes] = await pool.query('SELECT * FROM portfolio_mensajes ORDER BY creado_en DESC LIMIT 200');
  res.json({ ok: true, mensajes });
});

const ultimasResenas = new Map(); // ip → timestamp

/**
 * POST /api/resenas  { nombre, rol, texto, puntaje }
 * Guarda una reseña. Queda pendiente hasta que la apruebes (salvo RESENAS_AUTOAPROBAR=true).
 *   201 { ok: true, publicada, mensaje }
 *   400 { ok: false, errores: { campo: 'motivo' } }
 */
app.post('/api/resenas', async (req, res) => {
  const nombre = String(req.body?.nombre ?? '').trim();
  const rol = String(req.body?.rol ?? '').trim();
  const texto = String(req.body?.texto ?? '').trim();
  const puntaje = Number(req.body?.puntaje);

  const errores = {};
  if (nombre.length < 2 || nombre.length > 80) errores.nombre = 'Escribí tu nombre';
  if (rol.length > 80) errores.rol = 'Máximo 80 caracteres';
  if (texto.length < 20 || texto.length > 600) errores.texto = 'Contá un poco más: al menos 20 caracteres';
  if (!Number.isInteger(puntaje) || puntaje < 1 || puntaje > 5) errores.puntaje = 'Elegí de 1 a 5 estrellas';
  if (Object.keys(errores).length) return res.status(400).json({ ok: false, errores });

  const ip = req.ip ?? 'desconocida';
  if (Date.now() - (ultimasResenas.get(ip) ?? 0) < 60_000) {
    return res.status(429).json({ ok: false, mensaje: 'Ya enviaste una reseña hace un momento' });
  }

  try {
    await pool.execute('INSERT INTO portfolio_resenas (nombre, rol, texto, puntaje, aprobada) VALUES (?, ?, ?, ?, ?)', [
      nombre,
      rol,
      texto,
      puntaje,
      RESENAS_AUTOAPROBAR ? 1 : 0,
    ]);
    ultimasResenas.set(ip, Date.now());
    res.status(201).json({
      ok: true,
      publicada: RESENAS_AUTOAPROBAR,
      mensaje: RESENAS_AUTOAPROBAR
        ? '¡Gracias! Tu reseña ya está publicada.'
        : '¡Gracias! Tu reseña se publica en cuanto la revise.',
    });
  } catch (err) {
    console.error('[resenas]', err.code ?? err.message);
    res.status(500).json({ ok: false, mensaje: 'No se pudo guardar la reseña' });
  }
});

// GET /api/resenas?estado=pendientes|aprobadas|todas → reseñas para moderar.
app.get('/api/resenas', soloAdmin, async (req, res) => {
  const filtro = { pendientes: 'WHERE aprobada = 0', aprobadas: 'WHERE aprobada = 1' }[req.query.estado] ?? '';
  const [resenas] = await pool.query(`SELECT * FROM portfolio_resenas ${filtro} ORDER BY creado_en DESC LIMIT 200`);
  res.json({ ok: true, resenas });
});

// PATCH /api/resenas/:id  { aprobada: true|false } → publica u oculta una reseña.
app.patch('/api/resenas/:id', soloAdmin, async (req, res) => {
  const [resultado] = await pool.execute('UPDATE portfolio_resenas SET aprobada = ? WHERE id = ?', [
    req.body?.aprobada ? 1 : 0,
    Number(req.params.id),
  ]);
  res.status(resultado.affectedRows ? 200 : 404).json({ ok: Boolean(resultado.affectedRows) });
});

// DELETE /api/resenas/:id → borra una reseña.
app.delete('/api/resenas/:id', soloAdmin, async (req, res) => {
  const [resultado] = await pool.execute('DELETE FROM portfolio_resenas WHERE id = ?', [Number(req.params.id)]);
  res.status(resultado.affectedRows ? 200 : 404).json({ ok: Boolean(resultado.affectedRows) });
});

// En producción (Docker / Easypanel) la API también sirve la web compilada con Vite.
const WEB_DIR = process.env.WEB_DIR ?? join(import.meta.dirname, 'public');
if (existsSync(WEB_DIR)) {
  app.use(express.static(WEB_DIR, { maxAge: '1h' }));
  app.get(/^(?!\/api\/).*/, (_req, res) => res.sendFile(join(WEB_DIR, 'index.html')));
}

// Crea las tablas y carga el contenido de semilla.json si están vacías (útil en Docker / Easypanel,
// donde no se importa database.sql a mano). Reintenta mientras MySQL arranca.
async function prepararBase(intentos = 60) {
  for (let i = 1; i <= intentos; i++) {
    try {
      await crearTablas();
      await cargarSemilla();
      return;
    } catch (err) {
      console.warn(`MySQL no disponible (${err.code ?? err.message}), intento ${i}/${intentos}`);
      await new Promise((r) => setTimeout(r, 2000));
    }
  }
  console.error('No se pudo preparar la base de datos; la API sigue levantada.');
}

async function crearTablas() {
  const tablas = [
    `CREATE TABLE IF NOT EXISTS portfolio_perfil (
       id         TINYINT UNSIGNED PRIMARY KEY,
       nombre     VARCHAR(100) NOT NULL,
       rol        VARCHAR(100) NOT NULL,
       titular    VARCHAR(200) NOT NULL,
       resumen    VARCHAR(300) NOT NULL DEFAULT '',
       bio        TEXT         NOT NULL,
       ubicacion  VARCHAR(100) NOT NULL DEFAULT '',
       foto       VARCHAR(300) NOT NULL DEFAULT '/foto.jpg',
       github     VARCHAR(300) NOT NULL DEFAULT '',
       linkedin   VARCHAR(300) NOT NULL DEFAULT '',
       email      VARCHAR(120) NOT NULL DEFAULT '',
       disponible TINYINT(1)   NOT NULL DEFAULT 1
     )`,
    `CREATE TABLE IF NOT EXISTS portfolio_habilidades (
       id        INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
       categoria VARCHAR(40)  NOT NULL,
       nombre    VARCHAR(60)  NOT NULL,
       nivel     TINYINT UNSIGNED NOT NULL,
       orden     INT NOT NULL DEFAULT 0
     )`,
    `CREATE TABLE IF NOT EXISTS portfolio_experiencias (
       id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
       periodo     VARCHAR(40)  NOT NULL,
       rol         VARCHAR(100) NOT NULL,
       lugar       VARCHAR(100) NOT NULL,
       descripcion TEXT         NOT NULL,
       orden       INT NOT NULL DEFAULT 0
     )`,
    `CREATE TABLE IF NOT EXISTS portfolio_logros (
       id      INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
       valor   VARCHAR(20)  NOT NULL,
       titulo  VARCHAR(100) NOT NULL,
       detalle VARCHAR(300) NOT NULL,
       orden   INT NOT NULL DEFAULT 0
     )`,
    `CREATE TABLE IF NOT EXISTS portfolio_proyectos (
       id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
       titulo      VARCHAR(100) NOT NULL,
       tipo        VARCHAR(40)  NOT NULL DEFAULT '',
       lema        VARCHAR(120) NOT NULL DEFAULT '',
       descripcion TEXT         NOT NULL,
       tecnologias VARCHAR(300) NOT NULL,
       repo        VARCHAR(300) NOT NULL DEFAULT '',
       demo        VARCHAR(300) NOT NULL DEFAULT '',
       imagen      VARCHAR(300) NOT NULL DEFAULT '',
       orden       INT NOT NULL DEFAULT 0
     )`,
    `CREATE TABLE IF NOT EXISTS portfolio_estadisticas (
       id       INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
       valor    VARCHAR(20) NOT NULL,
       etiqueta VARCHAR(60) NOT NULL,
       orden    INT NOT NULL DEFAULT 0
     )`,
    `CREATE TABLE IF NOT EXISTS portfolio_mensajes (
       id        INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
       nombre    VARCHAR(80)   NOT NULL,
       email     VARCHAR(120)  NOT NULL,
       mensaje   VARCHAR(2000) NOT NULL,
       creado_en TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP
     )`,
    `CREATE TABLE IF NOT EXISTS portfolio_resenas (
       id        INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
       nombre    VARCHAR(80)  NOT NULL,
       rol       VARCHAR(80)  NOT NULL DEFAULT '',
       texto     VARCHAR(600) NOT NULL,
       puntaje   TINYINT UNSIGNED NOT NULL,
       aprobada  TINYINT(1)   NOT NULL DEFAULT 0,
       creado_en TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
     )`,
    `CREATE TABLE IF NOT EXISTS portfolio_visitas (
       id    TINYINT UNSIGNED PRIMARY KEY,
       total INT UNSIGNED NOT NULL DEFAULT 0
     )`,
  ];
  for (const sql of tablas) await pool.query(`${sql} ENGINE = InnoDB DEFAULT CHARSET = utf8mb4`);

  // Bases creadas con una versión anterior: agrego las columnas nuevas sin tocar los datos.
  await asegurarColumna('portfolio_perfil', 'resumen', "VARCHAR(300) NOT NULL DEFAULT '' AFTER titular");
  await asegurarColumna('portfolio_proyectos', 'tipo', "VARCHAR(40) NOT NULL DEFAULT '' AFTER titulo");
  await asegurarColumna('portfolio_proyectos', 'lema', "VARCHAR(120) NOT NULL DEFAULT '' AFTER tipo");
  await asegurarColumna('portfolio_proyectos', 'imagen', "VARCHAR(300) NOT NULL DEFAULT ''");
}

async function asegurarColumna(tabla, columna, definicion) {
  const [[{ existe }]] = await pool.query(
    `SELECT COUNT(*) AS existe FROM information_schema.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?`,
    [tabla, columna],
  );
  if (!existe) await pool.query(`ALTER TABLE ${tabla} ADD COLUMN ${columna} ${definicion}`);
}

async function estaVacia(tabla) {
  const [[{ total }]] = await pool.query(`SELECT COUNT(*) AS total FROM ${tabla}`);
  return total === 0;
}

async function cargarSemilla() {
  const { perfil, estadisticas, habilidades, experiencias, logros, proyectos } = semilla;

  if (await estaVacia('portfolio_perfil')) {
    await pool.query('INSERT INTO portfolio_perfil SET ?', [{ id: 1, ...perfil, disponible: perfil.disponible ? 1 : 0 }]);
  }
  if (await estaVacia('portfolio_estadisticas')) {
    await pool.query('INSERT INTO portfolio_estadisticas (valor, etiqueta, orden) VALUES ?', [
      estadisticas.map((e, i) => [e.valor, e.etiqueta, i]),
    ]);
  }
  if (await estaVacia('portfolio_habilidades')) {
    await pool.query('INSERT INTO portfolio_habilidades (categoria, nombre, nivel, orden) VALUES ?', [
      habilidades.map((h, i) => [h.categoria, h.nombre, h.nivel, i]),
    ]);
  }
  if (await estaVacia('portfolio_experiencias')) {
    await pool.query('INSERT INTO portfolio_experiencias (periodo, rol, lugar, descripcion, orden) VALUES ?', [
      experiencias.map((e, i) => [e.periodo, e.rol, e.lugar, e.descripcion, i]),
    ]);
  }
  if (await estaVacia('portfolio_logros')) {
    await pool.query('INSERT INTO portfolio_logros (valor, titulo, detalle, orden) VALUES ?', [
      logros.map((l, i) => [l.valor, l.titulo, l.detalle, i]),
    ]);
  }
  if (await estaVacia('portfolio_proyectos')) {
    await pool.query(
      'INSERT INTO portfolio_proyectos (titulo, tipo, lema, descripcion, tecnologias, repo, demo, imagen, orden) VALUES ?',
      [proyectos.map((p, i) => [p.titulo, p.tipo, p.lema, p.descripcion, p.tecnologias.join(','), p.repo, p.demo, p.imagen, i])],
    );
  }
  // Completa las columnas nuevas en filas viejas que las tengan vacías.
  await pool.query("UPDATE portfolio_perfil SET resumen = ? WHERE id = 1 AND resumen = ''", [perfil.resumen]);
  for (const p of proyectos) {
    await pool.query("UPDATE portfolio_proyectos SET tipo = ?, lema = ? WHERE titulo = ? AND tipo = '' AND lema = ''", [
      p.tipo,
      p.lema,
      p.titulo,
    ]);
  }
  await pool.query('INSERT IGNORE INTO portfolio_visitas (id, total) VALUES (1, 0)');
  console.log('Base del portfolio lista');
}

app.listen(PORT, HOST, () => {
  console.log(`API del portfolio escuchando en http://${HOST}:${PORT}`);
  prepararBase();
});
