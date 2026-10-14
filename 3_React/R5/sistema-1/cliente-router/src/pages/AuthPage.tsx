import { useNavigate } from "react-router-dom";
import { AuthForm } from "@/components/auth/AuthForm";
import { useAuth } from "@/context/AuthContext";
import { useAuthRequest } from "@/hooks/useAuthRequest";
import { getOAuthProvider } from "@/services/api";
import { oauthUrlRequest } from "@/services/authService";
import { homePath } from "@/utils/homePath";
import type { AuthValues } from "@/services/authService";

interface AuthPageProps {
  mode: "login" | "register";
}

// login (mode = "login") y registro (mode = "register")
export default function AuthPage({ mode }: AuthPageProps) {
  const { login, register } = useAuth();
  const navigate = useNavigate();
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
    if (user) navigate(homePath(user));
  }

  // ingreso con una red: la API me da la dirección del proveedor y voy para allá
  async function socialLogin(providerId: string) {
    const url = await send(oauthUrlRequest, providerId);
    if (url) window.location.assign(url);
  }

  return (
    <AuthForm
      mode={mode}
      busy={busy}
      message={message}
      onSubmit={submit}
      onSocial={socialLogin}
      onSwitch={() => navigate(isRegister ? "/ingresar" : "/registro")}
    />
  );
}
