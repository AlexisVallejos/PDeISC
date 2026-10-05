import type { NextFunction, Request, Response } from "express";
import { createUser } from "../../services/users/createUser.js";
import { findByEmail } from "../../services/users/findUser.js";
import { hashPassword } from "../../utils/passwords.js";
import { normalizeEmail } from "../../validators/emailValidator.js";
import { hasErrors, isValidRole, validateUser } from "../../validators/userValidator.js";

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { nombre, email, password, rol } = req.body;

    const errors = validateUser({ nombre, email, password });
    if (hasErrors(errors) || !isValidRole(rol)) { res.status(400).json({ message: "Datos inválidos.", errors }); return; }

    const cleanEmail = normalizeEmail(email);
    if (await findByEmail(cleanEmail)) { res.status(409).json({ message: "Ese email ya está registrado." }); return; }

    const passwordHash = await hashPassword(password);
    const user = await createUser({ nombre, email: cleanEmail, passwordHash, rol });
    res.status(201).json({ user });
  } catch (error) {
    next(error);
  }
}
