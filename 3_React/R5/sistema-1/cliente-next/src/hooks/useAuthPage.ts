"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useAuthRequest } from "@/hooks/useAuthRequest";
import { getOAuthProvider } from "@/services/api";
import { oauthUrlRequest, type AuthValues } from "@/services/authService";
import { homePath } from "@/utils/homePath";

// lógica de login / registro, separada de la presentación de cada sistema
export function useAuthPage(mode: "login" | "register") {
  const { login, register } = useAuth();
  const router = useRouter();
  const { busy, message, send } = useAuthRequest();
  const isRegister = mode === "register";

  // login normal; si la cuenta se creó con una red, mando al usuario directo a esa red
  async function loginOrRedirect(values: AuthValues) {
    try {
      return await login(values);
    } catch (error) {
      const providerId = getOAuthProvider(error);
      if (providerId) {
        try { window.location.assign(await oauthUrlRequest(providerId)); } catch { /* si falla, queda el aviso del servidor */ }
      }
      throw error;
    }
  }

  async function submit(values: AuthValues) {
    const user = await send(isRegister ? register : loginOrRedirect, values);
    if (user) router.replace(homePath(user));
  }

  // ingreso con una red: la API me da la dirección del proveedor y voy para allá
  async function social(providerId: string) {
    const url = await send(oauthUrlRequest, providerId);
    if (url) window.location.assign(url);
  }

  return { busy, message, submit, social, switchHref: isRegister ? "/ingresar" : "/registro" };
}
