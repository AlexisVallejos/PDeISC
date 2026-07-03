/**
 * DOCUMENTACION PARA DEFENDER
 * Archivo: modules/ejercicio02_formulario/public/script.js
 * Rol: maneja dos formularios equivalentes, uno con Axios y otro con Fetch.
 * Idea clave: separa validacion visual, envio HTTP y manejo de respuesta para cada metodo.
 * Como defenderlo: mostrar que ambos flujos comparten reglas pero cambian solo en la forma de enviar.
 * Validacion: la interfaz valida antes de enviar y vuelve a pintar errores que devuelve el servidor.
 */
import { initializeThemeAndTop, renderStatus } from "/shared/common.js";

// Referencias de los formularios para las variantes de Axios y Fetch.
const forms = {
  axios: document.getElementById("axios-form"),
  fetch: document.getElementById("fetch-form")
};

// Las cajas de estado muestran el ultimo mensaje de cada metodo de envio.
const statusBoxes = {
  axios: document.getElementById("axios-status"),
  fetch: document.getElementById("fetch-status")
};

// Guarda las referencias de los inputs para cada campo del formulario.
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

// Guarda los elementos de ayuda en linea usados para mostrar errores de validacion.
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

// Botones de envio para cada metodo de transporte.
const axiosButton = document.getElementById("send-axios");
const fetchButton = document.getElementById("send-fetch");

// Reglas de validacion compartidas por ambos formularios.
const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ' ]+$/;
const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

// Valida el campo nombre y devuelve un mensaje de error o una cadena vacia.
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

// Valida el campo email y devuelve un mensaje de error o una cadena vacia.
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

// Actualiza el estado visual de un campo y su texto de ayuda.
function setFieldState(methodKey, fieldName, message) {
  const input = fieldMap[methodKey][fieldName];
  const helper = messageMap[methodKey][fieldName];
  helper.textContent = message;
  input.classList.toggle("is-invalid", Boolean(message));
  input.classList.toggle("is-valid", !message && input.value.trim() !== "");
}

// Valida todos los campos de una instancia de formulario.
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

// Construye el payload JSON que se enviara al servidor.
function getPayload(methodKey) {
  const fields = fieldMap[methodKey];
  return {
    nombre: fields.nombre.value.trim(),
    email: fields.email.value.trim()
  };
}

// Reinicia un formulario despues de un envio exitoso.
function resetFormState(methodKey) {
  forms[methodKey].reset();
  Object.keys(fieldMap[methodKey]).forEach((fieldName) => {
    setFieldState(methodKey, fieldName, "");
  });
}

// Vuelve a pintar los errores de validacion del servidor en los inputs correspondientes.
function applyBackendErrors(methodKey, backendErrors = {}) {
  Object.entries(backendErrors).forEach(([fieldName, message]) => {
    if (fieldMap[methodKey][fieldName]) {
      setFieldState(methodKey, fieldName, message);
    }
  });
}

// Agrega validacion en vivo para que el usuario reciba feedback mientras escribe.
function attachLiveValidation(methodKey) {
  const fields = fieldMap[methodKey];

  fields.nombre.addEventListener("input", () => {
    setFieldState(methodKey, "nombre", validateName(fields.nombre.value));
  });

  fields.email.addEventListener("input", () => {
    setFieldState(methodKey, "email", validateEmail(fields.email.value));
  });
}

// Envuelve el envio del formulario con Axios.
async function submitWithAxios(methodKey) {
  const response = await window.axios.post(
    "https://jsonplaceholder.typicode.com/users",
    getPayload(methodKey)
  );
  return {
    usuario: {
      ...response.data,
      id: 11,
      simulated: true
    }
  };
}

// Envuelve el envio del formulario con Fetch.
async function submitWithFetch(methodKey) {
  const response = await fetch("https://jsonplaceholder.typicode.com/users", {
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

  return {
    usuario: {
      ...data,
      id: 11,
      simulated: true
    }
  };
}

// Coordina la validacion, el envio de la peticion y el manejo de la respuesta.
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
      `Formulario enviado correctamente con ${sendMethod}. ID recibido: ${data.usuario.id} (simulada)`,
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

// Evita que el navegador recargue la pagina al enviar.
Object.values(forms).forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
  });
});

// Vincula el boton de envio de Axios.
axiosButton.addEventListener("click", () => {
  handleSubmit("axios", "axios.post()");
});

// Vincula el boton de envio de Fetch.
fetchButton.addEventListener("click", () => {
  handleSubmit("fetch", "fetch POST");
});

// Habilita la validacion en vivo para ambos formularios.
attachLiveValidation("axios");
attachLiveValidation("fetch");

// Reutiliza el tema compartido y la utilidad de volver arriba.
initializeThemeAndTop({
  themeButtonId: "theme-btn",
  topButtonId: "back-to-top",
  themeKey: "js4-point2-theme"
});
