import axios from "axios";

// "/api" lo reenvía el servidor de Vite a la API (ver vite.config.ts); la cookie de sesión viaja sola
export const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

// saca el mensaje que mandó el servidor, o uno genérico
export const getMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) return error.response?.data?.message || "No se pudo completar la operación.";
  return "No se pudo completar la operación.";
};

// si el servidor dice que la cuenta se creó con una red, devuelve el id de esa red
export const getOAuthProvider = (error: unknown): string | null => {
  if (!axios.isAxiosError(error)) return null;
  const provider = error.response?.data?.oauthProvider;
  return typeof provider === "string" ? provider : null;
};
