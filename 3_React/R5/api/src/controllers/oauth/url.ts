import type { NextFunction, Request, Response } from "express";
import { sendOAuthError } from "../../oauth/oauthError.js";
import { getProvider } from "../../oauth/providers/index.js";
import { redirectUri } from "../../oauth/redirectUri.js";
import { startState } from "../../oauth/state.js";

// paso 1: le devuelvo al cliente la dirección del proveedor a la que tiene que ir
export function oauthUrl(req: Request, res: Response, next: NextFunction): void {
  try {
    const provider = getProvider(req.body.provider);
    const { state, codeChallenge } = startState(res, provider.name, provider.pkce);
    res.json({ url: provider.buildUrl(state, redirectUri(provider.name), codeChallenge) });
  } catch (error) {
    sendOAuthError(error, res, next);
  }
}
