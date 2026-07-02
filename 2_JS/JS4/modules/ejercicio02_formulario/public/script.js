/**
 * DOCUMENTACION PARA DEFENDER
 * Archivo: modules/ejercicio02_formulario/public/script.js
 * Rol: maneja dos formularios equivalentes, uno con Axios y otro con Fetch.
 * Idea clave: separa validacion visual, envio HTTP y manejo de respuesta para cada metodo.
 * Como defenderlo: mostrar que ambos flujos comparten reglas pero cambian solo en la forma de enviar.
 * Validacion: el frontend valida antes de enviar y vuelve a pintar errores que devuelve el backend.
 */
import { initializeThemeAndTop, renderStatus } from "/shared/common.js";

// Form references for the Axios and Fetch variants.
const forms = {
  axios: document.getElementById("axios-form"),
  fetch: document.getElementById("fetch-form")
};

// Status boxes show the latest message for each submission method.
const statusBoxes = {
  axios: document.getElementById("axios-status"),
  fetch: document.getElementById("fetch-status")
};

// Store the input references for each form field.
const fieldMap = {
  axios: {
    nombre: document.getElementById("axios-nombre"),
    email: document.getElementById("axios-email")
  },
  fetch: {
    nombre: document.getElementById("fetch-nombre"),
    email: document.getElementById("fetch-email")
  }
};

// Store the inline helper elements used to show validation errors.
const messageMap = {
  axios: {
    nombre: document.getElementById("axios-nombre-error"),
    email: document.getElementById("axios-email-error")
  },
  fetch: {
    nombre: document.getElementById("fetch-nombre-error"),
    email: document.getElementById("fetch-email-error")
  }
};

// Submit buttons for each transport method.
const axiosButton = document.getElementById("send-axios");
const fetchButton = document.getElementById("send-fetch");

// Shared validation rules used by both forms.
const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ' ]+$/;
const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

// Validate the name field and return an error message or an empty string.
function validateName(value = "") {
  const limpio = value.trim();

  if (!limpio) {
    return "El nombre es obligatorio.";
  }

  if (limpio.length < 3) {
    return "El nombre debe tener al menos 3 caracteres.";
  }

  if (!nameRegex.test(limpio)) {
    return "Solo se permiten letras, espacios y apostrofes.";
  }

  return "";
}

// Validate the email field and return an error message or an empty string.
function validateEmail(value = "") {
  const limpio = value.trim();

  if (!limpio) {
    return "El email es obligatorio.";
  }

  if (!emailRegex.test(limpio)) {
    return "Ingresa un email valido.";
  }

  if (limpio.includes("..")) {
    return "El email no puede tener puntos consecutivos.";
  }

  return "";
}

// Update the visual state of a field and its helper text.
function setFieldState(methodKey, fieldName, message) {
  const input = fieldMap[methodKey][fieldName];
  const helper = messageMap[methodKey][fieldName];
  helper.textContent = message;
  input.classList.toggle("is-invalid", Boolean(message));
  input.classList.toggle("is-valid", !message && input.value.trim() !== "");
}

// Validate all the fields for one form instance.
function validateAll(methodKey) {
  const fields = fieldMap[methodKey];
  const errors = {
    nombre: validateName(fields.nombre.value),
    email: validateEmail(fields.email.value)
  };

  Object.entries(errors).forEach(([fieldName, message]) => {
    setFieldState(methodKey, fieldName, message);
  });

  return {
    isValid: !Object.values(errors).some(Boolean),
    errors
  };
}

// Build the JSON payload that will be sent to the backend.
function getPayload(methodKey) {
  const fields = fieldMap[methodKey];
  return {
    nombre: fields.nombre.value.trim(),
    email: fields.email.value.trim()
  };
}

// Reset a form after a successful submit.
function resetFormState(methodKey) {
  forms[methodKey].reset();
  Object.keys(fieldMap[methodKey]).forEach((fieldName) => {
    setFieldState(methodKey, fieldName, "");
  });
}

// Paint backend validation errors back into the corresponding inputs.
function applyBackendErrors(methodKey, backendErrors = {}) {
  Object.entries(backendErrors).forEach(([fieldName, message]) => {
    if (fieldMap[methodKey][fieldName]) {
      setFieldState(methodKey, fieldName, message);
    }
  });
}

// Attach live validation so the user gets feedback while typing.
function attachLiveValidation(methodKey) {
  const fields = fieldMap[methodKey];

  fields.nombre.addEventListener("input", () => {
    setFieldState(methodKey, "nombre", validateName(fields.nombre.value));
  });

  fields.email.addEventListener("input", () => {
    setFieldState(methodKey, "email", validateEmail(fields.email.value));
  });
}

// Submit the form using Axios.
async function submitWithAxios(methodKey) {
  const response = await window.axios.post("/api/usuarios", getPayload(methodKey));
  return response.data;
}

// Submit the form using Fetch.
async function submitWithFetch(methodKey) {
  const response = await fetch("/api/usuarios", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(getPayload(methodKey))
  });

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.mensaje || "No se pudo enviar el formulario.");
    error.data = data;
    throw error;
  }

  return data;
}

// Coordinate validation, request sending and response handling.
async function handleSubmit(methodKey, sendMethod) {
  const validation = validateAll(methodKey);

  if (!validation.isValid) {
    renderStatus(
      statusBoxes[methodKey],
      "Revisa los campos antes de enviar.",
      "error"
    );
    return;
  }

  renderStatus(
    statusBoxes[methodKey],
    `Enviando datos con ${sendMethod}...`,
    "info"
  );

  try {
    const data =
      sendMethod === "axios.post()"
        ? await submitWithAxios(methodKey)
        : await submitWithFetch(methodKey);

    renderStatus(
      statusBoxes[methodKey],
      `Formulario enviado correctamente con ${sendMethod}. ID recibido: ${data.usuario.id}`,
      "success"
    );
    resetFormState(methodKey);
  } catch (error) {
    const backendErrors = error.response?.data?.errores || error.data?.errores || {};
    applyBackendErrors(methodKey, backendErrors);
    renderStatus(
      statusBoxes[methodKey],
      error.response?.data?.mensaje ||
        error.data?.mensaje ||
        "No se pudo enviar el formulario.",
      "error"
    );
  }
}

// Prevent the browser from reloading the page on submit.
Object.values(forms).forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
  });
});

// Bind the Axios submit button.
axiosButton.addEventListener("click", () => {
  handleSubmit("axios", "axios.post()");
});

// Bind the Fetch submit button.
fetchButton.addEventListener("click", () => {
  handleSubmit("fetch", "fetch POST");
});

// Enable live validation for both forms.
attachLiveValidation("axios");
attachLiveValidation("fetch");

// Reuse the shared theme and scroll-to-top helper.
initializeThemeAndTop({
  themeButtonId: "theme-btn",
  topButtonId: "back-to-top",
  themeKey: "js4-point2-theme"
});
