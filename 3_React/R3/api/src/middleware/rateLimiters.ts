import rateLimit from "express-rate-limit";

const tooManyRequests = (message: string) => ({ message });

// frena la fuerza bruta: solo cuentan los intentos fallidos
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false,
  message: tooManyRequests("Demasiados intentos. Probá de nuevo en unos minutos."),
});

export const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: tooManyRequests("Demasiados registros desde esta conexión. Probá más tarde."),
});
