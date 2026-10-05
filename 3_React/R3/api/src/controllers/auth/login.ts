import type { NextFunction, Request, Response } from "express";
import { findByEmail } from "../../services/users/findUser.js";
import { sendSession } from "../../utils/cookies.js";
import { checkPassword } from "../../utils/passwords.js";
import { normalizeEmail } from "../../validators/emailValidator.js";
import { isText } from "../../validators/text.js";

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, password } = req.body;
    if (!isText(email) || !isText(password)) {
      res.status(400).json({ message: "Ingresá tu email y tu contraseña." });
      return;
    }

    const user = await findByEmail(normalizeEmail(email));
    const passwordOk = await checkPassword(password, user?.password_hash);
    if (!user || !passwordOk) { res.status(401).json({ message: "Email o contraseña incorrectos." }); return; }

    const { password_hash: _passwordHash, ...publicUser } = user;
    sendSession(res, publicUser);
  } catch (error) {
    next(error);
  }
}
