import { config } from "../../config.js";
import { getJson, postForm } from "../http.js";
import type { OAuthProvider } from "../../types/oauth.js";

const credentials = config.oauth.twitch;

export const twitch: OAuthProvider = {
  name: "twitch",
  label: "Twitch",
  isConfigured: () => Boolean(credentials.clientId && credentials.clientSecret),

  buildUrl(state, redirectUri) {
    const params = new URLSearchParams({
      client_id: credentials.clientId,
      redirect_uri: redirectUri,
      response_type: "code",
      scope: "user:read:email",
      force_verify: "true",
      state,
    });
    return `https://id.twitch.tv/oauth2/authorize?${params}`;
  },

  async fetchProfile(code, redirectUri) {
    const token = await postForm("https://id.twitch.tv/oauth2/token", {
      client_id: credentials.clientId,
      client_secret: credentials.clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
      code,
    });
    // Twitch pide también el Client-Id en la API; solo devuelve el correo si está verificado
    const answer = await getJson("https://api.twitch.tv/helix/users", token.access_token, { "Client-Id": credentials.clientId });
    const info = answer.data?.[0] || {};
    return { uid: String(info.id), nombre: info.display_name || info.login, email: info.email, emailVerified: Boolean(info.email) };
  },
};
