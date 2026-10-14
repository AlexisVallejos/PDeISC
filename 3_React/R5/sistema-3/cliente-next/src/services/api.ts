import axios from "axios";

// la cookie de sesión viaja sola gracias a withCredentials
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4005/api",
  withCredentials: true,
});

// saca el mensaje que mandó el servidor, o uno genérico
export const getMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) return error.response?.data?.message || "No se pudo completar la operación.";
  return "No se pudo completar la operación.";
};

// La API indica el proveedor de una cuenta creada con ingreso social.
export const getOAuthProvider = (error: unknown): string | null => {
  if (!axios.isAxiosError(error)) return null;
  const provider = error.response?.data?.oauthProvider;
  return typeof provider === "string" ? provider : null;
};
