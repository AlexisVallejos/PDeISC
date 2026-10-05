import type { NextFunction, Request, Response } from "express";

export function notFound(_req: Request, res: Response): void {
  res.status(404).json({ message: "Ruta inexistente." });
}

// JSON mal formado o demasiado grande: error del cliente, no del servidor
export function errorHandler(error: any, _req: Request, res: Response, _next: NextFunction): void {
  if (error.type === "entity.parse.failed") { res.status(400).json({ message: "El JSON enviado no es válido." }); return; }
  if (error.type === "entity.too.large") { res.status(413).json({ message: "El pedido es demasiado grande." }); return; }

  console.error(error);
  res.status(500).json({ message: "Ocurrió un error inesperado." });
}
