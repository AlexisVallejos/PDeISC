import jwt from "jsonwebtoken";
import { config } from "../config.js";

export interface SessionPayload {
  id: number;
}

// el token solo guarda el id: el rol se lee siempre de la BBDD
export const createToken = (user: { id: number }): string =>
  jwt.sign({ id: user.id }, config.jwtSecret, { expiresIn: "8h" });

export const verifyToken = (token: string | undefined): SessionPayload =>
  jwt.verify(token ?? "", config.jwtSecret) as SessionPayload;
