/**
 * DOCUMENTACION PARA DEFENDER
 * Archivo: Ejercicio2_River/controllers/socioController.js
 * Rol: contiene la logica de validacion y respuesta del controlador usado por el servidor.
 * Idea clave: las validaciones fueron atomizadas en utils/validators.js para no mezclar regex con flujo HTTP.
 * Como defenderlo: se valida cada campo, se controla duplicado, se guarda en memoria y se envia email.
 * Validacion: cada regla devuelve un error claro antes de crear el socio.
 */
import { sendWelcomeSocioEmail } from '../services/emailService.js';
import {
  isNumericText,
  isStrongPassword,
  isValidEmailDomain,
  isValidName,
  isValidPhone,
  VALID_TLDS
} from '../utils/validators.js';

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

    if (!isValidName(nombre, 3, 50)) {
      return res.status(400).json({ error: 'El nombre debe tener entre 3 y 50 letras (sin numeros ni caracteres especiales).' });
    }
    if (!isValidName(apellido, 2, 50)) {
      return res.status(400).json({ error: 'El apellido debe tener entre 2 y 50 letras (sin numeros ni caracteres especiales).' });
    }
    if (!isNumericText(documento)) {
      return res.status(400).json({ error: 'El documento debe contener solo numeros.' });
    }
    if (!isNumericText(tramite)) {
      return res.status(400).json({ error: 'El numero de tramite debe contener solo numeros.' });
    }
    if (!nacionalidad || nacionalidad.trim().length < 2) {
      return res.status(400).json({ error: 'Nacionalidad invalida.' });
    }
    if (!['Masculino', 'Femenino', 'No Binario'].includes(sexo)) {
      return res.status(400).json({ error: 'Sexo invalido.' });
    }
    if (!isValidPhone(telefono)) {
      return res.status(400).json({ error: 'Telefono invalido.' });
    }
    if (!isValidEmailDomain(email)) {
      return res.status(400).json({ error: `El correo debe terminar en: ${VALID_TLDS.join(', ')}.` });
    }
    if (!isStrongPassword(password)) {
      return res.status(400).json({ error: 'La contrasena no cumple con los requisitos de seguridad.' });
    }

    const exists = sociosDB.some((s) => s.tramite === tramite);
    if (exists) {
      return res.status(400).json({ error: 'Este numero de tramite ya ha sido utilizado.' });
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
      message: 'Registro de Socio AFA ID exitoso',
      socio: newSocio
    });
  } catch (error) {
    console.error('Error en el registro del socio:', error);
    return res.status(500).json({ error: 'Error interno del servidor.' });
  }
}
