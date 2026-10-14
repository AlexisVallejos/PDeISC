import type { NextFunction, Request, Response } from "express";
import { OAuthError, sendOAuthError } from "../../oauth/oauthError.js";
import { getProvider } from "../../oauth/providers/index.js";
import { redirectUri } from "../../oauth/redirectUri.js";
import { checkState } from "../../oauth/state.js";
import { resolveOAuthUser } from "../../services/oauth/resolveUser.js";
import { sendSession } from "../../utils/cookies.js";
import { isText } from "../../validators/text.js";
import type { OAuthProfile, OAuthProvider } from "../../types/oauth.js";

// paso 2: el cliente vuelve del proveedor con "code" y "state"; los valido, canjeo el código y abro la sesión
export async function oauthCallback(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { provider: providerName, code, state } = req.body;
    const provider = getProvider(providerName);

    const codeVerifier = checkState(req, res, provider.name, state);
    if (!isText(code) || !code || code.length > 2000) throw new OAuthError(400, "Falta el código de autorización.");

    const profile = await fetchProfile(provider, code, codeVerifier);
    const user = await resolveOAuthUser(provider, profile);
    sendSession(res, user);
  } catch (error) {
    sendOAuthError(error, res, next);
  }
}

async function fetchProfile(provider: OAuthProvider, code: string, codeVerifier: string): Promise<OAuthProfile> {
  try {
    return await provider.fetchProfile(code, redirectUri(provider.name), codeVerifier);
  } catch (error) {
    console.error(`[oauth:${provider.name}]`, (error as Error).message);
    throw new OAuthError(502, `No pudimos validar tu cuenta de ${provider.label}. Probá de nuevo.`);
  }
}
