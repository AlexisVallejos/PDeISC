// reglas de useForm para el nombre
export const nameRules = {
  required: "El nombre es obligatorio.",
  minLength: { value: 2, message: "El nombre debe tener al menos 2 caracteres." },
  maxLength: { value: 80, message: "El nombre no puede superar los 80 caracteres." },
  pattern: {
    value: /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ ]+$/,
    message: "El nombre solo puede contener letras y espacios, sin números.",
  },
};
