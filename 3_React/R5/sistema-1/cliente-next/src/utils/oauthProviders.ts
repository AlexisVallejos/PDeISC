import type { Provider } from "@/types/oauth";

// redes con las que se puede ingresar (el id es el mismo que usa la API)
export const oauthProviders: Provider[] = [
  { id: "google", label: "Google" },
  { id: "facebook", label: "Facebook" },
  { id: "x", label: "X" },
  { id: "github", label: "GitHub" },
  { id: "discord", label: "Discord" },
  { id: "twitch", label: "Twitch" },
];

export const findProvider = (id: unknown): Provider | undefined => oauthProviders.find((provider) => provider.id === id);
