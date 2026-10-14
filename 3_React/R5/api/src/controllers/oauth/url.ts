import type { NextFunction, Request, Response } from "express";
import { sendOAuthError } from "../../oauth/oauthError.js";
import { getProvider } from "../../oauth/providers/index.js";
import { redirectUri } from "../../oauth/redirectUri.js";
import { startState } from "../../oauth/state.js";
import { config } from "../../config.js";
import { OAuthError } from "../../oauth/oauthError.js";

// paso 1: le devuelvo al cliente la dirección del proveedor a la que tiene que ir
export function oauthUrl(req: Request, res: Response, next: NextFunction): void {
  try {
    const provider = getProvider(req.body.provider);
    const clientOrigin = req.body.clientOrigin || config.clientUrls[0];
    if (typeof clientOrigin !== "string" || !config.clientUrls.includes(clientOrigin)) throw new OAuthError(400, "Origen de cliente no válido.");
    const { state, codeChallenge } = startState(res, provider.name, provider.pkce, clientOrigin);
    res.json({ url: provider.buildUrl(state, redirectUri(provider.name), codeChallenge) });
  } catch (error) {
    sendOAuthError(error, res, next);
  }
}
