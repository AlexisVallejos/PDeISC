import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import type { Request, Response } from "express";
import { cookieOptions } from "../utils/cookies.js";
import { OAuthError } from "./oauthError.js";
import { config } from "../config.js";

const COOKIE = "r5_oauth_state";
const { maxAge, ...clearOptions } = cookieOptions;
const stateCookie = { ...clearOptions, maxAge: 10 * 60 * 1000 };

export interface StartStateResult {
  state: string;
  codeChallenge: string;
}

// crea el "state" anti-CSRF y lo deja en una cookie httpOnly.
// Si el proveedor usa PKCE (X), también guarda el verificador y devuelve el desafío que va en la URL.
export function startState(res: Response, providerName: string, withPkce = false, clientOrigin = config.clientUrls[0]): StartStateResult {
  const state = randomBytes(24).toString("hex");
  const verifier = withPkce ? randomBytes(32).toString("base64url") : "";
  const codeChallenge = withPkce ? createHash("sha256").update(verifier).digest("base64url") : "";

  res.cookie(COOKIE, [providerName, state, verifier, Buffer.from(clientOrigin).toString("base64url")].join("."), stateCookie);
  return { state, codeChallenge };
}

// el state que vuelve del proveedor tiene que coincidir con el de la cookie (se usa una sola vez).
// Devuelve el verificador PKCE, o "" si el proveedor no usa PKCE.
export function checkState(req: Request, res: Response, providerName: string, state: unknown): string {
  const { verifier, clientOrigin } = readState(req, providerName, state);
  if (req.headers?.origin && req.headers.origin !== clientOrigin) throw new OAuthError(400, "El ingreso se inició desde otro cliente.");
  res.clearCookie(COOKIE, clearOptions);

  return verifier;
}

export function readState(req: Request, providerName: string, state: unknown): { verifier: string; clientOrigin: string } {
  const saved = typeof req.cookies[COOKIE] === "string" ? req.cookies[COOKIE] : "";

  const [savedProvider = "", savedState = "", verifier = "", originCode = ""] = saved.split(".");
  const expected = Buffer.from(`${providerName}.${typeof state === "string" ? state : ""}`);
  const actual = Buffer.from(`${savedProvider}.${savedState}`);

  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) {
    throw new OAuthError(400, "La verificación de seguridad falló. Volvé a intentar el ingreso.");
  }
  const clientOrigin = Buffer.from(originCode, "base64url").toString();
  if (!config.clientUrls.includes(clientOrigin)) throw new OAuthError(400, "Origen de cliente no válido.");
  return { verifier, clientOrigin };
}
