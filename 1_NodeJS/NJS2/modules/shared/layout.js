// Layout base reutilizado por todas las paginas del sitio.
// Agrega head, estilos, menu, contenedor principal y footer.

import { getMenu } from '../consigna5/menu.js';

export function renderLayout(titulo, contenido, rutaActiva = '/') {
  return `<!DOCTYPE html>
<html lang="es" data-bs-theme="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${titulo} - NJS2</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" rel="stylesheet">
  <link rel="stylesheet" href="/styles/estilos.css">
</head>
<body>
  <div class="saas-background">
    <div class="saas-blob saas-blob--top"></div>
    <div class="saas-blob saas-blob--bottom"></div>
  </div>

  ${getMenu(rutaActiva)}

  <main class="pagina px-3 px-lg-4 py-4 py-lg-5">
    <div class="shell-ui">
      ${contenido}
    </div>
  </main>

  <footer class="saas-footer px-3 px-lg-4 pb-4">
    <div class="shell-ui text-center">
      <div class="saas-footer__brand mb-2">NJS2 · Modern App</div>
      <p class="saas-footer__text mb-0">Demostración de módulos de Node.js con diseño UI Premium.</p>
    </div>
  </footer>

  <button id="themeBtn" class="theme-fab shadow-lg" type="button" aria-label="Cambiar tema">
    <i class="bi bi-sun-fill theme-icon-sun"></i>
    <i class="bi bi-moon-stars-fill theme-icon-moon"></i>
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
      root.setAttribute('data-bs-theme', theme);
      if (theme === 'light') {
        document.body.classList.add('light-mode');
      } else {
        document.body.classList.remove('light-mode');
      }
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
