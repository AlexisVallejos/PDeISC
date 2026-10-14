import { OAuthError } from "../oauthError.js";
import { discord } from "./discord.js";
import { facebook } from "./facebook.js";
import { github } from "./github.js";
import { google } from "./google.js";
import { twitch } from "./twitch.js";
import { x } from "./x.js";
import type { OAuthProvider } from "../../types/oauth.js";

const providers: Record<string, OAuthProvider> = { google, facebook, x, github, discord, twitch };

// devuelve el proveedor pedido o corta con un error claro
export function getProvider(name: unknown): OAuthProvider {
  const provider = typeof name === "string" && Object.hasOwn(providers, name) ? providers[name] : null;

  if (!provider) throw new OAuthError(400, "Proveedor de ingreso no válido.");
  if (!provider.isConfigured()) throw new OAuthError(503, `El ingreso con ${provider.label} todavía no está configurado en el servidor.`);
  return provider;
}

// qué redes existen y cuáles ya tienen sus claves cargadas (el cliente deshabilita las que no)
export const listProviders = () => Object.values(providers).map((provider) => ({ id: provider.name, label: provider.label, enabled: provider.isConfigured() }));
