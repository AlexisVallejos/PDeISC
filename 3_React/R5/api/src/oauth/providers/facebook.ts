import { config } from "../../config.js";
import { getJson } from "../http.js";
import type { OAuthProvider } from "../../types/oauth.js";

const credentials = config.oauth.facebook;
const VERSION = "v25.0";

// Facebook Login es el inicio de sesión de Meta: acá entra "Facebook" y "Meta" a la vez
export const facebook: OAuthProvider = {
  name: "facebook",
  label: "Facebook",
  isConfigured: () => Boolean(credentials.clientId && credentials.clientSecret),

  buildUrl(state, redirectUri) {
    const params = new URLSearchParams({
      client_id: credentials.clientId,
      redirect_uri: redirectUri,
      response_type: "code",
      scope: "email,public_profile",
      state,
    });
    return `https://www.facebook.com/${VERSION}/dialog/oauth?${params}`;
  },

  // Facebook solo devuelve el correo si la persona lo tiene confirmado
  async fetchProfile(code, redirectUri) {
    const tokenParams = new URLSearchParams({
      client_id: credentials.clientId,
      client_secret: credentials.clientSecret,
      redirect_uri: redirectUri,
      code,
    });
    const token = await getJson(`https://graph.facebook.com/${VERSION}/oauth/access_token?${tokenParams}`);
    const info = await getJson(`https://graph.facebook.com/${VERSION}/me?fields=id,name,email`, token.access_token);
    return { uid: String(info.id), nombre: info.name, email: info.email, emailVerified: Boolean(info.email) };
  },
};
