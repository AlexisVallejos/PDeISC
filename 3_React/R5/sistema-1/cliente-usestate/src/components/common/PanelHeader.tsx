import { NexoMark } from "./Artwork";
import { House, LogOut, Moon, Sun, UserRound, UsersRound } from "lucide-react";
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
    <div className="atelier-brand"><NexoMark className="header-nexo" /><div><strong>NEXO</strong><span>Gestión de personas</span></div></div>
    <nav className="atelier-nav" aria-label="Navegación principal">
      {onViewChange && <><button type="button" onClick={() => onViewChange("directory")}><House size={18} aria-hidden="true" />Inicio</button><button type="button" className={activeView === "directory" ? "active" : ""} onClick={() => onViewChange("directory")}><UsersRound size={18} aria-hidden="true" />Usuarios</button></>}
      {onViewChange ? <button type="button" className={activeView === "profile" ? "active" : ""} onClick={() => onViewChange("profile")}><UserRound size={18} aria-hidden="true" />Mi perfil</button> : <span className="active"><UserRound size={18} aria-hidden="true" />Mi perfil</span>}
    </nav>
    <div className="atelier-header-actions"><button type="button" className="atelier-theme-button" onClick={onToggleTheme} aria-label={theme === "dark" ? "Activar tema claro" : "Activar tema oscuro"} title="Cambiar tema">{theme === "dark" ? <Sun size={19} /> : <Moon size={19} />}</button><span className="atelier-header-avatar" aria-label={user?.nombre ?? "Cuenta"}>{user ? initials(user.nombre) : "U"}</span><button type="button" className="atelier-logout" onClick={onLogout} aria-label="Cerrar sesión" title="Cerrar sesión"><LogOut size={19} /></button></div>
  </header>;
}
