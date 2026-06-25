/**
 * DOCUMENTACION PARA DEFENDER
 * Archivo: Ejercicio3_Pacientes/controllers/patientController.js
 * Rol: contiene la logica de validacion y respuesta del controlador usado por el servidor.
 * Idea clave: las reglas de pacientes fueron atomizadas en utils/patientValidators.js.
 * Como defenderlo: el controller valida, controla duplicados, guarda en memoria y responde al frontend.
 * Validacion: los campos obligatorios y reglas de negocio cortan el flujo antes de crear el paciente.
 */
import { sendWelcomeEmail } from '../services/emailService.js';
import {
  calculateAge,
  hasChildren,
  isLetters,
  isValidAge,
  isValidDni,
  isValidEmail,
  isValidPhone
} from '../utils/patientValidators.js';

const memoryDB = { pacientes: [] };

export async function registerPatient(req, res) {
  try {
    const data = req.body;

    const requiredFields = [
      'nombre', 'apellido', 'edad', 'fechaNacimiento', 'sexo', 'dni',
      'estadoCivil', 'nacionalidad', 'telefono', 'email', 'obraSocial',
      'tipoSangre', 'tieneHijos', 'emergenciaNombre', 'emergenciaVinculo',
      'emergenciaTelefono', 'alergias'
    ];

    for (const field of requiredFields) {
      if (!data[field] || String(data[field]).trim() === '') {
        return res.status(400).json({ error: `Campo obligatorio faltante: ${field}` });
      }
    }

    if (!isLetters(data.nombre, 3, 100)) {
      return res.status(400).json({ error: 'Nombre invalido. Solo letras (min. 3, max. 100 caracteres).' });
    }
    if (!isLetters(data.apellido, 2, 100)) {
      return res.status(400).json({ error: 'Apellido invalido. Solo letras (min. 2, max. 100 caracteres).' });
    }
    if (!isValidDni(data.dni)) {
      return res.status(400).json({ error: 'DNI invalido.' });
    }
    if (!isValidPhone(data.telefono) || !isValidPhone(data.emergenciaTelefono)) {
      return res.status(400).json({ error: 'Telefono invalido.' });
    }
    if (!isValidEmail(data.email)) {
      return res.status(400).json({ error: 'Email invalido.' });
    }
    if (!['Masculino', 'Femenino'].includes(data.sexo)) {
      return res.status(400).json({ error: 'Sexo invalido.' });
    }

    const edadNum = Number(data.edad);
    if (!isValidAge(data.edad)) {
      return res.status(400).json({ error: 'Edad invalida.' });
    }

    const edadCalculada = calculateAge(data.fechaNacimiento);
    if (!isValidAge(edadCalculada)) {
      return res.status(400).json({ error: 'Fecha de nacimiento invalida.' });
    }
    if (edadCalculada !== edadNum) {
      return res.status(400).json({ error: `La edad no coincide con la fecha de nacimiento. Edad esperada: ${edadCalculada}.` });
    }

    if (hasChildren(data.tieneHijos)) {
      const hijos = Number(data.cantidadHijos);
      if (!Number.isInteger(hijos) || hijos < 1 || hijos > 20) {
        return res.status(400).json({ error: 'Si tiene hijos, cantidadHijos debe estar entre 1 y 20.' });
      }
    }

    if (data.tieneHijos === 'No') {
      data.cantidadHijos = '';
    }

    if (!isLetters(data.emergenciaNombre, 3, 100)) {
      return res.status(400).json({ error: 'Nombre de emergencia invalido.' });
    }
    if (String(data.alergias).trim().length < 4) {
      return res.status(400).json({ error: 'Alergias invalido: minimo 4 caracteres.' });
    }

    const isTramiteDuplicated = memoryDB.pacientes.some((p) => p.tramite === data.tramite);
    const isEmailDuplicated = memoryDB.pacientes.some((p) => p.email === data.email);

    if (data.tramite && isTramiteDuplicated) {
      return res.status(409).json({ error: 'El numero de tramite ya se encuentra registrado.' });
    }
    if (isEmailDuplicated) {
      return res.status(409).json({ error: 'El Email ya se encuentra registrado en el sistema.' });
    }

    const newPatient = { id: Date.now(), ...data };
    memoryDB.pacientes.push(newPatient);

    await sendWelcomeEmail(data.email, data.nombre, data.apellido);

    return res.status(201).json({
      message: 'Paciente registrado correctamente.',
      paciente: newPatient
    });
  } catch (error) {
    console.error('Error en el registro del paciente:', error);
    return res.status(500).json({ error: 'Error interno del servidor.' });
  }
}
