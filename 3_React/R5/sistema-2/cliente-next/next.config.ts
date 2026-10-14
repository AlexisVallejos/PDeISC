import type { NextConfig } from "next";
import { fileURLToPath } from "node:url";

const nextConfig: NextConfig = {
  // R5 tiene varios package-lock: fijo la raíz en este cliente
  turbopack: { root: fileURLToPath(new URL(".", import.meta.url)) },
  // no generar AGENTS.md dentro del ejercicio
  agentRules: false,
};

export default nextConfig;
