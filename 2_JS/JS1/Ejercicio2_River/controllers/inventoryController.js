/**
 * DOCUMENTACION PARA DEFENDER
 * Archivo: Ejercicio2_River/controllers/inventoryController.js
 * Rol: contiene la logica de validacion y respuesta del controlador usado por el servidor.
 * Idea clave: las reglas repetidas viven en utils/validators.js y el controller queda mas chico.
 * Como defenderlo: valida entrada, arma el item, envia email y responde JSON.
 * Validacion: cada error de usuario responde 400 antes de guardar o enviar email.
 */
import { sendInventoryEmail } from '../services/emailService.js';
import { isNonNegativeNumber, isValidEmailDomain, isValidName } from '../utils/validators.js';

export async function addItem(req, res) {
  try {
    const {
      encargado_nombre,
      encargado_apellido,
      email_contacto,
      categoria,
      nombre_producto,
      precio,
      stock,
      metodo_almacenaje
    } = req.body;

    if (!isValidName(encargado_nombre, 3, 100)) {
      return res.status(400).json({ error: 'El nombre del encargado es invalido (3-100 caracteres, sin numeros).' });
    }
    if (!isValidName(encargado_apellido, 2, 100)) {
      return res.status(400).json({ error: 'El apellido del encargado es invalido (2-100 caracteres, sin numeros).' });
    }
    if (!isValidEmailDomain(email_contacto)) {
      return res.status(400).json({ error: 'El correo debe contener "@" y terminar con un dominio valido.' });
    }
    if (!nombre_producto || nombre_producto.length < 2) {
      return res.status(400).json({ error: 'El nombre del producto es invalido.' });
    }
    if (!isNonNegativeNumber(precio)) {
      return res.status(400).json({ error: 'El precio debe ser un numero positivo.' });
    }
    if (!isNonNegativeNumber(stock)) {
      return res.status(400).json({ error: 'El stock debe ser un numero positivo.' });
    }

    const newItem = {
      id: Date.now(),
      encargado_nombre,
      encargado_apellido,
      email_contacto,
      categoria,
      nombre_producto,
      precio: parseFloat(precio),
      stock: parseInt(stock, 10),
      metodo_almacenaje
    };

    await sendInventoryEmail(email_contacto, encargado_nombre, nombre_producto);

    return res.status(201).json({
      message: 'Item registrado exitosamente en el inventario.',
      item: newItem
    });
  } catch (error) {
    console.error('Error en el registro del inventario:', error);
    return res.status(500).json({ error: 'Error interno del servidor.' });
  }
}
