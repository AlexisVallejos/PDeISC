export type ProviderId = "google" | "facebook" | "x" | "github" | "discord" | "twitch";

export interface Provider {
  id: ProviderId;
  label: string;
}

export interface ProviderStatus extends Provider {
  enabled: boolean;
}

export interface OAuthCallbackValues {
  provider: string;
  code: string;
  state: string;
}
