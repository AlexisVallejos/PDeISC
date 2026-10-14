import { useEffect, useState, type ReactNode } from "react";
import { LogoutDialog } from "./LogoutDialog";
import { PanelHeader } from "./PanelHeader";
import { ScrollTopButton } from "./ScrollTopButton";

interface PanelShellProps {
  theme: "light" | "dark";
  onToggleTheme: () => void;
  onLogout: () => void;
  children: ReactNode;
}

// marco de los paneles (administrador y usuario): encabezado, logout con confirmación y botón de subir
export function PanelShell({ theme, onToggleTheme, onLogout, children }: PanelShellProps) {
  const [askLogout, setAskLogout] = useState(false);

  // activa el tema shadcn (ver styles/panel.css) solo mientras se muestra un panel
  useEffect(() => {
    document.body.classList.add("admin-ui");
    return () => document.body.classList.remove("admin-ui");
  }, []);

  return (
    <div className="mx-auto flex w-full max-w-[2000px] flex-col gap-6 px-4 py-8 sm:px-8 xl:px-12">
      <PanelHeader theme={theme} onToggleTheme={onToggleTheme} onLogout={() => setAskLogout(true)} />
      {children}
      <ScrollTopButton />
      <LogoutDialog open={askLogout} onOpenChange={setAskLogout} onConfirm={onLogout} />
    </div>
  );
}
