"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

// cambia entre claro y oscuro; el ícono muestra a qué tema se pasa
export function ThemeToggle({ className = "icon-btn" }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const toLight = theme === "dark";

  return (
    <button type="button" className={className} onClick={toggleTheme} aria-label={toLight ? "Usar tema claro" : "Usar tema oscuro"}>
      {toLight ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
    </button>
  );
}
