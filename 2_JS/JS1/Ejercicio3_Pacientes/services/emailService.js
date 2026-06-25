import nodemailer from 'nodemailer';

export async function sendWelcomeEmail(toEmail, nombre, apellido) {
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
      from: '"Clínica Médica" <noreply@clinicamedica.com>',
      to: toEmail,
      subject: 'Alta de Paciente Exitosa',
      text: `Estimado/a ${nombre} ${apellido}, ha sido registrado correctamente en nuestro sistema de pacientes.`
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Correo de paciente enviado:', nodemailer.getTestMessageUrl(info));
    return info;
  } catch (error) {
    console.warn('No se pudo enviar el correo de prueba del paciente. Se usa confirmacion local.', error.message);
    return fallback;
  }
}

