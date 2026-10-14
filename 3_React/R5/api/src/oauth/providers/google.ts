import { config } from "../../config.js";
import { getJson, postForm } from "../http.js";
import type { OAuthProvider } from "../../types/oauth.js";

const credentials = config.oauth.google;

export const google: OAuthProvider = {
  name: "google",
  label: "Google",
  isConfigured: () => Boolean(credentials.clientId && credentials.clientSecret),

  buildUrl(state, redirectUri) {
    const params = new URLSearchParams({
      client_id: credentials.clientId,
      redirect_uri: redirectUri,
      response_type: "code",
      scope: "openid email profile",
      prompt: "select_account",
      state,
    });
    return `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
  },

  // cambia el código por un token y pide los datos de la persona
  async fetchProfile(code, redirectUri) {
    const token = await postForm("https://oauth2.googleapis.com/token", {
      client_id: credentials.clientId,
      client_secret: credentials.clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
      code,
    });
    const info = await getJson("https://openidconnect.googleapis.com/v1/userinfo", token.access_token);
    return { uid: info.sub, nombre: info.name, email: info.email, emailVerified: info.email_verified === true };
  },
};
