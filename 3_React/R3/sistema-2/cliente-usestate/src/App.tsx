import { useState } from "react";
import { AdminPanel } from "@/components/admin/AdminPanel";
import { AuthForm } from "@/components/auth/AuthForm";
import { ProfilePanel } from "@/components/profile/ProfilePanel";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useAuthRequest } from "@/hooks/useAuthRequest";

// sistema con useState: la pantalla que se ve depende del estado (sesión y modo), sin React Router
function App() {
  const { user, loading, login, register, setUser, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { busy, message, send, clearMessage } = useAuthRequest();
  const [mode, setMode] = useState<"login" | "register">("login");

  if (loading) return <main className="center">Cargando sesión...</main>;

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

  return (
    <main className="auth-main">
      <AuthForm
        mode={mode}
        busy={busy}
        message={message}
        onSwitch={switchMode}
        onSubmit={(values) => send(isRegister ? register : login, values)}
      />
    </main>
  );
}

export default App;
