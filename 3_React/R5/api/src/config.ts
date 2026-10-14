import "dotenv/config";
import type { OAuthCredentials, ProviderName } from "./types/oauth.js";

const provider = (idName: string, secretName: string): OAuthCredentials => ({
  clientId: process.env[idName] ?? "",
  clientSecret: process.env[secretName] ?? "",
});

export interface AppConfig {
  port: number;
  publicUrl: string;
  clientUrls: string[];
  jwtSecret: string;
  dbDriver: "mysql" | "sqlite";
  sqliteFile: string;
  db: {
    host: string;
    port: number;
    user: string;
    password: string;
    database: string;
  };
  oauth: Record<ProviderName, OAuthCredentials>;
}

export const config: AppConfig = {
  port: Number(process.env.PORT || 4005),
  publicUrl: process.env.PUBLIC_URL || "http://localhost:4005",
  clientUrls: (process.env.CLIENT_URLS || "http://localhost:5181,http://localhost:5182,http://localhost:5183,http://localhost:5184,http://localhost:5185,http://localhost:5186,http://localhost:5187,http://localhost:5188,http://localhost:5189").split(",").map((url) => url.trim()),
  jwtSecret: process.env.JWT_SECRET ?? "",
  dbDriver: process.env.DB_DRIVER === "sqlite" ? "sqlite" : "mysql",
  sqliteFile: process.env.DB_FILE || "database/r5.sqlite",
  db: {
    host: process.env.DB_HOST ?? "",
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER ?? "",
    password: process.env.DB_PASSWORD ?? "",
    database: process.env.DB_NAME ?? "",
  },
  oauth: {
    google: provider("GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET"),
    github: provider("GITHUB_CLIENT_ID", "GITHUB_CLIENT_SECRET"),
    discord: provider("DISCORD_CLIENT_ID", "DISCORD_CLIENT_SECRET"),
    facebook: provider("FACEBOOK_APP_ID", "FACEBOOK_APP_SECRET"),
    x: provider("X_CLIENT_ID", "X_CLIENT_SECRET"),
    twitch: provider("TWITCH_CLIENT_ID", "TWITCH_CLIENT_SECRET"),
  },
};

export function requireConfig(): void {
  if (!config.jwtSecret || (config.dbDriver === "mysql" && (!config.db.host || !config.db.user || !config.db.database))) {
    throw new Error("Faltan variables obligatorias en .env");
  }
}
