import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

// "@" apunta al src de este mismo proyecto.
// Las llamadas a /api las reenvía Vite a la API, así el navegador ve un solo origen y las cookies viajan sin problemas.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  server: { proxy: { "/api": "http://localhost:4005" } },
});
