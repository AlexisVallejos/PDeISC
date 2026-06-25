/**
 * DOCUMENTACION PARA DEFENDER
 * Archivo: modules/consigna5/menu.js
 * Rol: forma parte del proyecto y separa responsabilidades para que el codigo sea mas facil de explicar y mantener.
 * Idea clave: mantener este codigo separado ayuda a explicar que hace cada parte sin mezclar responsabilidades.
 * Como defenderlo: explicar primero que datos entran, que proceso se aplica y que salida produce.
 * Validacion: remarcar donde se controlan errores para que la app no falle con datos incorrectos.
 */
// Modulo del menu principal reutilizado por layout.js.

const LINKS = [
  { href: '/', label: 'Inicio', icono: 'grid-1x2-fill' },
  { href: '/calculo', label: 'Consigna 1', icono: 'calculator-fill' },
  { href: '/archivos', label: 'Consigna 2', icono: 'folder2-open' },
  { href: '/url', label: 'Consigna 3', icono: 'link-45deg' },
  { href: '/npm', label: 'Consigna 4', icono: 'box-seam-fill' },
];

// getMenu: Obtiene y devuelve informacion sin modificar el estado principal.
export function getMenu(rutaActiva = '/') {
  const links = LINKS.map(({ href, label, icono }) => {
    const activo = rutaActiva === href ? ' njs-nav__link--active' : '';
    return `
      <li class="njs-nav__item">
        <a class="njs-nav__link${activo}" href="${href}">
          <i class="bi bi-${icono}"></i>
          <span>${label}</span>
        </a>
      </li>
    `;
  }).join('');

  return `
    <header class="njs-topbar">
      <nav class="navbar navbar-expand-lg shell-ui">
        <div class="container-fluid px-3 px-lg-4">
          <a class="njs-topbar__brand" href="/">
            <span class="njs-topbar__logo">N</span>
            <span>NJS2</span>
          </a>
          <button class="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#menuPrincipal" aria-controls="menuPrincipal" aria-expanded="false" aria-label="Abrir menu">
            <i class="bi bi-list fs-4"></i>
          </button>
          <div class="collapse navbar-collapse mt-3 mt-lg-0" id="menuPrincipal">
            <ul class="navbar-nav ms-auto align-items-lg-center gap-1">
              ${links}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  `;
}
