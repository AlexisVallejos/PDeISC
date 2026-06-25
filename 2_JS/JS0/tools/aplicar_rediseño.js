/**
 * DOCUMENTACION PARA DEFENDER
 * Archivo: tools/aplicar_rediseño.js
 * Rol: forma parte del proyecto y separa responsabilidades para que el codigo sea mas facil de explicar y mantener.
 * Idea clave: mantener este codigo separado ayuda a explicar que hace cada parte sin mezclar responsabilidades.
 * Como defenderlo: explicar primero que datos entran, que proceso se aplica y que salida produce.
 * Validacion: remarcar donde se controlan errores para que la app no falle con datos incorrectos.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const modulesDir = path.join(__dirname, '../modules');

// getPremiumHTML: Obtiene y devuelve informacion sin modificar el estado principal.
const getPremiumHTML = (moduleName) => `<!doctype html>
<html lang="es" data-theme="light">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Ejercicio ${moduleName.replace('ejercicio', '').replace('_', ' ')}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;700;800&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <link rel="stylesheet" href="/public/style.css" />
</head>
<body>
  <!-- Animated Background Blobs -->
  <div class="blob blob-1"></div>
  <div class="blob blob-2"></div>

  <!-- Navigation Bar -->
  <nav class="top-nav">
    <div class="container d-flex justify-content-between align-items-center">
      <a href="http://localhost:3000" class="back-link">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" class="me-2"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
        Volver al Launcher
      </a>
      <span class="module-badge">Módulo ${moduleName.split('_')[0].replace('ejercicio', '')}</span>
    </div>
  </nav>

  <main class="container-fluid px-4 px-xl-5 py-4 app-shell" style="max-width: 1800px;">
    <header class="hero mb-4 text-center">
      <div class="method-chip">Array.prototype</div>
      <h1 id="title" class="display-title mb-2">Método</h1>
      <p class="hero-copy mb-0">Entorno interactivo. Seleccioná una variante a la izquierda y evaluá los resultados en el panel principal.</p>
    </header>

    <div class="row g-4">
      <!-- PANEL LATERAL (CONTROLES) -->
      <div class="col-lg-4 col-xl-3">
        <section class="glass-panel control-panel mb-4" style="position: sticky; top: 100px;">
          <h2 class="h5 fw-bold mb-3 d-flex align-items-center gap-2" style="color: var(--accent);">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z"/></svg>
            Configuración
          </h2>
          <div class="mb-3">
            <label for="variant" class="form-label" style="color: #f8fafc; font-weight: 600; letter-spacing: 0.02em;">Variante del Ejercicio</label>
            <select id="variant" class="form-select custom-select" required></select>
          </div>
          <p id="feedback" class="feedback mb-0 small" role="status" aria-live="polite" style="color: var(--muted);"></p>

          <hr style="border-color: var(--border); margin: 1.5rem 0;">

          <div class="info-panel mt-4 p-4 rounded-4" style="background: linear-gradient(135deg, #1e293b, #0f172a); color: #ffffff; box-shadow: 0 10px 20px rgba(0,0,0,0.15);">
            <h3 class="fw-bold d-flex align-items-center gap-2 mb-3" style="color: #818cf8; font-size: 0.95rem; text-transform: uppercase; letter-spacing: 0.05em;">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7zm2.85 11.1l-.85.6V16h-4v-2.3l-.85-.6A4.997 4.997 0 0 1 7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.63-.8 3.16-2.15 4.1z"/></svg>
              Tip de Desarrollo
            </h3>
            <p class="mb-0" style="line-height: 1.6; font-size: 0.78rem; color: #f8fafc; font-weight: 400;">
              Los métodos de arreglos son esenciales para manipular datos en JS. Recordá siempre verificar en la documentación si el método que estás usando <strong style="color: #fff; font-weight: 700;">muta</strong> (modifica) el arreglo original o si devuelve uno completamente nuevo.
            </p>
          </div>
        </section>
      </div>

      <!-- ESPACIO DE TRABAJO (RESULTADOS) -->
      <div class="col-lg-8 col-xl-9">
        <!-- Secret Tools (Only visible in Ejercicio 15) -->
        <section id="secretTools" class="glass-panel mb-4 d-none" aria-label="Herramientas secreto">
          <h2 class="h5 fw-bold mb-3 d-flex align-items-center gap-2">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/></svg>
            Herramientas Avanzadas
          </h2>
          <label for="secretInput" class="form-label text-muted">Texto a decodificar</label>
          <textarea id="secretInput" class="form-control custom-textarea" rows="2" required minlength="3" maxlength="400" placeholder="Escribí texto con fragmentos entre paréntesis..."></textarea>
          <div class="d-flex flex-wrap gap-2 mt-3">
            <button id="runCustom" class="btn btn-primary premium-btn" type="button">Decodificar</button>
            <button id="runStep" class="btn btn-outline-secondary premium-btn-outline" type="button">Paso a paso</button>
          </div>
          <small class="text-muted mt-2 d-block">Validaciones activas: texto vacío y paréntesis mal cerrados.</small>
          <pre id="secretResult" class="code-block mt-3 d-none"></pre>
        </section>

        <!-- Main Workspace (Result Card) -->
        <section id="card" class="result-card">
          <div class="card-body" id="cardBody">
            <!-- Dynamic content injected by JS -->
          </div>
        </section>
      </div>
    </div>
  </main>

  <button id="themeBtn" class="fab-left" type="button" aria-label="Cambiar tema">
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a1 1 0 0 1 1 1v1.1a1 1 0 1 1-2 0V4a1 1 0 0 1 1-1Zm0 14a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm9-6a1 1 0 0 1-1 1h-1.1a1 1 0 1 1 0-2H20a1 1 0 0 1 1 1ZM6.2 6.2a1 1 0 0 1 0 1.4l-.8.8a1 1 0 1 1-1.4-1.4l.8-.8a1 1 0 0 1 1.4 0Zm12.2 0a1 1 0 0 1 1.4 0l.8.8a1 1 0 1 1-1.4 1.4l-.8-.8a1 1 0 0 1 0-1.4ZM4 11a1 1 0 1 1 0 2H2.9a1 1 0 1 1 0-2H4Zm1.4 6.2a1 1 0 0 1 1.4 1.4l-.8.8a1 1 0 0 1-1.4-1.4l.8-.8Zm13.2 0 .8.8a1 1 0 0 1-1.4 1.4l-.8-.8a1 1 0 0 1 1.4-1.4ZM12 18.9a1 1 0 0 1 1 1V21a1 1 0 1 1-2 0v-1.1a1 1 0 0 1 1-1Z"/></svg>
  </button>

  <button id="toTop" class="fab-right" type="button" aria-label="Subir arriba">
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5.3 4.6 12.7a1 1 0 0 0 1.4 1.4l5-5V20a1 1 0 1 0 2 0V9.1l5 5a1 1 0 0 0 1.4-1.4L12 5.3Z"/></svg>
  </button>

  <script type="module" src="/public/script.js"></script>
</body>
</html>`;

// getPremiumCSS: Obtiene y devuelve informacion sin modificar el estado principal.
const getPremiumCSS = () => `:root {
  --bg: #f8fafc;
  --surface: rgba(255, 255, 255, 0.85);
  --text: #0f172a;
  --muted: #64748b;
  --accent: #6366f1;
  --accent-hover: #4f46e5;
  --border: rgba(226, 232, 240, 0.8);
  --shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  --card-bg: #ffffff;
}

[data-theme="dark"] {
  --bg: #030712;
  --surface: rgba(17, 24, 39, 0.85);
  --text: #f9fafb;
  --muted: #9ca3af;
  --accent: #818cf8;
  --accent-hover: #6366f1;
  --border: rgba(55, 65, 81, 0.8);
  --shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
  --card-bg: #111827;
}

body {
  font-family: "Plus Jakarta Sans", sans-serif;
  background-color: var(--bg);
  background-image:
    radial-gradient(circle at 15% 50%, rgba(99, 102, 241, 0.1), transparent 25%),
    radial-gradient(circle at 85% 30%, rgba(14, 165, 233, 0.1), transparent 25%);
  color: var(--text);
  min-height: 100vh;
  transition: background-color 0.3s ease, color 0.3s ease;
  overflow-x: hidden;
}

.app-shell { position: relative; z-index: 10; max-width: 1200px; margin-inline: auto; }

/* Navigation */
.top-nav {
  padding: 1rem 0;
  border-bottom: 1px solid var(--border);
  background: var(--surface);
  backdrop-filter: blur(12px);
  position: sticky;
  top: 0;
  z-index: 50;
}
.back-link {
  color: var(--muted);
  text-decoration: none;
  font-weight: 600;
  display: flex;
  align-items: center;
  transition: color 0.2s ease;
}
.back-link:hover { color: var(--accent); }
.module-badge {
  background: color-mix(in srgb, var(--accent) 15%, transparent);
  color: var(--accent);
  padding: 4px 12px;
  border-radius: 99px;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

/* Typography & Hero */
.display-title { font-weight: 800; font-size: clamp(2rem, 4vw, 3rem); letter-spacing: -0.02em; }
.hero-copy { color: var(--muted); font-size: 1.1rem; max-width: 600px; margin-inline: auto; line-height: 1.6; }
.method-chip {
  display: inline-block;
  font-family: "IBM Plex Mono", monospace;
  background: var(--border);
  color: var(--text);
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 1rem;
}

/* Glass Panels */
.glass-panel {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 24px 32px;
  box-shadow: var(--shadow);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}
.result-card {
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: 20px;
  box-shadow: var(--shadow);
  overflow: hidden;
}

/* Form Controls */
.custom-select, .custom-textarea {
  background-color: color-mix(in srgb, var(--bg) 50%, transparent);
  border: 2px solid var(--border);
  color: var(--text);
  border-radius: 10px;
  padding: 12px 16px;
  font-size: 1rem;
  transition: all 0.2s ease;
}
.custom-select:focus, .custom-textarea:focus {
  background-color: var(--card-bg);
  border-color: var(--accent);
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--accent) 15%, transparent);
  outline: none;
}
.custom-select { cursor: pointer; }

