// Importa la función compartida que muestra el estado y administra tema/voler arriba.
import { initializeThemeAndTop, renderStatus } from "/shared/common.js";

// Referencias a los formularios de axios y fetch en la página.
const forms = {
  axios: document.getElementById("axios-form"),
  fetch: document.getElementById("fetch-form")
};

// Referencias a los recuadros donde se muestra el estado de cada envío.
const statusBoxes = {
  axios: document.getElementById("axios-status"),
  fetch: document.getElementById("fetch-status")
};

// Referencias a los campos de nombre y email en cada formulario.
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

// Referencias a los mensajes de error debajo de cada campo.
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

// Botones que envían los formularios con axios o fetch.
const axiosButton = document.getElementById("send-axios");
const fetchButton = document.getElementById("send-fetch");

// Expresiones regulares para validar nombre y email.
const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ' ]+$/;
const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

// Valida el campo de nombre y devuelve un mensaje de error si no es válido.
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

  return ""; // Sin error.
}

// Valida el campo de email y devuelve un mensaje de error si no es válido.
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

  return ""; // Sin error.
}

// Actualiza el estado visual del campo y el texto de ayuda según el mensaje.
function setFieldState(methodKey, fieldName, message) {
  const input = fieldMap[methodKey][fieldName];
  const helper = messageMap[methodKey][fieldName];
  helper.textContent = message;
  input.classList.toggle("is-invalid", Boolean(message));
  input.classList.toggle("is-valid", !message && input.value.trim() !== "");
}

// Valida todos los campos de un formulario y actualiza su estado.
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

// Construye el payload JSON con los valores actuales de los campos.
function getPayload(methodKey) {
  const fields = fieldMap[methodKey];
  return {
    nombre: fields.nombre.value.trim(),
    email: fields.email.value.trim()
  };
}

// Resetea el formulario y limpia los mensajes y estilos de validación.
function resetFormState(methodKey) {
  forms[methodKey].reset();
  Object.keys(fieldMap[methodKey]).forEach((fieldName) => {
    setFieldState(methodKey, fieldName, "");
  });
}

// Muestra errores enviados desde el backend en los campos correspondientes.
function applyBackendErrors(methodKey, backendErrors = {}) {
  Object.entries(backendErrors).forEach(([fieldName, message]) => {
    if (fieldMap[methodKey][fieldName]) {
      setFieldState(methodKey, fieldName, message);
    }
  });
}

// Adjunta validación en tiempo real mientras el usuario escribe.
function attachLiveValidation(methodKey) {
  const fields = fieldMap[methodKey];

  fields.nombre.addEventListener("input", () => {
    setFieldState(methodKey, "nombre", validateName(fields.nombre.value));
  });

  fields.email.addEventListener("input", () => {
    setFieldState(methodKey, "email", validateEmail(fields.email.value));
  });
}

// Envía el formulario usando axios hacia la ruta de backend.
async function submitWithAxios(methodKey) {
  const response = await window.axios.post("/api/usuarios", getPayload(methodKey));
  return response.data;
}

// Envía el formulario usando fetch hacia la ruta de backend.
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

// Maneja el envío del formulario, ya sea con axios o con fetch.
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

// Evita que el submit tradicional recargue la página al presionar Enter o clickear el botón.
Object.values(forms).forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
  });
});

// Evento del botón que envía con axios.
axiosButton.addEventListener("click", () => {
  handleSubmit("axios", "axios.post()");
});

// Evento del botón que envía con fetch.
fetchButton.addEventListener("click", () => {
  handleSubmit("fetch", "fetch POST");
});

// Activa la validación en vivo para ambos métodos de envío.
attachLiveValidation("axios");
attachLiveValidation("fetch");

// Inicializa el tema y el botón de volver arriba.
initializeThemeAndTop({
  themeButtonId: "theme-btn",
  topButtonId: "back-to-top",
  themeKey: "js4-point2-theme"
});
