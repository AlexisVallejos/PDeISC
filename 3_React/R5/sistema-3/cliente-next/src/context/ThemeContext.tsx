"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { DEFAULT_THEME, THEME_KEY, type Theme } from "@/utils/theme";

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  // el script de layout.tsx ya puso data-theme antes de pintar; acá solo lo leo
  const [theme, setTheme] = useState<Theme>(DEFAULT_THEME);
  const [synced, setSynced] = useState(false);

  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === "dark" ? "dark" : "light");
    setSynced(true);
  }, []);

  // no escribo nada hasta haber leído el tema guardado (si no, el valor por defecto lo pisaría)
  useEffect(() => {
    if (!synced) return;
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem(THEME_KEY, theme); } catch { /* modo privado: no se recuerda */ }
    // la barra de estado del celular toma el color del fondo del tema
    const canvas = getComputedStyle(document.documentElement).getPropertyValue("--canvas").trim();
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", canvas);
  }, [theme, synced]);

  // el cambio claro/oscuro se funde en vez de saltar de golpe (si el navegador lo soporta)
  const toggleTheme = () => {
    const next: Theme = theme === "light" ? "dark" : "light";
    if (!document.startViewTransition || matchMedia("(prefers-reduced-motion: reduce)").matches) return setTheme(next);
    document.startViewTransition(() => {
      document.documentElement.dataset.theme = next;
      setTheme(next);
    });
  };

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}

export const useTheme = (): ThemeContextValue => useContext(ThemeContext)!;
