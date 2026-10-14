import type { NextFunction, Response } from "express";

// error "esperado" del ingreso con redes: lleva el código HTTP y un mensaje para mostrar
export class OAuthError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

// responde con el mensaje si es un OAuthError; si no, lo pasa al manejador general
export function sendOAuthError(error: unknown, res: Response, next: NextFunction): void {
  if (error instanceof OAuthError) { res.status(error.status).json({ message: error.message }); return; }
  next(error);
}
