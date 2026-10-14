import { config } from "../../config.js";
import { getJson, postForm } from "../http.js";
import type { OAuthProvider } from "../../types/oauth.js";

const credentials = config.oauth.github;

interface GithubEmail {
  email: string;
  primary: boolean;
  verified: boolean;
}

// GitHub puede tener el correo privado: hay que pedirlo aparte y elegir uno verificado
function pickVerifiedEmail(emails: GithubEmail[]): string | undefined {
  const verified = Array.isArray(emails) ? emails.filter((item) => item.verified) : [];
  return (verified.find((item) => item.primary) || verified[0])?.email;
}

export const github: OAuthProvider = {
  name: "github",
  label: "GitHub",
  isConfigured: () => Boolean(credentials.clientId && credentials.clientSecret),

  buildUrl(state, redirectUri) {
    const params = new URLSearchParams({
      client_id: credentials.clientId,
      redirect_uri: redirectUri,
      scope: "read:user user:email",
      state,
    });
    return `https://github.com/login/oauth/authorize?${params}`;
  },

  async fetchProfile(code, redirectUri) {
    const token = await postForm("https://github.com/login/oauth/access_token", {
      client_id: credentials.clientId,
      client_secret: credentials.clientSecret,
      redirect_uri: redirectUri,
      code,
    });
    const info = await getJson("https://api.github.com/user", token.access_token);
    const email = pickVerifiedEmail(await getJson("https://api.github.com/user/emails", token.access_token));
    return { uid: String(info.id), nombre: info.name || info.login, email, emailVerified: Boolean(email) };
  },
};
