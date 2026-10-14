import type { Request, Response } from "express";
import { cookieOptions, SESSION_COOKIE } from "../../utils/cookies.js";

export function logout(_req: Request, res: Response): void {
  res.clearCookie(SESSION_COOKIE, cookieOptions).json({ message: "Sesión cerrada." });
}
