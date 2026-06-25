import { sendWelcomeEmail } from '../services/emailService.js';

const isValidName = (str) => {
  const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
  return regex.test(str);
};

export async function registerUser(req, res) {
  try {
    const { name, surname, email } = req.body;

    if (!name || name.length < 3 || name.length > 100 || !isValidName(name)) {
      return res.status(400).json({ error: 'El nombre es inválido. Debe tener entre 3 y 100 caracteres y no contener números.' });
    }

    if (!surname || surname.length < 2 || surname.length > 100 || !isValidName(surname)) {
      return res.status(400).json({ error: 'El apellido es inválido. Debe tener entre 2 y 100 caracteres y no contener números.' });
    }

    const validTlds = ['.com', '.ar', '.net', '.org', '.edu'];
    const hasValidTld = validTlds.some((tld) => email?.endsWith(tld));
    if (!email || !email.includes('@') || !hasValidTld) {
      return res.status(400).json({ error: `El correo debe ser válido, contener "@" y terminar en uno de estos dominios: ${validTlds.join(', ')}.` });
    }

    const newUser = { id: Date.now(), name, surname, email };

    await sendWelcomeEmail(email, name);

    return res.status(201).json({
      message: 'Usuario registrado exitosamente',
      user: newUser
    });
  } catch (error) {
    console.error('Error en el registro:', error);
    return res.status(500).json({ error: 'Error interno del servidor al procesar el registro.' });
  }
}
