const form = document.getElementById("registerForm");
const result = document.getElementById("result");
const formMessage = document.getElementById("formMessage");

// Referencias directas a los campos para validar y leer sus valores.
const nameInput = form.elements.name;
const emailInput = form.elements.email;
const ageInput = form.elements.age;
const provinceSelect = form.elements.province;
const genderInputs = Array.from(form.querySelectorAll('input[name="gender"]'));
const interestInputs = Array.from(form.querySelectorAll('input[name="interests"]'));
const fieldsets = form.querySelectorAll("fieldset");

const allowedEmailDomains = ["gmail.com", "hotmail.com"];
const namePattern = /^[\p{L}\s]{3,50}$/u;

// Limpia mensajes y estados de error antes de una nueva validacion.
function clearValidationState() {
  formMessage.textContent = "";

  form.querySelectorAll(".invalid").forEach((field) => {
    field.classList.remove("invalid");
  });
}

// Marca un campo como invalido y muestra el mensaje correspondiente.
function markInvalid(field, message) {
  field.classList.add("invalid");
  formMessage.textContent = message;

  if (typeof field.focus === "function") {
    field.focus();
  }
}

// Devuelve el valor del radio que este seleccionado.
function getCheckedValue(inputs) {
  const checkedInput = inputs.find((input) => input.checked);
  return checkedInput ? checkedInput.value : "";
}

// Reune todos los checkbox marcados en un arreglo.
function getSelectedInterests() {
  // Reune todos los checkbox marcados en un arreglo.
  return interestInputs
    .filter((input) => input.checked)
    .map((input) => input.value);
}

// Valida que el nombre tenga el formato esperado.
function validateName() {
  const name = nameInput.value.trim();

  if (!namePattern.test(name)) {
    markInvalid(
      nameInput,
      "El nombre debe tener entre 3 y 50 letras y solo puede incluir espacios."
    );
    return false;
  }

  return true;
}

// Valida que el mail tenga @ y un dominio permitido.
function validateEmail() {
  const email = emailInput.value.trim().toLowerCase();
  const emailParts = email.split("@");

  if (!email.includes("@")) {
    markInvalid(
      emailInput,
      "Al mail le falta completar el @. Debe escribirse, por ejemplo, como nombre@gmail.com o nombre@hotmail.com."
    );
    return false;
  }

  if (emailParts.length !== 2 || !emailParts[0] || !allowedEmailDomains.includes(emailParts[1])) {
    markInvalid(
      emailInput,
      "El mail debe terminar con un dominio valido como gmail.com o hotmail.com. Ejemplos: nombre@gmail.com o nombre@hotmail.com."
    );
    return false;
  }

  return true;
}

// Valida que la edad sea un numero entero dentro del rango permitido.
function validateAge() {
  const age = Number(ageInput.value);

  if (!Number.isInteger(age) || age < 1 || age > 120) {
    markInvalid(ageInput, "La edad debe ser un numero entero entre 1 y 120.");
    return false;
  }

  return true;
}

// Verifica que el usuario haya elegido un genero.
function validateGender() {
  const genderFieldset = fieldsets[0];

  if (!getCheckedValue(genderInputs)) {
    markInvalid(genderFieldset, "Debes seleccionar un genero.");
    return false;
  }

  return true;
}

// Verifica que se haya seleccionado una provincia.
function validateProvince() {
  if (!provinceSelect.value) {
    markInvalid(provinceSelect, "Debes seleccionar una provincia.");
    return false;
  }

  return true;
}

// Verifica que exista al menos un interes marcado.
function validateInterests() {
  const interestsFieldset = fieldsets[1];

  if (getSelectedInterests().length === 0) {
    markInvalid(interestsFieldset, "Debes elegir al menos un interes.");
    return false;
  }

  return true;
}

// Crea una fila visual dentro del resumen final.
function appendResultItem(label, value) {
  const item = document.createElement("div");
  item.className = "result-item";

  const strong = document.createElement("strong");
  strong.textContent = `${label}: `;

  item.appendChild(strong);
  item.append(value);
  result.appendChild(item);
}

// Limpia el resultado anterior y agrega los nuevos datos.
function renderResult(data) {
  // replaceChildren limpia el resultado anterior antes de renderizar uno nuevo.
  result.replaceChildren();

  appendResultItem("Nombre", data.name);
  appendResultItem("Mail", data.email);
  appendResultItem("Edad", data.age);
  appendResultItem("Genero", data.gender);
  appendResultItem("Provincia", data.province);
  appendResultItem("Intereses", data.interests.join(", "));
}

// Ejecuta todas las validaciones necesarias del formulario.
function validateForm() {
  clearValidationState();

  const validations = [
    validateName,
    validateEmail,
    validateAge,
    validateGender,
    validateProvince,
    validateInterests
  ];

  return validations.every((validate) => validate());
}

// Captura el submit, valida y muestra los datos en la misma pagina.
form.addEventListener("submit", (event) => {
  event.preventDefault();

  // Solo muestra el resultado si todas las validaciones fueron aprobadas.
  if (!validateForm()) {
    return;
  }

  const formData = new FormData(form);

  renderResult({
    name: nameInput.value.trim(),
    email: emailInput.value.trim().toLowerCase(),
    age: formData.get("age"),
    gender: formData.get("gender"),
    province: formData.get("province"),
    interests: getSelectedInterests()
  });

  formMessage.textContent = "Muy bien, el formulario fue validado y los datos se cargaron correctamente.";
  formMessage.style.color = "var(--ok)";
});

// Mientras el usuario escribe, limpia el mensaje previo para volver a validar.
form.addEventListener("input", () => {
  clearValidationState();
  formMessage.style.color = "var(--danger)";
});
