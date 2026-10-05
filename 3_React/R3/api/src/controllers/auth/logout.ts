import type { Request, Response } from "express";
import { cookieOptions } from "../../utils/cookies.js";

export function logout(_req: Request, res: Response): void {
  res.clearCookie("session", cookieOptions).json({ message: "Sesión cerrada." });
}
