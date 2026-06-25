/**
 * DOCUMENTACION PARA DEFENDER
 * Archivo: ejercicios/shared/terminalServer.js
 * Rol: servidor reutilizable para las paginas tipo terminal de NJS1.
 * Idea clave: los ejercicios 1-4 comparten estructura visual; cada uno solo aporta datos y textos.
 * Como defenderlo: separa infraestructura HTTP/HTML de la logica particular de cada ejercicio.
 * Validacion: controla ruta CSS, ruta principal, 404 y errores de lectura en un solo lugar.
 */
import { readFile } from "node:fs/promises";
import { createServer } from "node:http";
import { join } from "node:path";

function renderThemeScript() {
  return `
      <script>
        const savedTheme = localStorage.getItem("njs-theme");
        if (savedTheme === "light") document.body.classList.add("light-theme");

        document.querySelector(".theme-toggle").addEventListener("click", () => {
          document.body.classList.toggle("light-theme");
          localStorage.setItem(
            "njs-theme",
            document.body.classList.contains("light-theme") ? "light" : "dark"
          );
        });
      </script>`;
}

function renderThemeButton() {
  return `
      <button class="theme-toggle" type="button" aria-label="Cambiar modo claro u oscuro">
        <svg class="icon icon-moon" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M21 14.6A8.6 8.6 0 0 1 9.4 3a7 7 0 1 0 11.6 11.6Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
        </svg>
        <svg class="icon icon-sun" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2"/>
          <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>`;
}

function renderTerminalPage({ pageTitle, heading, subtitle, terminalTitle, lines }) {
  return `<!DOCTYPE html>
  <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${pageTitle}</title>
      <link rel="stylesheet" href="/styles/style.css">
    </head>
    <body>
      <main class="dashboard-container">
        <header class="header">
          <div class="header-info">
            <h1>${heading}</h1>
            <p>${subtitle}</p>
          </div>
        </header>

        <section class="terminal-card" aria-label="Salida de consola">
          <div class="terminal-header">
            <div class="dot red"></div>
            <div class="dot yellow"></div>
            <div class="dot green"></div>
            <span class="terminal-title">${terminalTitle}</span>
          </div>
          <div class="terminal-body">
            ${lines.map((line) => `<p>${line}</p>`).join("")}
          </div>
        </section>
      </main>

      ${renderThemeButton()}
      ${renderThemeScript()}
    </body>
  </html>`;
}

export function createTerminalServer({ baseDir, page }) {
  return createServer(async (req, res) => {
    if (req.url === "/styles/style.css") {
      const css = await readFile(join(baseDir, "styles", "style.css"));
      res.writeHead(200, { "Content-Type": "text/css; charset=utf-8" });
      res.end(css);
      return;
    }

    if (req.url !== "/" && req.url !== "/index.html") {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Ruta no encontrada");
      return;
    }

    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(renderTerminalPage(page));
  });
}

export function startTerminalServer({ port, baseDir, page, label }) {
  const server = createTerminalServer({ baseDir, page });
  server.listen(port, () => {
    console.log(`${label} disponible en http://127.0.0.1:${port}`);
    console.log(`Servidor independiente de ${label.toLowerCase()}.`);
  });
  return server;
}
