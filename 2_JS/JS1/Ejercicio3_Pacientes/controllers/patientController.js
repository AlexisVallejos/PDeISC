import { sendWelcomeEmail } from '../services/emailService.js';

const memoryDB = { pacientes: [] };

const onlyLetters = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
const dniRegex = /^\d{7,8}$/;
const phoneRegex = /^\d{10,15}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function calculateAge(birthDateStr) {
  const today = new Date();
  const birthDate = new Date(birthDateStr);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
  return age;
}

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

    if (!onlyLetters.test(data.nombre) || data.nombre.trim().length < 3 || data.nombre.trim().length > 100) {
      return res.status(400).json({ error: 'Nombre inválido. Solo letras (mín. 3, máx. 100 caracteres).' });
    }

    if (!onlyLetters.test(data.apellido) || data.apellido.trim().length < 2 || data.apellido.trim().length > 100) {
      return res.status(400).json({ error: 'Apellido inválido. Solo letras (mín. 2, máx. 100 caracteres).' });
    }

    if (!dniRegex.test(data.dni)) {
      return res.status(400).json({ error: 'DNI inválido.' });
    }

    if (!phoneRegex.test(data.telefono) || !phoneRegex.test(data.emergenciaTelefono)) {
      return res.status(400).json({ error: 'Teléfono inválido.' });
    }

    if (!emailRegex.test(data.email)) {
      return res.status(400).json({ error: 'Email inválido.' });
    }

    if (!['Masculino', 'Femenino'].includes(data.sexo)) {
      return res.status(400).json({ error: 'Sexo inválido.' });
    }

    const edadNum = Number(data.edad);
    if (!Number.isInteger(edadNum) || edadNum < 0 || edadNum > 120) {
      return res.status(400).json({ error: 'Edad inválida.' });
    }

    const edadCalculada = calculateAge(data.fechaNacimiento);
    if (!Number.isInteger(edadCalculada) || edadCalculada < 0 || edadCalculada > 120) {
      return res.status(400).json({ error: 'Fecha de nacimiento inválida.' });
    }

    if (edadCalculada !== edadNum) {
      return res.status(400).json({ error: `La edad no coincide con la fecha de nacimiento. Edad esperada: ${edadCalculada}.` });
    }

    if (data.tieneHijos === 'Sí') {
      const hijos = Number(data.cantidadHijos);
      if (!Number.isInteger(hijos) || hijos < 1 || hijos > 20) {
        return res.status(400).json({ error: 'Si tiene hijos, cantidadHijos debe estar entre 1 y 20.' });
      }
    }

    if (data.tieneHijos === 'No') {
      data.cantidadHijos = '';
    }

    if (!onlyLetters.test(data.emergenciaNombre) || data.emergenciaNombre.trim().length < 3) {
      return res.status(400).json({ error: 'Nombre de emergencia inválido.' });
    }

    if (String(data.alergias).trim().length < 4) {
      return res.status(400).json({ error: 'Alergias inválido: mínimo 4 caracteres.' });
    }

    const isTramiteDuplicated = memoryDB.pacientes.some((p) => p.tramite === data.tramite);
    const isEmailDuplicated = memoryDB.pacientes.some((p) => p.email === data.email);

    if (data.tramite && isTramiteDuplicated) {
      return res.status(409).json({ error: 'El número de trámite ya se encuentra registrado.' });
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
