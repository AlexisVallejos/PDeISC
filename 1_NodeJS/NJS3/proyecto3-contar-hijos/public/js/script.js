const tabs = document.querySelectorAll(".tab");
const components = document.querySelectorAll(".component");
const result = document.getElementById("result");
const allowedEmailDomains = ["gmail.com", "hotmail.com"];
const namePattern = /^[\p{L}\s]{3,50}$/u;

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((item) => item.classList.remove("active"));
    components.forEach((component) => component.classList.remove("active"));

    tab.classList.add("active");
    document.getElementById(tab.dataset.target).classList.add("active");
  });
});

document.querySelectorAll(".count-button").forEach((button) => {
  button.addEventListener("click", () => {
    const component = button.closest(".component");
    const childList = component.querySelector(".child-list");
    // children cuenta solo nodos hijos de tipo elemento.
    const amount = childList.children.length;
    const label = childList.dataset.label;

    result.textContent = `El componente "${component.querySelector("h2").textContent}" contiene ${amount} hijos (${label}).`;
  });
});

function showFormFeedback(form, message, isValid) {
  const feedback = form.querySelector(".form-feedback");
  feedback.textContent = message;
  feedback.classList.toggle("success", isValid);
}

function clearFormValidation(form) {
  form.querySelectorAll(".invalid").forEach((field) => {
    field.classList.remove("invalid");
  });

  showFormFeedback(form, "", false);
}

function validateSecureForm(form) {
  clearFormValidation(form);

  // Toma los valores escritos y los normaliza antes de validar.
  const nameInput = form.querySelector(".secure-name");
  const emailInput = form.querySelector(".secure-email");
  const nameValue = nameInput.value.trim();
  const emailValue = emailInput.value.trim().toLowerCase();
  const emailParts = emailValue.split("@");

  if (!namePattern.test(nameValue)) {
    nameInput.classList.add("invalid");
    showFormFeedback(form, "El nombre debe tener entre 3 y 50 letras y solo puede incluir espacios.", false);
    nameInput.focus();
    return;
  }

  if (!emailValue.includes("@")) {
    emailInput.classList.add("invalid");
    showFormFeedback(form, "Al mail le falta completar el @. Debe escribirse, por ejemplo, como nombre@gmail.com o nombre@hotmail.com.", false);
    emailInput.focus();
    return;
  }

  if (emailParts.length !== 2 || !emailParts[0] || !allowedEmailDomains.includes(emailParts[1])) {
    emailInput.classList.add("invalid");
    showFormFeedback(form, "El mail debe terminar con un dominio valido como gmail.com o hotmail.com. Ejemplos: nombre@gmail.com o nombre@hotmail.com.", false);
    emailInput.focus();
    return;
  }

  showFormFeedback(form, "Muy bien, el formulario de prueba fue aprobado.", true);
}

document.querySelectorAll(".secure-form").forEach((form) => {
  // El formulario de ejemplo se valida sin enviarse al servidor.
  form.querySelector(".validate-form-button").addEventListener("click", () => {
    validateSecureForm(form);
  });

  form.addEventListener("input", () => {
    clearFormValidation(form);
  });
});

