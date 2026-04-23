const contentArea = document.getElementById("contentArea");

const templates = {
  card: `
    <article class="html-card">
      <h3>Tarjeta generada</h3>
      <p><strong>innerHTML</strong> agrego un article con titulo y texto.</p>
    </article>
  `,
  list: `
    <ul class="html-list">
      <li>Elemento HTML creado</li>
      <li>Insertado desde JavaScript</li>
      <li>Renderizado dinamicamente</li>
    </ul>
  `,
  table: `
    <table class="html-table">
      <thead>
        <tr><th>Objeto</th><th>Estado</th></tr>
      </thead>
      <tbody>
        <tr><td>Tabla</td><td>Agregada</td></tr>
        <tr><td>Filas</td><td>Visibles</td></tr>
      </tbody>
    </table>
  `,
  form: `
    <form class="inline-form">
      <label for="quickName">Nombre rapido</label>
      <input id="quickName" type="text" placeholder="Escribe un nombre">
      <button type="button" data-icon="IN">Boton interno</button>
    </form>
  `,
  notice: `
    <aside class="notice">
      <strong>Aviso:</strong> este bloque fue agregado desde una cadena HTML.
    </aside>
  `
};

function removeEmptyState() {
  const emptyState = contentArea.querySelector(".empty-state");

  if (emptyState) {
    emptyState.remove();
  }
}

document.querySelectorAll("[data-template]").forEach((button) => {
  button.addEventListener("click", () => {
    removeEmptyState();
    contentArea.innerHTML += templates[button.dataset.template];
  });
});

document.getElementById("clearContent").addEventListener("click", () => {
  contentArea.innerHTML = '<p class="empty-state">El contenido creado con innerHTML aparecera aqui.</p>';
});
