import { ProfilePanel } from "@/components/profile/ProfilePanel";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";

// pantalla del usuario común: bienvenida + perfil
export default function HomePage() {
  const { user, setUser, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  if (!user) return null;

  return <ProfilePanel user={user} onUpdated={setUser} onLogout={logout} theme={theme} onToggleTheme={toggleTheme} />;
}
