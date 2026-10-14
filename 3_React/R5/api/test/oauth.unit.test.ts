// pruebas sin base de datos: nombre, state y URLs de autorización
import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import type { Request, Response } from "express";

process.env.GOOGLE_CLIENT_ID = "gid";
process.env.GOOGLE_CLIENT_SECRET = "gsec";
process.env.GITHUB_CLIENT_ID = "hid";
process.env.GITHUB_CLIENT_SECRET = "hsec";
process.env.DISCORD_CLIENT_ID = "did";
process.env.DISCORD_CLIENT_SECRET = "dsec";
process.env.FACEBOOK_APP_ID = "fid";
process.env.FACEBOOK_APP_SECRET = "fsec";
process.env.X_CLIENT_ID = "xid";
process.env.X_CLIENT_SECRET = "xsec";
process.env.TWITCH_CLIENT_ID = "tid";
process.env.TWITCH_CLIENT_SECRET = "tsec";
process.env.JWT_SECRET = "secreto-de-prueba";
// el .env real no debe cambiar el resultado: fijo la dirección del cliente
process.env.CLIENT_URL = "http://localhost:5175";
process.env.DB_HOST = "127.0.0.1";
process.env.DB_USER = "root";
process.env.DB_NAME = "r5";

const { cleanProviderName } = await import("../src/utils/providerName.js");
const { getProvider } = await import("../src/oauth/providers/index.js");
const { startState, checkState } = await import("../src/oauth/state.js");
const { redirectUri } = await import("../src/oauth/redirectUri.js");

// res falso que guarda las cookies que la API pone
function fakeRes(): Response & { cookies: Record<string, string> } {
  const cookies: Record<string, string> = {};
  const fake = {
    cookies,
    cookie(name: string, value: string) { cookies[name] = value; },
    clearCookie(name: string) { delete cookies[name]; },
  };
  return fake as unknown as Response & { cookies: Record<string, string> };
}

test("el nombre de la red queda solo con letras y espacios", () => {
  assert.equal(cleanProviderName("Luis 2000 Gómez", "luis@x.com"), "Luis Gómez");
  assert.equal(cleanProviderName("  Ana   María ", "ana@x.com"), "Ana María");
  assert.equal(cleanProviderName("1234", "camila.perez@x.com"), "camila perez");
  assert.equal(cleanProviderName("", "1234@x.com"), "Usuario");
});

test("cada proveedor arma su URL con state y la URL de retorno del cliente", () => {
  const hosts: Record<string, string> = { google: "accounts.google.com", facebook: "www.facebook.com", x: "x.com", github: "github.com", discord: "discord.com", twitch: "id.twitch.tv" };
  for (const [name, host] of Object.entries(hosts)) {
    const url = new URL(getProvider(name).buildUrl("estado123", redirectUri(name), "desafio"));
    assert.equal(url.host, host);
    assert.equal(url.searchParams.get("state"), "estado123");
    assert.equal(url.searchParams.get("redirect_uri"), `http://localhost:5175/auth/${name}/callback`);
  }
});

test("un proveedor inexistente se rechaza", () => {
  assert.throws(() => getProvider("myspace"), /no válido/);
  assert.throws(() => getProvider("__proto__"), /no válido/);
  assert.throws(() => getProvider(undefined), /no válido/);
});

test("el state vuelve igual solo si coincide con la cookie y se usa una vez", () => {
  const res = fakeRes();
  const { state } = startState(res, "google");
  const req = { cookies: { oauth_state: res.cookies.oauth_state } } as unknown as Request;

  assert.doesNotThrow(() => checkState(req, fakeRes(), "google", state));
  assert.throws(() => checkState(req, fakeRes(), "google", "otro-state"), /seguridad/);
  assert.throws(() => checkState(req, fakeRes(), "github", state), /seguridad/);
  assert.throws(() => checkState({ cookies: {} } as unknown as Request, fakeRes(), "google", state), /seguridad/);
});

test("X usa PKCE: el desafío va en la URL y el verificador vuelve de la cookie", () => {
  const res = fakeRes();
  const { state, codeChallenge } = startState(res, "x", true);
  const url = new URL(getProvider("x").buildUrl(state, redirectUri("x"), codeChallenge));

  assert.equal(url.searchParams.get("code_challenge_method"), "S256");
  assert.equal(url.searchParams.get("code_challenge"), codeChallenge);
  assert.match(url.searchParams.get("scope") || "", /users.email/);

  const verifier = checkState({ cookies: { oauth_state: res.cookies.oauth_state } } as unknown as Request, fakeRes(), "x", state);
  assert.equal(createHash("sha256").update(verifier).digest("base64url"), codeChallenge);
});

test("sin PKCE el state vuelve sin verificador", () => {
  const res = fakeRes();
  const { state, codeChallenge } = startState(res, "google");
  assert.equal(codeChallenge, "");
  assert.equal(checkState({ cookies: { oauth_state: res.cookies.oauth_state } } as unknown as Request, fakeRes(), "google", state), "");
});

test("la lista de redes dice cuáles están habilitadas y no expone claves", async () => {
  const { listProviders } = await import("../src/oauth/providers/index.js");
  const list = listProviders();

  assert.deepEqual(list.map((item) => item.id), ["google", "facebook", "x", "github", "discord", "twitch"]);
  assert.ok(list.every((item) => item.enabled === true), "con todas las claves cargadas quedan habilitadas");
  assert.ok(!JSON.stringify(list).match(/gsec|hsec|dsec|fsec|xsec|tsec/), "no aparecen secretos");
});
