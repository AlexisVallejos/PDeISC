import axios from "axios";

// la cookie de sesión viaja sola gracias a withCredentials
export const api = axios.create({
  baseURL: "http://localhost:4000/api",
  withCredentials: true,
});

// saca el mensaje que mandó el servidor, o uno genérico
export const getMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) return error.response?.data?.message || "No se pudo completar la operación.";
  return "No se pudo completar la operación.";
};