/* Buttons */
.premium-btn {
  background: var(--accent);
  color: #fff;
  border: none;
  padding: 10px 24px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.2s ease;
}
.premium-btn:hover { background: var(--accent-hover); transform: translateY(-2px); box-shadow: 0 4px 12px color-mix(in srgb, var(--accent) 30%, transparent); }
.premium-btn-outline {
  background: transparent;
  color: var(--text);
  border: 2px solid var(--border);
  padding: 10px 24px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.2s ease;
}
.premium-btn-outline:hover { background: var(--border); transform: translateY(-2px); }

/* Data Visualization Classes (injected by JS) */
.array-container { display: flex; flex-wrap: wrap; gap: 8px; padding: 16px; background: color-mix(in srgb, var(--bg) 50%, transparent); border-radius: 12px; }
.array-item {
  background: var(--surface);
  border: 1px solid var(--border);
  padding: 8px 16px;
  border-radius: 8px;
  font-family: "IBM Plex Mono", monospace;
  font-weight: 500;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  transition: transform 0.2s ease;
}
.array-item:hover { transform: scale(1.05); border-color: var(--accent); color: var(--accent); }
.code-block {
  background: #0f172a !important;
  color: #f8fafc !important;
  padding: 20px;
  border-radius: 12px;
  font-family: "IBM Plex Mono", monospace;
  font-size: 0.9rem;
  overflow-x: auto;
  border: 1px solid rgba(255,255,255,0.1);
}

