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
      <h2 style="margin:0 0 .5rem; font-size:1.1rem;">Menú de ejercicios</h2>
      <ul style="display:flex;gap:.5rem;list-style:none;padding:0;margin:0;flex-wrap:wrap;">
        ${items}
      </ul>
      <style>
        nav a {
          display: inline-block;
          text-decoration: none;
          background: #0b5fff;
          color: #fff;
          padding: 0.45rem 0.7rem;
          border-radius: 9px;
          font-size: 0.95rem;
        }

        nav a:hover {
          background: #064ac8;
        }

        @media (max-width: 540px) {
          nav a {
            font-size: 0.88rem;
            padding: 0.42rem 0.58rem;
          }
        }
      </style>
    </nav>
  `;
}

module.exports = {
  renderMenu,
};
