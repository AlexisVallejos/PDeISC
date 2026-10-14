import { config } from "../../config.js";
import { getJson, postForm } from "../http.js";
import type { OAuthProvider } from "../../types/oauth.js";

const credentials = config.oauth.discord;

// Discord pide que las llamadas a su API se identifiquen con este formato
const headers = { "User-Agent": `DiscordBot (${config.clientUrl}, 1.0)` };

export const discord: OAuthProvider = {
  name: "discord",
  label: "Discord",
  isConfigured: () => Boolean(credentials.clientId && credentials.clientSecret),

  buildUrl(state, redirectUri) {
    const params = new URLSearchParams({
      client_id: credentials.clientId,
      redirect_uri: redirectUri,
      response_type: "code",
      scope: "identify email",
      prompt: "consent",
      state,
    });
    return `https://discord.com/oauth2/authorize?${params}`;
  },

  async fetchProfile(code, redirectUri) {
    const token = await postForm("https://discord.com/api/oauth2/token", {
      client_id: credentials.clientId,
      client_secret: credentials.clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
      code,
    }, headers);
    const info = await getJson("https://discord.com/api/users/@me", token.access_token, headers);
    return { uid: String(info.id), nombre: info.global_name || info.username, email: info.email, emailVerified: info.verified === true && Boolean(info.email) };
  },
};
