import type { Request, Response } from "express";
import { listProviders } from "../../oauth/providers/index.js";

// devuelve la lista de redes con su estado (habilitada o no); nunca expone las claves
export function oauthProviders(_req: Request, res: Response): void {
  res.json({ providers: listProviders() });
}
