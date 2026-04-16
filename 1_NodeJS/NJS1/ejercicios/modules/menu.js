const links = [
  { href: '/', etiqueta: 'Inicio' },
  { href: '/clima-calculo', etiqueta: 'Clima y Cálculo' },
  { href: '/http-fs', etiqueta: 'HTTP + FS' },
  { href: '/url-info', etiqueta: 'URL' },
  { href: '/npm-upper', etiqueta: 'NPM upper-case' },
  { href: '/acerca', etiqueta: 'Acerca de' },
];

function renderMenu() {
  const items = links
    .map((link) => `<li><a href="${link.href}">${link.etiqueta}</a></li>`)
    .join('');

  return `
    <nav>
      <h2>Menú principal</h2>
      <ul style="display:flex;gap:16px;list-style:none;padding:0;flex-wrap:wrap;">
        ${items}
      </ul>
    </nav>
  `;
}

module.exports = {
  renderMenu,
};
