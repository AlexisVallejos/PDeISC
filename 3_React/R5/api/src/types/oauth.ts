export interface OAuthCredentials {
  clientId: string;
  clientSecret: string;
}

export interface OAuthProfile {
  uid: string;
  nombre: string;
  email?: string;
  emailVerified: boolean;
}

export interface OAuthProvider {
  name: string;
  label: string;
  pkce?: boolean;
  isConfigured: () => boolean;
  buildUrl: (state: string, redirectUri: string, codeChallenge?: string) => string;
  fetchProfile: (code: string, redirectUri: string, codeVerifier?: string) => Promise<OAuthProfile>;
}

export type ProviderName = "google" | "facebook" | "x" | "github" | "discord" | "twitch";
