import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import type { Request, Response } from "express";
import { cookieOptions } from "../utils/cookies.js";
import { OAuthError } from "./oauthError.js";

const COOKIE = "oauth_state";
const { maxAge, ...clearOptions } = cookieOptions;
const stateCookie = { ...clearOptions, maxAge: 10 * 60 * 1000 };

export interface StartStateResult {
  state: string;
  codeChallenge: string;
}

// crea el "state" anti-CSRF y lo deja en una cookie httpOnly.
// Si el proveedor usa PKCE (X), también guarda el verificador y devuelve el desafío que va en la URL.
export function startState(res: Response, providerName: string, withPkce = false): StartStateResult {
  const state = randomBytes(24).toString("hex");
  const verifier = withPkce ? randomBytes(32).toString("base64url") : "";
  const codeChallenge = withPkce ? createHash("sha256").update(verifier).digest("base64url") : "";

  res.cookie(COOKIE, [providerName, state, verifier].filter(Boolean).join("."), stateCookie);
  return { state, codeChallenge };
}

// el state que vuelve del proveedor tiene que coincidir con el de la cookie (se usa una sola vez).
// Devuelve el verificador PKCE, o "" si el proveedor no usa PKCE.
export function checkState(req: Request, res: Response, providerName: string, state: unknown): string {
  const saved = typeof req.cookies[COOKIE] === "string" ? req.cookies[COOKIE] : "";
  res.clearCookie(COOKIE, clearOptions);

  const [savedProvider = "", savedState = "", verifier = ""] = saved.split(".");
  const expected = Buffer.from(`${providerName}.${typeof state === "string" ? state : ""}`);
  const actual = Buffer.from(`${savedProvider}.${savedState}`);

  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) {
    throw new OAuthError(400, "La verificación de seguridad falló. Volvé a intentar el ingreso.");
  }
  return verifier;
}
