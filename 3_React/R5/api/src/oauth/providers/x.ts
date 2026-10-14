import { config } from "../../config.js";
import { getJson, postForm } from "../http.js";
import type { OAuthProvider } from "../../types/oauth.js";

const credentials = config.oauth.x;

export const x: OAuthProvider = {
  name: "x",
  label: "X",
  pkce: true, // X obliga a usar PKCE
  isConfigured: () => Boolean(credentials.clientId && credentials.clientSecret),

  buildUrl(state, redirectUri, codeChallenge) {
    const params = new URLSearchParams({
      client_id: credentials.clientId,
      redirect_uri: redirectUri,
      response_type: "code",
      // users.email pide el correo; hace falta tener activada esa opción en la app de X
      scope: "users.read tweet.read users.email",
      code_challenge: codeChallenge ?? "",
      code_challenge_method: "S256",
      state,
    });
    return `https://x.com/i/oauth2/authorize?${params}`;
  },

  async fetchProfile(code, redirectUri, codeVerifier) {
    // el cliente confidencial se identifica con Basic (id:secreto)
    const basic = Buffer.from(`${credentials.clientId}:${credentials.clientSecret}`).toString("base64");
    const token = await postForm(
      "https://api.x.com/2/oauth2/token",
      { grant_type: "authorization_code", code, redirect_uri: redirectUri, code_verifier: codeVerifier ?? "" },
      { Authorization: `Basic ${basic}` },
    );
    const answer = await getJson("https://api.x.com/2/users/me?user.fields=confirmed_email", token.access_token);
    const info = answer.data || {};
    return { uid: String(info.id), nombre: info.name || info.username, email: info.confirmed_email, emailVerified: Boolean(info.confirmed_email) };
  },
};
