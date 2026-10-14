import type { Request, Response } from "express";
import { readState } from "../../oauth/state.js";
import { getProvider } from "../../oauth/providers/index.js";

// Los proveedores vuelven a una sola URL; el state indica a cuál de los seis clientes regresar.
export function oauthReturn(req: Request, res: Response): void {
  try {
    const provider = getProvider(req.params.provider);
    const { clientOrigin } = readState(req, provider.name, req.query.state);
    const target = new URL(`/auth/${provider.name}/callback`, clientOrigin);
    for (const key of ["code", "state", "error"]) {
      const value = req.query[key];
      if (typeof value === "string") target.searchParams.set(key, value);
    }
    res.redirect(303, target.toString());
  } catch {
    res.status(400).json({ message: "La verificación de seguridad falló. Volvé a intentar el ingreso." });
  }
}
