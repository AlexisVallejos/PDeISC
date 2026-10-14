import type { NextFunction, Request, Response } from "express";
import { listProviders } from "../../oauth/providers/index.js";
import { findByEmail } from "../../services/users/findUser.js";
import { findProviderOfUser } from "../../services/users/identities.js";
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

    // cuenta creada con una red (sin contraseña): le indico con cuál entrar para que el cliente lo redirija
    if (user && !user.password_hash) {
      const providerId = await findProviderOfUser(user.id);
      if (providerId) {
        const label = listProviders().find((item) => item.id === providerId)?.label ?? providerId;
        res.status(409).json({ message: `Esta cuenta se creó con ${label}. Te llevamos a ${label} para ingresar.`, oauthProvider: providerId });
        return;
      }
    }

    const passwordOk = await checkPassword(password, user?.password_hash);
    if (!user || !passwordOk) { res.status(401).json({ message: "Email o contraseña incorrectos." }); return; }

    const { password_hash: _passwordHash, ...publicUser } = user;
    sendSession(res, publicUser);
  } catch (error) {
    next(error);
  }
}
