import type { NextFunction, Request, Response } from "express";
import { createUser } from "../../services/users/createUser.js";
import { findByEmail } from "../../services/users/findUser.js";
import { sendSession } from "../../utils/cookies.js";
import { hashPassword } from "../../utils/passwords.js";
import { normalizeEmail } from "../../validators/emailValidator.js";
import { hasErrors, validateUser } from "../../validators/userValidator.js";

export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { nombre, email, password } = req.body;

    const errors = validateUser({ nombre, email, password });
    if (hasErrors(errors)) { res.status(400).json({ message: "Revisá los datos ingresados.", errors }); return; }

    const cleanEmail = normalizeEmail(email);
    if (await findByEmail(cleanEmail)) { res.status(409).json({ message: "Ese email ya está registrado." }); return; }

    const passwordHash = await hashPassword(password);
    const user = await createUser({ nombre, email: cleanEmail, passwordHash });
    if (!user) { res.status(500).json({ message: "No se pudo crear el usuario." }); return; }
    sendSession(res, user, 201);
  } catch (error) {
    next(error);
  }
}
