import { sendWelcomeSocioEmail } from '../services/emailService.js';

const sociosDB = [];

export async function registerSocio(req, res) {
  try {
    const {
      nombre,
      apellido,
      tipo_documento,
      documento,
      tramite,
      nacionalidad,
      sexo,
      email,
      telefono,
      password,
      metodo_almacenaje
    } = req.body;

    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nombre || nombre.trim().length < 3 || nombre.trim().length > 50 || !nameRegex.test(nombre.trim())) {
      return res.status(400).json({ error: 'El nombre debe tener entre 3 y 50 letras (sin numeros ni caracteres especiales).' });
    }
    if (!apellido || apellido.trim().length < 2 || apellido.trim().length > 50 || !nameRegex.test(apellido.trim())) {
      return res.status(400).json({ error: 'El apellido debe tener entre 2 y 50 letras (sin numeros ni caracteres especiales).' });
    }

    if (!documento || !/^\d+$/.test(documento)) {
      return res.status(400).json({ error: 'El documento debe contener solo números.' });
    }
    if (!tramite || !/^\d+$/.test(tramite)) {
      return res.status(400).json({ error: 'El número de trámite debe contener solo números.' });
    }
    if (!nacionalidad || nacionalidad.trim().length < 2) {
      return res.status(400).json({ error: 'Nacionalidad inválida.' });
    }
    if (!['Masculino', 'Femenino', 'No Binario'].includes(sexo)) {
      return res.status(400).json({ error: 'Sexo inválido.' });
    }
    if (!telefono || !/^\+?\d{8,20}$/.test(telefono)) {
      return res.status(400).json({ error: 'Teléfono inválido.' });
    }

    const validTlds = ['.com', '.ar', '.net', '.org', '.edu'];
    const hasValidTld = validTlds.some((tld) => email?.endsWith(tld));
    if (!email || !email.includes('@') || !hasValidTld) {
      return res.status(400).json({ error: `El correo debe terminar en: ${validTlds.join(', ')}.` });
    }

    const pwdRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[.!\@#\$%\^&\*\(\)\-\+\?]).{12,}$/;
    if (!password || !pwdRegex.test(password)) {
      return res.status(400).json({ error: 'La contraseña no cumple con los requisitos de seguridad.' });
    }

    const exists = sociosDB.some((s) => s.tramite === tramite);
    if (exists) {
      return res.status(400).json({ error: 'Este número de trámite ya ha sido utilizado.' });
    }

    const newSocio = {
      id: Date.now(),
      nombre: nombre.trim(),
      apellido: apellido.trim(),
      tipo_documento,
      documento,
      tramite,
      nacionalidad,
      sexo,
      email,
      telefono,
      metodo_almacenaje
    };

    sociosDB.push(newSocio);
    await sendWelcomeSocioEmail(email, documento);

    return res.status(201).json({
      message: 'Registro de Socio de River exitoso',
      socio: newSocio
    });
  } catch (error) {
    console.error('Error en el registro del socio:', error);
    return res.status(500).json({ error: 'Error interno del servidor.' });
  }
}
