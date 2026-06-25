import nodemailer from 'nodemailer';

export async function sendWelcomeSocioEmail(toEmail, documento) {
  const fallback = {
    accepted: [toEmail],
    response: 'mock-email-ok',
    previewUrl: null
  };

  try {
    const testAccount = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });

    const mailOptions = {
      from: '"Socios River Plate" <noreply@sociosriver.com>',
      to: toEmail,
      subject: 'Bienvenido a River Plate',
      text: `Felicidades, el documento ${documento} ha sido registrado como socio.`
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Correo de bienvenida enviado:', nodemailer.getTestMessageUrl(info));
    return info;
  } catch (error) {
    console.warn('No se pudo enviar el correo de prueba del socio. Se usa confirmacion local.', error.message);
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
    const testAccount = await nodemailer.createTestAccount();
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });

    const mailOptions = {
      from: '\"Inventario River\" <noreply@inventarioriver.com>',
      to: toEmail,
      subject: 'Item de inventario registrado',
      text: `Hola ${encargadoNombre}, el producto ${nombreProducto} fue registrado correctamente.`
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Correo de inventario enviado:', nodemailer.getTestMessageUrl(info));
    return info;
  } catch (error) {
    console.warn('No se pudo enviar el correo de inventario. Se usa confirmacion local.', error.message);
    return fallback;
  }
}


