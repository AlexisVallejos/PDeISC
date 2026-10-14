import { useState } from "react";
import { AdminPanel } from "@/components/admin/AdminPanel";
import { AuthForm } from "@/components/auth/AuthForm";
import { ProfilePanel } from "@/components/profile/ProfilePanel";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useAuthRequest } from "@/hooks/useAuthRequest";
import { getOAuthProvider } from "@/services/api";
import { oauthUrlRequest } from "@/services/authService";
import OAuthCallbackPage from "@/pages/OAuthCallbackPage";
import type { AuthValues } from "@/services/authService";

// sistema con useState: la pantalla que se ve depende del estado (sesión y modo), sin React Router
function App() {
  const { user, loading, login, register, setUser, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { busy, message, send, clearMessage } = useAuthRequest();
  const [mode, setMode] = useState<"login" | "register">("login");

  if (loading) return <main className="center">Cargando sesión...</main>;
  const callback = window.location.pathname.match(/^\/auth\/([a-z]+)\/callback$/);
  if (callback) return <OAuthCallbackPage provider={callback[1]} />;

  // al cerrar sesión vuelve siempre a la pantalla de login
  async function handleLogout() {
    await logout();
    setMode("login");
  }

  const panelProps = { theme, onToggleTheme: toggleTheme, onLogout: handleLogout };
  if (user?.rol === "administrador") return <main><AdminPanel {...panelProps} /></main>;
  if (user) return <main><ProfilePanel user={user} onUpdated={setUser} {...panelProps} /></main>;

  const isRegister = mode === "register";

  function switchMode() {
    clearMessage();
    setMode(isRegister ? "login" : "register");
  }

  async function loginOrRedirect(values: AuthValues) {
    try { return await login(values); }
    catch (error) {
      const provider = getOAuthProvider(error);
      if (provider) {
        try { window.location.assign(await oauthUrlRequest(provider)); } catch { /* el mensaje original sigue visible */ }
      }
      throw error;
    }
  }

  async function socialLogin(providerId: string) {
    const url = await send(oauthUrlRequest, providerId);
    if (url) window.location.assign(url);
  }

  return (
    <main className="auth-main">
      <AuthForm
        mode={mode}
        busy={busy}
        message={message}
        onSwitch={switchMode}
        onSubmit={(values) => send(isRegister ? register : loginOrRedirect, values)}
        onSocial={socialLogin}
      />
    </main>
  );
}

export default App;
