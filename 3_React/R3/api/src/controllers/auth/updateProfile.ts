import type { NextFunction, Request, Response } from "express";
import { findByEmail } from "../../services/users/findUser.js";
import { updateUser } from "../../services/users/updateUser.js";
import { sendSession } from "../../utils/cookies.js";
import { hashPassword } from "../../utils/passwords.js";
import { normalizeEmail } from "../../validators/emailValidator.js";
import { hasErrors, validateUser } from "../../validators/userValidator.js";

// el usuario edita sus propios datos; nunca puede cambiarse el rol
export async function updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { nombre, email, password } = req.body;

    const errors = validateUser({ nombre, email, password }, false);
    if (hasErrors(errors)) { res.status(400).json({ message: "Revisá los datos ingresados.", errors }); return; }

    const cleanEmail = normalizeEmail(email);
    const sameEmail = await findByEmail(cleanEmail);
    if (sameEmail && sameEmail.id !== req.user.id) { res.status(409).json({ message: "Ese email ya está registrado." }); return; }

    const passwordHash = password ? await hashPassword(password) : undefined;
    const user = await updateUser(req.user.id, { nombre, email: cleanEmail, passwordHash });
    if (!user) { res.status(404).json({ message: "Usuario no encontrado." }); return; }
    sendSession(res, user);
  } catch (error) {
    next(error);
  }
}
