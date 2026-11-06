import crypto from 'node:crypto';
import express, { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import { query } from '../../config/db.js';
import { env } from '../../config/env.js';
import { authenticate, authorize } from '../../middlewares/auth.js';
import { validate } from '../../middlewares/validate.js';
import { badRequest, notFound } from '../../utils/httpError.js';
import { publicOrigin } from '../auth/oauth.js';

/**
 * Imágenes subidas desde la app (por ahora, la foto de un ejercicio del catálogo).
 * Se guardan en MySQL: en Vercel no hay disco que dure entre pedidos.
 *  - POST /api/uploads/images  { dataUrl: "data:image/jpeg;base64,..." }  → { id, url }
 *  - GET  /api/uploads/images/:id  → la imagen (pública, para poder usarla en <Image>)
 * La app achica la foto antes de mandarla (1280 px, JPEG), así pesa unos cientos de kB.
 */
const router = Router();

export const MAX_IMAGE_BYTES = 2 * 1024 * 1024;
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp'];
const IMAGE_PATH = '/api/uploads/images/';

// Firma de los primeros bytes: el tipo declarado tiene que coincidir con el archivo de verdad.
function sniff(buf) {
  if (buf.length > 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return 'image/jpeg';
  if (buf.length > 8 && buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return 'image/png';
  if (buf.length > 12 && buf.toString('ascii', 0, 4) === 'RIFF' && buf.toString('ascii', 8, 12) === 'WEBP') return 'image/webp';
  return null;
}

const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: env.nodeEnv === 'test' ? 10_000 : 60,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: { code: 'TOO_MANY_REQUESTS', message: 'Demasiadas subidas, probá de nuevo en unos minutos' } },
});

const uploadSchema = z.object({ dataUrl: z.string().max(3 * 1024 * 1024, 'La imagen es muy pesada (máximo 2 MB)') });
const imageParams = z.object({ id: z.string().regex(/^[a-f0-9]{32}$/, 'Imagen inválida') });

// La foto viaja en base64: este parser va antes del general de 100 kB (ver app.js).
router.post(
  '/images',
  express.json({ limit: '3mb' }),
  authenticate,
  authorize('coach', 'admin'),
  uploadLimiter,
  validate({ body: uploadSchema }),
  async (req, res) => {
    const match = /^data:(image\/[a-z]+);base64,([A-Za-z0-9+/=\s]+)$/.exec(req.valid.body.dataUrl);
    if (!match || !ALLOWED.includes(match[1])) throw badRequest('Subí una imagen JPG, PNG o WEBP');
    const data = Buffer.from(match[2], 'base64');
    if (!data.length) throw badRequest('La imagen está vacía');
    if (data.length > MAX_IMAGE_BYTES) throw badRequest('La imagen es muy pesada (máximo 2 MB)');
    const mime = sniff(data);
    if (!mime) throw badRequest('El archivo no es una imagen JPG, PNG o WEBP válida');

    const id = crypto.randomBytes(16).toString('hex');
    await query('INSERT INTO uploaded_images (id, owner_id, mime, data) VALUES (?, ?, ?, ?)', [id, req.user.id, mime, data]);
    res.status(201).json({ data: { id, url: `${publicOrigin(req)}${IMAGE_PATH}${id}` } });
  },
);

router.get('/images/:id', validate({ params: imageParams }), async (req, res) => {
  const [row] = await query('SELECT mime, data FROM uploaded_images WHERE id = ?', [req.valid.params.id]);
  if (!row) throw notFound('Imagen no encontrada');
  res.set({
    'Content-Type': row.mime,
    // El id es aleatorio y la imagen nunca cambia: se puede guardar en caché para siempre.
    'Cache-Control': 'public, max-age=31536000, immutable',
    // Se puede mostrar desde la app web aunque corra en otro origen (desarrollo).
    'Cross-Origin-Resource-Policy': 'cross-origin',
    'Content-Security-Policy': "default-src 'none'; sandbox",
  });
  res.send(row.data);
});

/** Si la URL es de una imagen subida acá, la borra (al cambiar o quitar la foto de un ejercicio). */
export async function deleteUploadedImage(url) {
  const id = String(url || '').match(/\/api\/uploads\/images\/([a-f0-9]{32})$/)?.[1];
  if (id) await query('DELETE FROM uploaded_images WHERE id = ?', [id]);
}

export default router;
