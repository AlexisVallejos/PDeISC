import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

const THEME_KEY = "editorial-theme";
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  // el tema elegido se recuerda en localStorage
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem(THEME_KEY) as Theme) || "light");

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(THEME_KEY, theme);
    // la barra de estado del celular toma el color del fondo del tema
    const canvas = getComputedStyle(document.documentElement).getPropertyValue("--canvas").trim();
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", canvas);
  }, [theme]);

  // el cambio claro/oscuro se funde en vez de saltar de golpe (si el navegador lo soporta)
  const toggleTheme = () => {
    const next: Theme = theme === "light" ? "dark" : "light";
    const doc = document as Document & { startViewTransition?: (update: () => void) => unknown };
    if (!doc.startViewTransition || matchMedia("(prefers-reduced-motion: reduce)").matches) return setTheme(next);
    doc.startViewTransition(() => {
      document.documentElement.dataset.theme = next;
      setTheme(next);
    });
  };

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}

export const useTheme = (): ThemeContextValue => useContext(ThemeContext)!;
