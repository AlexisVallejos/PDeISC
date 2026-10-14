import { LogOut, Moon, Sun } from "lucide-react";
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
export function PanelHeader({ theme, onToggleTheme, onLogout, activeView, onViewChange }: PanelHeaderProps) {
  return <header className="atelier-header">
    <div className="atelier-brand"><strong>ESTUDIO <em>/</em> <span>USUARIOS</span></strong></div>
    <nav className="atelier-nav" aria-label="Navegación principal">
      {onViewChange && <button type="button" className={activeView === "directory" ? "active" : ""} onClick={() => onViewChange("directory")}>Personas</button>}
      {onViewChange ? <button type="button" className={activeView === "profile" ? "active" : ""} onClick={() => onViewChange("profile")}>Mi perfil</button> : <span className="active">Mi perfil</span>}
    </nav>
    <div className="atelier-header-actions"><button type="button" className="atelier-theme-button" onClick={onToggleTheme} aria-label={theme === "dark" ? "Activar tema claro" : "Activar tema oscuro"} title="Cambiar tema">{theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}</button><button type="button" className="atelier-logout" onClick={onLogout} aria-label="Cerrar sesión" title="Cerrar sesión"><span>Salir</span><LogOut size={16} /></button></div>
  </header>;
}
