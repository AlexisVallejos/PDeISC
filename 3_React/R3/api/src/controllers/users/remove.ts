import type { NextFunction, Request, Response } from "express";
import { findById } from "../../services/users/findUser.js";
import { removeUser } from "../../services/users/removeUser.js";
import { toId } from "../../utils/toId.js";

export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = toId(req.body.id);
    if (!id) { res.status(400).json({ message: "Usuario inválido." }); return; }
    if (id === req.user.id) { res.status(400).json({ message: "No podés eliminar tu propia cuenta." }); return; }
    if (!(await findById(id))) { res.status(404).json({ message: "Usuario no encontrado." }); return; }

    await removeUser(id);
    res.json({ message: "Usuario eliminado." });
  } catch (error) {
    next(error);
  }
}