/* FABs */
.fab-left, .fab-right {
  position: fixed;
  bottom: 24px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  z-index: 60;
  box-shadow: var(--shadow);
  backdrop-filter: blur(10px);
  cursor: pointer;
  transition: transform 0.2s ease;
}
.fab-left:hover, .fab-right:hover { transform: scale(1.1); }
.fab-left { left: 24px; }
.fab-right { right: 24px; display: none; }
.fab-left svg, .fab-right svg { width: 24px; height: 24px; fill: currentColor; }

/* Background animated blobs */
.blob {
  position: fixed;
  filter: blur(100px);
  z-index: 0;
  opacity: 0.4;
  animation: float 20s infinite alternate;
}
.blob-1 { top: -10%; left: -5%; width: 400px; height: 400px; background: var(--accent); border-radius: 50%; }
.blob-2 { bottom: -10%; right: -5%; width: 500px; height: 500px; background: #0ea5e9; border-radius: 50%; animation-delay: -10s; }

/* Elements injected by JS inside #cardBody */
#cardBody {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  padding: 1rem; /* The outer card already has padding, so we just give some breathing room */
}

/* Force all children to span full width except the top 4 specs */
#cardBody > * {
  grid-column: 1 / -1;
  margin: 0;
}

/* The Top 4 Property Cards (Grid of specs) */
#cardBody > p:nth-of-type(1),
#cardBody > p:nth-of-type(2),
#cardBody > p:nth-of-type(3),
#cardBody > p:nth-of-type(4) {
  grid-column: span 1;
  background: color-mix(in srgb, var(--bg) 60%, transparent);
  border: 1px solid var(--border);
  border-left: 4px solid var(--accent);
  padding: 1.2rem 1.5rem;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(0,0,0,0.02);
  color: var(--text);
  font-size: 1rem;
}

