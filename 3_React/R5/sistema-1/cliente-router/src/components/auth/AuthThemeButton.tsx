import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export function AuthThemeButton() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button className="auth-theme" type="button" onClick={toggleTheme} aria-label="Cambiar tema">
      {theme === "light" ? <Moon /> : <Sun />}
    </button>
  );
}
