const contentArea = document.getElementById("contentArea");
const allowedEmailDomains = ["gmail.com", "hotmail.com"];
const namePattern = /^[\p{L}\s]{3,50}$/u;

const templates = {
  // Cada clave guarda un bloque HTML listo para insertarse en pantalla.
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
    <form class="inline-form secure-inline-form" novalidate>
      <label>
        Nombre rapido
        <input class="quick-name" type="text" placeholder="Escribe un nombre" minlength="3" maxlength="50">
      </label>
      <label>
        Mail rapido
        <input class="quick-email" type="email" placeholder="nombre@gmail.com" inputmode="email">
      </label>
      <button class="validate-inline-form" type="button" data-icon="IN">Validar mini formulario</button>
      <p class="inline-feedback" aria-live="polite"></p>
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
    // innerHTML += agrega el nuevo bloque al contenido ya existente.
    contentArea.innerHTML += templates[button.dataset.template];
  });
});

document.getElementById("clearContent").addEventListener("click", () => {
  contentArea.innerHTML = '<p class="empty-state">El contenido creado con innerHTML aparecera aqui.</p>';
});

function showInlineFeedback(form, message, isValid) {
  const feedback = form.querySelector(".inline-feedback");
  feedback.textContent = message;
  feedback.classList.toggle("success", isValid);
}

function clearInlineValidation(form) {
  form.querySelectorAll(".invalid").forEach((field) => {
    field.classList.remove("invalid");
  });

  showInlineFeedback(form, "", false);
}

function validateInlineForm(form) {
  clearInlineValidation(form);

  // Valida el mini formulario generado dinamicamente con innerHTML.
  const nameInput = form.querySelector(".quick-name");
  const emailInput = form.querySelector(".quick-email");
  const nameValue = nameInput.value.trim();
  const emailValue = emailInput.value.trim().toLowerCase();
  const emailParts = emailValue.split("@");

  if (!namePattern.test(nameValue)) {
    nameInput.classList.add("invalid");
    showInlineFeedback(form, "El nombre debe tener entre 3 y 50 letras y solo puede incluir espacios.", false);
    nameInput.focus();
    return;
  }

  if (!emailValue.includes("@")) {
    emailInput.classList.add("invalid");
    showInlineFeedback(form, "Al mail le falta completar el @. Debe escribirse, por ejemplo, como nombre@gmail.com o nombre@hotmail.com.", false);
    emailInput.focus();
    return;
  }

  if (emailParts.length !== 2 || !emailParts[0] || !allowedEmailDomains.includes(emailParts[1])) {
    emailInput.classList.add("invalid");
    showInlineFeedback(form, "El mail debe terminar con un dominio valido como gmail.com o hotmail.com. Ejemplos: nombre@gmail.com o nombre@hotmail.com.", false);
    emailInput.focus();
    return;
  }

    showInlineFeedback(form, "Muy bien, el formulario de prueba fue aprobado.", true);
}

contentArea.addEventListener("click", (event) => {
  const validateButton = event.target.closest(".validate-inline-form");

  if (!validateButton) {
    return;
  }

  validateInlineForm(validateButton.closest(".secure-inline-form"));
});

contentArea.addEventListener("input", (event) => {
  const form = event.target.closest(".secure-inline-form");

  if (!form) {
    return;
  }

  clearInlineValidation(form);
});