/* Style the strong tags inside the 4 property cards to look like premium labels */
#cardBody > p:nth-of-type(1) strong,
#cardBody > p:nth-of-type(2) strong,
#cardBody > p:nth-of-type(3) strong,
#cardBody > p:nth-of-type(4) strong {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--muted);
  margin-bottom: 8px;
}

/* Inline code tags inside the property cards */
#cardBody > p:nth-of-type(4) code {
  background: color-mix(in srgb, var(--accent) 15%, transparent);
  color: var(--accent);
  padding: 4px 8px;
  border-radius: 6px;
  font-family: "IBM Plex Mono", monospace;
  font-size: 0.9rem;
  margin-top: 4px;
  display: inline-block;
}

/* Code Headers (Codigo usado, Resultado final) */
#cardBody > p:nth-of-type(5),
#cardBody > p:nth-of-type(6) {
  margin-top: 1.5rem;
  border-bottom: 1px solid var(--border);
  padding-bottom: 0.5rem;
}
#cardBody > p:nth-of-type(5) strong,
#cardBody > p:nth-of-type(6) strong {
  font-size: 1.1rem;
  color: var(--text);
  font-weight: 800;
}

/* Code Blocks */
#cardBody pre {
  background: var(--surface) !important;
  color: var(--text) !important;
  padding: 1.5rem;
  border-radius: 16px;
  font-family: "IBM Plex Mono", monospace;
  font-size: 0.95rem;
  overflow-x: auto;
  border: 1px solid var(--border);
  box-shadow: inset 0 2px 10px rgba(0,0,0,0.05);
  margin-top: 0.5rem;
}
#cardBody pre code { background: transparent; color: inherit; padding: 0; }

/* The Data Entry Panel */
#cardBody .panel {
  background: color-mix(in srgb, var(--surface) 80%, transparent);
  border: 1px solid color-mix(in srgb, var(--accent) 30%, transparent);
  border-radius: 16px;
  padding: 2rem;
  margin-top: 2rem;
  box-shadow: 0 10px 30px color-mix(in srgb, var(--accent) 5%, transparent);
}
#cardBody .panel h3 { color: var(--accent); font-weight: 800; margin-bottom: 1.5rem; font-size: 1.25rem;}
#cardBody .form-label { font-weight: 600; color: var(--text); font-size: 0.95rem; }
#cardBody .helper { color: var(--muted); font-size: 0.85rem; margin-top: 6px; }

/* Injected Buttons */
.btn-brand {
  background: var(--accent);
  color: #fff;
  border: none;
  padding: 12px 28px;
  border-radius: 10px;
  font-weight: 700;
  letter-spacing: 0.05em;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin-top: 1.5rem;
  width: 100%;
}
.btn-brand:hover { background: var(--accent-hover); transform: translateY(-3px); box-shadow: 0 8px 20px color-mix(in srgb, var(--accent) 30%, transparent); }

/* Injected Inputs */
.run-input {
  background-color: var(--card-bg);
  border: 2px solid var(--border);
  color: var(--text);
  border-radius: 10px;
  padding: 12px 16px;
  font-size: 1rem;
  transition: all 0.2s ease;
  width: 100%;
}
.run-input:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--accent) 15%, transparent);
  outline: none;
}
`;

fs.readdir(modulesDir, { withFileTypes: true }, (err, dirents) => {
  if (err) {
    console.error('Error leyendo modules', err);
    return;
  }

  dirents.forEach(dirent => {
    if (dirent.isDirectory() && dirent.name.startsWith('ejercicio')) {
      const publicPath = path.join(modulesDir, dirent.name, 'public');

      if (fs.existsSync(publicPath)) {
        // Write HTML
        fs.writeFileSync(path.join(publicPath, 'index.html'), getPremiumHTML(dirent.name));

        // Write CSS
        fs.writeFileSync(path.join(publicPath, 'style.css'), getPremiumCSS());

        console.log(`[✔] Rediseñado: ${dirent.name}`);
      }
    }
  });
});
