// Modulo del menu principal reutilizado por layout.js.

const LINKS = [
  { href: '/', label: 'Inicio', icono: 'grid-1x2-fill' },
  { href: '/calculo', label: 'Consigna 1', icono: 'stars' },
  { href: '/archivos', label: 'Consigna 2', icono: 'folder2-open' },
  { href: '/url', label: 'Consigna 3', icono: 'link-45deg' },
  { href: '/npm', label: 'Consigna 4', icono: 'box-seam-fill' },
];

export function getMenu(rutaActiva = '/') {
  // Marca visualmente la ruta activa para orientar al usuario.
  const links = LINKS.map(({ href, label, icono }) => {
    const activo = rutaActiva === href ? ' nav-link-ui--active' : '';
    return `
      <li class="nav-item">
        <a class="nav-link nav-link-ui${activo}" href="${href}">
          <i class="bi bi-${icono}"></i>
          <span>${label}</span>
        </a>
      </li>
    `;
  }).join('');

  return `
    <header class="site-header px-3 px-lg-4 pt-3 pt-lg-4">
      <nav class="navbar navbar-expand-lg navbar-ui shell-ui">
        <div class="container-fluid px-3 px-lg-4">
          <a class="navbar-brand navbar-brand-ui" href="/">NJS2</a>
          <button class="navbar-toggler navbar-toggler-ui" type="button" data-bs-toggle="collapse" data-bs-target="#menuPrincipal" aria-controls="menuPrincipal" aria-expanded="false" aria-label="Abrir menu">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse mt-3 mt-lg-0" id="menuPrincipal">
            <ul class="navbar-nav ms-auto align-items-lg-center gap-lg-2">
              ${links}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  `;
}
