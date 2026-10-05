import type { NextFunction, Request, Response } from "express";

// si el pedido llega sin cuerpo JSON, usamos un objeto vacío para no romper al leer campos
export function ensureBody(req: Request, _res: Response, next: NextFunction): void {
  if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) req.body = {};
  next();
}
