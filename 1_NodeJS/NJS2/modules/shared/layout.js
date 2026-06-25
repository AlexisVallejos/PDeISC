// Layout base reutilizado por todas las paginas del sitio.
// Agrega head, estilos, menu, contenedor principal y footer.

import { getMenu } from '../consigna5/menu.js';

export function renderLayout(titulo, contenido, rutaActiva = '/') {
  return `<!DOCTYPE html>
<html lang="es" data-theme="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${titulo} - NJS2</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" rel="stylesheet">
  <link rel="stylesheet" href="/styles/estilos.css">
</head>
<body>
  <div class="fondo-ui">
    <div class="fondo-ui__blur fondo-ui__blur--uno"></div>
    <div class="fondo-ui__blur fondo-ui__blur--dos"></div>
  </div>

  ${getMenu(rutaActiva)}

  <main class="pagina px-3 px-lg-4 py-4 py-lg-5">
    <div class="shell-ui">
      ${contenido}
    </div>
  </main>

  <footer class="px-3 px-lg-4 pb-4">
    <div class="shell-ui">
      <div class="footer-ui">
        <div>
          <div class="footer-ui__brand">NJS2</div>
          <p class="footer-ui__text mb-0">Node.js Modules Showcase con enfoque visual responsive.</p>
        </div>
        <div class="footer-ui__meta">Solo pages, styles y modules</div>
      </div>
    </div>
  </footer>

  <button id="themeBtn" class="theme-fab" type="button" aria-label="Cambiar tema">
    <span class="theme-fab__icon theme-fab__icon--sun" aria-hidden="true">L</span>
    <span class="theme-fab__icon theme-fab__icon--moon" aria-hidden="true">D</span>
  </button>

  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
  <script>
    const themeKey = 'njs2-theme';
    const root = document.documentElement;
    const themeBtn = document.getElementById('themeBtn');

    function getTheme() {
      return localStorage.getItem(themeKey) || 'dark';
    }

    function applyTheme(theme) {
      root.setAttribute('data-theme', theme);
      if (themeBtn) {
        themeBtn.setAttribute('aria-label', theme === 'dark' ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro');
      }
    }

    applyTheme(getTheme());

    themeBtn?.addEventListener('click', () => {
      const nextTheme = getTheme() === 'dark' ? 'light' : 'dark';
      localStorage.setItem(themeKey, nextTheme);
      applyTheme(nextTheme);
    });
  </script>
</body>
</html>`;
}
