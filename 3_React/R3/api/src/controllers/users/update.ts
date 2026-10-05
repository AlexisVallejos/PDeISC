import type { NextFunction, Request, Response } from "express";
import { findByEmail, findById } from "../../services/users/findUser.js";
import { updateUser } from "../../services/users/updateUser.js";
import { hashPassword } from "../../utils/passwords.js";
import { toId } from "../../utils/toId.js";
import { normalizeEmail } from "../../validators/emailValidator.js";
import { hasErrors, isValidRole, validateUser } from "../../validators/userValidator.js";

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { nombre, email, password, rol } = req.body;
    const id = toId(req.body.id);
    if (!id) { res.status(400).json({ message: "Usuario inválido." }); return; }
    if (!(await findById(id))) { res.status(404).json({ message: "Usuario no encontrado." }); return; }

    if (id === req.user.id && rol !== "administrador") {
      res.status(400).json({ message: "No podés cambiar tu propio rol." });
      return;
    }

    const errors = validateUser({ nombre, email, password }, false);
    if (hasErrors(errors) || !isValidRole(rol)) { res.status(400).json({ message: "Datos inválidos.", errors }); return; }

    const cleanEmail = normalizeEmail(email);
    const sameEmail = await findByEmail(cleanEmail);
    if (sameEmail && sameEmail.id !== id) { res.status(409).json({ message: "Ese email ya está registrado." }); return; }

    const passwordHash = password ? await hashPassword(password) : undefined;
    res.json({ user: await updateUser(id, { nombre, email: cleanEmail, passwordHash, rol }) });
  } catch (error) {
    next(error);
  }
}
