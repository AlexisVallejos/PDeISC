import nodemailer from 'nodemailer';

export async function sendWelcomeSocioEmail(toEmail, documento) {
  const fallback = {
    accepted: [toEmail],
    response: 'mock-email-ok',
    previewUrl: null
  };

  try {
    // Usar la configuracion real de Gmail desde .env
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    const mailOptions = {
      from: `"AFA ID - Socios" <${process.env.SMTP_USER}>`,
      to: toEmail,
      subject: 'Bienvenido a AFA ID - Asociacion del Futbol Argentino',
      text: `Felicidades, el documento ${documento} ha sido registrado exitosamente como socio oficial de la AFA.`
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Correo de bienvenida AFA ID enviado a:', toEmail);
    return info;
  } catch (error) {
    console.error('Error al enviar el correo real del socio:', error.message);
    return fallback;
  }
}

export async function sendInventoryEmail(toEmail, encargadoNombre, nombreProducto) {
  const fallback = {
    accepted: [toEmail],
    response: 'mock-email-ok',
    previewUrl: null
  };

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    const mailOptions = {
      from: `"AFA ID" <${process.env.SMTP_USER}>`,
      to: toEmail,
      subject: 'Item de inventario registrado',
      text: `Hola ${encargadoNombre}, el producto ${nombreProducto} fue registrado correctamente.`
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Correo de inventario enviado a:', toEmail);
    return info;
  } catch (error) {
    console.error('Error al enviar el correo real de inventario:', error.message);
    return fallback;
  }
}
