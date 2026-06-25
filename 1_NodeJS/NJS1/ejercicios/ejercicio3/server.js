import { readFile } from "node:fs/promises";
import { createServer } from "node:http";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { resultadosEjercicio3 } from "./ejercicio3.js";

const PORT = 3003;
const BASE_DIR = fileURLToPath(new URL(".", import.meta.url));

const server = createServer(async (req, res) => {
  if (req.url === "/styles/style.css") {
    const css = await readFile(join(BASE_DIR, "styles", "style.css"));
    res.writeHead(200, { "Content-Type": "text/css; charset=utf-8" });
    res.end(css);
    return;
  }

  if (req.url !== "/" && req.url !== "/index.html") {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Ruta no encontrada");
    return;
  }

  const filas = resultadosEjercicio3
    .map(
      (item) => `
        <article class="card">
          <span>Funcion</span>
          <strong>${item.expresion}</strong>
          <p>${item.resultado}</p>
        </article>`
    )
    .join("");

  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  res.end(`<!DOCTYPE html>
  <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Ejercicio 3</title>
      <link rel="stylesheet" href="/styles/style.css">
    </head>
    <body>
      <main class="page">
        <section class="hero">
          <p class="eyebrow">Servidor independiente · puerto ${PORT}</p>
          <h1>Ejercicio 3</h1>
          <p>Los mismos calculos del ejercicio 2, resueltos con funciones reales.</p>
        </section>
        <section class="grid" aria-label="Resultados">${filas}</section>
      </main>
      <button class="theme-toggle" type="button" aria-label="Cambiar modo claro u oscuro">
        <svg class="icon icon-moon" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M21 14.6A8.6 8.6 0 0 1 9.4 3a7 7 0 1 0 11.6 11.6Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
        </svg>
        <svg class="icon icon-sun" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2"/>
          <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>
      <script>
        const savedTheme = localStorage.getItem("njs1-theme");
        if (savedTheme === "dark") document.body.classList.add("dark-theme");

        document.querySelector(".theme-toggle").addEventListener("click", () => {
          document.body.classList.toggle("dark-theme");
          localStorage.setItem(
            "njs1-theme",
            document.body.classList.contains("dark-theme") ? "dark" : "light"
          );
        });
      </script>
    </body>
  </html>`);
});

server.listen(PORT, () => {
  console.log(`Ejercicio 3 disponible en http://127.0.0.1:${PORT}`);
  console.log("Servidor independiente del ejercicio 3.");
});
