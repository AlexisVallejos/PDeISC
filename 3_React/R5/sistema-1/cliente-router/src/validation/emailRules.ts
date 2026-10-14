// reglas de useForm para el correo
export const emailRules = {
  required: "El correo electrónico es obligatorio.",
  maxLength: { value: 120, message: "El correo no puede superar los 120 caracteres." },
  pattern: {
    value: /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/,
    message: "Ingresá un correo válido, con @ y un dominio final como .com.",
  },
};
