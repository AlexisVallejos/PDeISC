import type { Request, Response } from "express";

// requireAuth ya cargó el usuario desde la BBDD
export function session(req: Request, res: Response): void {
  res.json({ user: req.user });
}
