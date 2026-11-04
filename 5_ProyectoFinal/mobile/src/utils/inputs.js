/**
 * Filtros para lo que se escribe en los campos: no dejan entrar caracteres que el campo
 * nunca aceptaría (letras en un peso, un segundo decimal, etc.). La validación de rangos
 * se hace aparte, en utils/validation.js, con los mismos límites que el servidor.
 */

/** Solo dígitos, como máximo `max` caracteres (reps, RPE, código, kcal enteras). */
export const digits = (max = 6) => (text) => String(text ?? '').replace(/\D/g, '').slice(0, max);

/**
 * Número con coma o punto: `int` dígitos enteros y `decimals` decimales como máximo.
 * '72,555' → '72,5' · 'abc80' → '80' · '1,2,3' → '1,2'
 */
export const decimal = (int = 4, decimals = 1) => (text) => {
  const clean = String(text ?? '').replace(/[^\d.,]/g, '');
  const sep = clean.search(/[.,]/);
  if (sep === -1) return clean.slice(0, int);
  const whole = clean.slice(0, sep).slice(0, int);
  if (decimals === 0) return whole;
  const fraction = clean.slice(sep + 1).replace(/[.,]/g, '').slice(0, decimals);
  return `${whole}${clean[sep]}${fraction}`;
};

/** Fecha AAAA-MM-DD: solo dígitos y los guiones se agregan solos (19980421 → 1998-04-21). */
export const dateMask = (text) => {
  const d = String(text ?? '').replace(/\D/g, '').slice(0, 8);
  return [d.slice(0, 4), d.slice(4, 6), d.slice(6, 8)].filter(Boolean).join('-');
};
