import { useNavigate } from "react-router-dom";
import { AuthForm } from "@/components/auth/AuthForm";
import { useAuth } from "@/context/AuthContext";
import { useAuthRequest } from "@/hooks/useAuthRequest";
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

  async function submit(values: AuthValues) {
    const user = await send(isRegister ? register : login, values);
    if (user) navigate(homePath(user));
  }

  return (
    <AuthForm
      mode={mode}
      busy={busy}
      message={message}
      onSubmit={submit}
      onSwitch={() => navigate(isRegister ? "/ingresar" : "/registro")}
    />
  );
}
