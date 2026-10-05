import type { NextFunction, Request, Response } from "express";

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  if (req.user.rol !== "administrador") {
    res.status(403).json({ message: "Acceso exclusivo para administradores." });
    return;
  }
  next();
}
