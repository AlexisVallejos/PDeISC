import { Moon, Sun } from "lucide-react";

export default function ThemeToggle({ dark, onToggle }) {
  return (
    <button
      className="theme"
      type="button"
      aria-label={dark ? "Activar modo claro" : "Activar modo oscuro"}
      onClick={onToggle}
    >
      {dark ? <Sun /> : <Moon />}
    </button>
  );
}
