import nodemailer from 'nodemailer';
import { env } from '../config/env.js';
import { unavailable } from './httpError.js';

/**
 * Envío de emails por SMTP (por ejemplo Gmail con una contraseña de aplicación).
 * Sin SMTP configurado: en desarrollo el mensaje se muestra en la consola; en producción falla.
 */
let transport = null;
let customSend = null;

/** Para las pruebas: reemplaza el envío real por una función (sin argumento vuelve al real). */
export function setMailSender(fn) {
  customSend = fn ?? null;
}

export const mailConfigured = () => Boolean(env.mail.host && env.mail.user && env.mail.pass);

export async function sendMail({ to, subject, text, html }) {
  if (customSend) return customSend({ to, subject, text, html });
  if (!mailConfigured()) {
    if (env.nodeEnv === 'production') throw unavailable('EMAIL_NOT_CONFIGURED', 'El envío de emails no está configurado en el servidor');
    console.log(`[mail] (sin SMTP) Para ${to} · ${subject}\n${text}`);
    return;
  }
  transport ??= nodemailer.createTransport({
    host: env.mail.host,
    port: env.mail.port,
    secure: env.mail.port === 465,
    auth: { user: env.mail.user, pass: env.mail.pass },
  });
  await transport.sendMail({ from: env.mail.from || env.mail.user, to, subject, text, html });
}
