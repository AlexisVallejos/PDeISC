import type { CookieOptions, Response } from "express";
import type { PublicUser } from "../types/user.js";
import { createToken } from "./token.js";

export const cookieOptions: CookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  maxAge: 8 * 60 * 60 * 1000,
};

// guarda la sesión en una cookie httpOnly y responde con el usuario
export function sendSession(res: Response, user: PublicUser, status = 200): void {
  res.cookie("session", createToken(user), cookieOptions).status(status).json({ user });
}
