/**
 * DOCUMENTACION PARA DEFENDER
 * Archivo: Ejercicio1_Formulario/services/emailService.js
 * Rol: encapsula una tarea externa o reutilizable para que el controlador no mezcle responsabilidades.
 * Idea clave: mantener este codigo separado ayuda a explicar que hace cada parte sin mezclar responsabilidades.
 * Como defenderlo: explicar primero que datos entran, que proceso se aplica y que salida produce.
 * Validacion: remarcar donde se controlan errores para que la app no falle con datos incorrectos.
 */
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

// Elimina espacios de la contraseña por si fue pegada con espacios (ej: "fvyy xrvq nwec rzdp")
const smtpPass = (process.env.SMTP_PASS || '').replace(/\s+/g, '');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: smtpPass
  }
});

// sendWelcomeEmail: Envia una notificacion/correo y devuelve el resultado del intento.
export async function sendWelcomeEmail(toEmail, userName) {
  const mailOptions = {
    from: `"Vase Company 🏆" <${process.env.SMTP_USER}>`,
    to: toEmail,
    subject: '🎉 ¡Ya estás participando en el Gran Sorteo de Vase!',
    html: `
      <!DOCTYPE html>
      <html lang="es">
      <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
      <body style="margin:0;padding:0;background-color:#f5f5f0;font-family:'Segoe UI',Arial,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f0;padding:40px 20px;">
          <tr><td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 10px 40px rgba(41,76,54,0.12);">
              
              <!-- HEADER -->
              <tr>
                <td style="background:linear-gradient(135deg,#1b3324,#294c36);padding:40px 40px 30px;text-align:center;">
                  <p style="margin:0 0 12px;display:inline-block;padding:6px 18px;background:rgba(194,166,99,0.2);border:1px solid rgba(194,166,99,0.5);color:#c2a663;border-radius:99px;font-size:13px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">VASE COMPANY</p>
                  <h1 style="margin:12px 0 0;color:#f5f5f0;font-size:32px;font-weight:700;letter-spacing:-0.5px;">El Gran Sorteo</h1>
                  <p style="margin:8px 0 0;color:#a8bfae;font-size:16px;">de la Temporada</p>
                </td>
              </tr>

              <!-- CUERPO -->
              <tr>
                <td style="padding:40px 40px 30px;">
                  <p style="margin:0 0 8px;font-size:22px;font-weight:700;color:#1b3324;">¡Hola, ${userName}! 🎊</p>
                  <p style="margin:0 0 24px;font-size:16px;color:#576b5d;line-height:1.6;">Tu registro en el <strong style="color:#294c36;">Gran Sorteo de Vase</strong> fue completado exitosamente. Ya estás en la lista de participantes y tenés chances de ganar premios exclusivos.</p>

                  <!-- TICKET -->
                  <div style="background:#f5f5f0;border-radius:16px;padding:24px;border:2px dashed rgba(41,76,54,0.2);text-align:center;margin-bottom:28px;">
                    <p style="margin:0 0 4px;font-size:12px;font-weight:700;color:#a8bfae;letter-spacing:2px;text-transform:uppercase;">Tu ticket de participación</p>
                    <p style="margin:8px 0 0;font-size:28px;font-weight:800;color:#294c36;letter-spacing:3px;">🎫 ACTIVO</p>
                    <p style="margin:8px 0 0;font-size:14px;color:#576b5d;">${toEmail}</p>
                  </div>

                  <!-- PREMIOS -->
                  <p style="margin:0 0 16px;font-size:15px;font-weight:700;color:#1b3324;text-transform:uppercase;letter-spacing:0.05em;">¿Qué podés ganar?</p>
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="padding:10px 14px;background:#f5f5f0;border-radius:10px;margin-bottom:8px;display:block;">
                        🏆 <strong>1er Premio</strong> — Colección Premium Vase (5 piezas)
                      </td>
                    </tr>
                    <tr><td style="height:8px;"></td></tr>
                    <tr>
                      <td style="padding:10px 14px;background:#f5f5f0;border-radius:10px;">
                        🥈 <strong>2do Premio</strong> — Set Decorativo Exclusivo (3 piezas)
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- FOOTER -->
              <tr>
                <td style="background:#1b3324;padding:24px 40px;text-align:center;">
                  <p style="margin:0;font-size:13px;color:#a8bfae;">© 2025 Vase Company — Todos los derechos reservados</p>
                  <p style="margin:6px 0 0;font-size:12px;color:#576b5d;">Este correo fue enviado automáticamente. Por favor no respondas.</p>
                </td>
              </tr>

            </table>
          </td></tr>
        </table>
      </body>
      </html>
    `,
    text: `Hola ${userName},\n\n¡Ya estás participando en el Gran Sorteo de Vase!\nTu correo registrado: ${toEmail}\n\nSuerte!\n— Vase Company`
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email enviado a ${toEmail} — ID: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error('❌ Error al enviar el email:', error.message);
    throw error;
  }
}
