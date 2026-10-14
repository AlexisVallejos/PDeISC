import { LogOut, Moon, Sun } from "lucide-react";
import { initials } from "@/utils/initials";
import type { User } from "@/types/user";

interface PanelHeaderProps {
  theme: "light" | "dark";
  onToggleTheme: () => void;
  onLogout: () => void;
  activeView: "directory" | "profile";
  onViewChange?: (view: "directory" | "profile") => void;
  user?: User | null;
}

// logo a la izquierda; cambio de tema y cerrar sesión a la derecha
export function PanelHeader({ theme, onToggleTheme, onLogout, activeView, onViewChange, user }: PanelHeaderProps) {
  return <header className="atelier-header">
    <div className="atelier-brand"><img src="/atelier-logo.png" alt="" /><div><span>ATELIER MODULAR</span><strong>Usuarios</strong></div></div>
    <nav className="atelier-nav" aria-label="Navegación principal">
      {onViewChange && <button type="button" className={activeView === "directory" ? "active" : ""} onClick={() => onViewChange("directory")}>Directorio</button>}
      {onViewChange ? <button type="button" className={activeView === "profile" ? "active" : ""} onClick={() => onViewChange("profile")}>Mi perfil</button> : <span className="active">Mi perfil</span>}
    </nav>
    <div className="atelier-header-actions"><button type="button" className="atelier-theme-button" onClick={onToggleTheme} aria-label={theme === "dark" ? "Activar tema claro" : "Activar tema oscuro"} title="Cambiar tema"><Sun size={19} /><span className="atelier-theme-knob" /><Moon size={18} /></button><span className="atelier-header-divider" /><span className="atelier-header-avatar" aria-label={user?.nombre ?? "Cuenta"}>{user ? initials(user.nombre) : "U"}</span><button type="button" className="atelier-logout" onClick={onLogout} aria-label="Cerrar sesión" title="Cerrar sesión"><LogOut size={19} /></button></div>
  </header>;
}
