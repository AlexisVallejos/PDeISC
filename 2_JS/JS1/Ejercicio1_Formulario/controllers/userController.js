/**
 * DOCUMENTACION PARA DEFENDER
 * Archivo: Ejercicio1_Formulario/controllers/userController.js
 * Rol: contiene la logica de validacion y respuesta del controlador usado por el servidor.
 * Idea clave: las reglas de validacion fueron atomizadas en utils/validators.js.
 * Como defenderlo: el controller recibe datos, consulta validadores, envia email y responde JSON.
 * Validacion: si un dato no cumple, se corta el flujo con status 400 y mensaje claro.
 */
import { sendWelcomeEmail } from '../services/emailService.js';
import { isValidEmailDomain, isValidName, VALID_TLDS } from '../utils/validators.js';

export async function registerUser(req, res) {
  try {
    const { name, surname, email } = req.body;

    if (!isValidName(name, 3, 100)) {
      return res.status(400).json({ error: 'El nombre es invalido. Debe tener entre 3 y 100 caracteres y no contener numeros.' });
    }

    if (!isValidName(surname, 2, 100)) {
      return res.status(400).json({ error: 'El apellido es invalido. Debe tener entre 2 y 100 caracteres y no contener numeros.' });
    }

    if (!isValidEmailDomain(email)) {
      return res.status(400).json({ error: `El correo debe ser valido, contener "@" y terminar en uno de estos dominios: ${VALID_TLDS.join(', ')}.` });
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
