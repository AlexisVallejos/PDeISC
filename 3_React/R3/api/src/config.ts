import "dotenv/config";

export interface AppConfig {
  port: number;
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
}

export const config: AppConfig = {
  port: Number(process.env.PORT || 4000),
  jwtSecret: process.env.JWT_SECRET ?? "",
  dbDriver: process.env.DB_DRIVER === "sqlite" ? "sqlite" : "mysql",
  sqliteFile: process.env.DB_FILE || "database/r3.sqlite",
  db: {
    host: process.env.DB_HOST ?? "",
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER ?? "",
    password: process.env.DB_PASSWORD ?? "",
    database: process.env.DB_NAME ?? "",
  },
};

export function requireConfig(): void {
  if (!config.jwtSecret || (config.dbDriver === "mysql" && (!config.db.host || !config.db.user || !config.db.database))) {
    throw new Error("Faltan variables obligatorias en .env");
  }
}
