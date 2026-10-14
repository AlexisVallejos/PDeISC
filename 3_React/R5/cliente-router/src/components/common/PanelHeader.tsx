import { LogOutIcon, MoonIcon, SunIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PanelHeaderProps {
  theme: "light" | "dark";
  onToggleTheme: () => void;
  onLogout: () => void;
}

// logo a la izquierda; cambio de tema y cerrar sesión a la derecha
export function PanelHeader({ theme, onToggleTheme, onLogout }: PanelHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2.5">
        <img src="/logo-isotipo.png" alt="" className="size-10 object-contain" />
        <strong className="text-2xl font-extrabold tracking-tighter">DePaso</strong>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon-lg" className="rounded-full" onClick={onToggleTheme} aria-label="Cambiar tema" title="Cambiar tema">
          {theme === "dark" ? <SunIcon /> : <MoonIcon />}
        </Button>
        <Button variant="outline" size="icon-lg" className="rounded-full" onClick={onLogout} aria-label="Cerrar sesión" title="Cerrar sesión">
          <LogOutIcon />
        </Button>
      </div>
    </div>
  );
}
