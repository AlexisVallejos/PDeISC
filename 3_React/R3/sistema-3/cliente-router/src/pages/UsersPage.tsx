import { AdminPanel } from "@/components/admin/AdminPanel";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";

// pantalla del administrador: gestión de usuarios
export default function UsersPage() {
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return <AdminPanel theme={theme} onToggleTheme={toggleTheme} onLogout={logout} />;
}
