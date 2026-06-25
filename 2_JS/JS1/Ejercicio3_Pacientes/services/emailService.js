import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

// Elimina espacios de la contraseña por si fue pegada con espacios
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

export async function sendWelcomeEmail(toEmail, userName) {
  const mailOptions = {
    from: `"Geclisa — Sistema Clínico" <${process.env.SMTP_USER}>`,
    to: toEmail,
    subject: '✅ Registro de Paciente Confirmado — Geclisa',
    html: `
      <!DOCTYPE html>
      <html lang="es">
      <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
      <body style="margin:0;padding:0;background-color:#f0f4f3;font-family:'Segoe UI',Arial,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0f4f3;padding:40px 20px;">
          <tr><td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 10px 40px rgba(26,122,92,0.12);">
              
              <!-- HEADER -->
              <tr>
                <td style="background:linear-gradient(135deg,#0f5a42,#1a7a5c);padding:36px 40px 28px;text-align:center;">
                  <p style="margin:0 0 10px;display:inline-block;padding:5px 16px;background:rgba(232,168,56,0.2);border:1px solid rgba(232,168,56,0.5);color:#e8a838;border-radius:99px;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">GECLISA</p>
                  <h1 style="margin:10px 0 0;color:#f0f4f3;font-size:28px;font-weight:700;">Sistema de Gestión Clínica</h1>
                  <p style="margin:6px 0 0;color:#a8d4c0;font-size:15px;">Módulo de Admisión de Pacientes</p>
                </td>
              </tr>

              <!-- CUERPO -->
              <tr>
                <td style="padding:36px 40px 28px;">
                  <p style="margin:0 0 6px;font-size:20px;font-weight:700;color:#0f5a42;">Paciente registrado: ${userName}</p>
                  <p style="margin:0 0 20px;font-size:15px;color:#5a7a6e;line-height:1.6;">El alta del paciente en el sistema <strong style="color:#1a7a5c;">Geclisa</strong> fue completada exitosamente. Los datos quedaron registrados en el módulo de admisión.</p>

                  <!-- ESTADO -->
                  <div style="background:#f0f4f3;border-radius:14px;padding:20px;border:2px dashed rgba(26,122,92,0.2);text-align:center;margin-bottom:24px;">
                    <p style="margin:0 0 4px;font-size:11px;font-weight:700;color:#5a7a6e;letter-spacing:2px;text-transform:uppercase;">Estado del registro</p>
                    <p style="margin:6px 0 0;font-size:24px;font-weight:800;color:#1a7a5c;letter-spacing:2px;">🏥 CONFIRMADO</p>
                    <p style="margin:6px 0 0;font-size:13px;color:#5a7a6e;">${toEmail}</p>
                  </div>

                  <p style="margin:0 0 12px;font-size:14px;font-weight:700;color:#0f5a42;text-transform:uppercase;letter-spacing:0.05em;">Próximos pasos</p>
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="padding:10px 14px;background:#f0f4f3;border-radius:10px;display:block;font-size:14px;color:#1a2e28;">
                        📋 La ficha del paciente está disponible en el sistema
                      </td>
                    </tr>
                    <tr><td style="height:6px;"></td></tr>
                    <tr>
                      <td style="padding:10px 14px;background:#f0f4f3;border-radius:10px;font-size:14px;color:#1a2e28;">
                        🩺 Puede agendar turnos desde el módulo de Turnos
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- FOOTER -->
              <tr>
                <td style="background:#0f5a42;padding:20px 40px;text-align:center;">
                  <p style="margin:0;font-size:12px;color:#a8d4c0;">© 2025 Geclisa — Sistema de Gestión Clínica</p>
                  <p style="margin:4px 0 0;font-size:11px;color:#5a7a6e;">Este correo fue generado automáticamente. No responder.</p>
                </td>
              </tr>

            </table>
          </td></tr>
        </table>
      </body>
      </html>
    `,
    text: `Hola ${userName},\n\nSu registro como paciente en Geclisa fue confirmado.\nCorreo registrado: ${toEmail}\n\n— Geclisa | Sistema de Gestión Clínica`
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
