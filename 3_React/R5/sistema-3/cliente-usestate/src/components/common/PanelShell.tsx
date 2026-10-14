import { useEffect, useState, type ReactNode } from "react";
import { LogoutDialog } from "./LogoutDialog";
import { PanelHeader } from "./PanelHeader";
import { ScrollTopButton } from "./ScrollTopButton";
import type { User } from "@/types/user";

interface PanelShellProps {
  theme: "light" | "dark";
  onToggleTheme: () => void;
  onLogout: () => void;
  children: ReactNode;
  activeView?: "directory" | "profile";
  onViewChange?: (view: "directory" | "profile") => void;
  user?: User | null;
}

// marco de los paneles (administrador y usuario): encabezado, logout con confirmación y botón de subir
export function PanelShell({ theme, onToggleTheme, onLogout, children, activeView = "profile", onViewChange, user }: PanelShellProps) {
  const [askLogout, setAskLogout] = useState(false);

  // activa el tema shadcn (ver styles/panel.css) solo mientras se muestra un panel
  useEffect(() => {
    document.body.classList.add("admin-ui");
    return () => document.body.classList.remove("admin-ui");
  }, []);

  return (
    <div className="atelier-shell">
      <PanelHeader theme={theme} onToggleTheme={onToggleTheme} onLogout={() => setAskLogout(true)} activeView={activeView} onViewChange={onViewChange} user={user} />
      {children}
      <ScrollTopButton />
      <LogoutDialog open={askLogout} onOpenChange={setAskLogout} onConfirm={onLogout} />
    </div>
  );
}
