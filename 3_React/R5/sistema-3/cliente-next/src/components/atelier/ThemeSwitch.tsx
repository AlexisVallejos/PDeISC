"use client";

import { Moon, Sun } from "lucide-react";
import SquishSwitch from "@/components/reactbits/SquishSwitch";
import { useTheme } from "@/context/ThemeContext";

// interruptor elástico entre sol y luna; el pulgar se estira con la velocidad del gesto
export function ThemeSwitch() {
  const { theme, toggleTheme } = useTheme();
  const dark = theme === "dark";

  return (
    <span className="theme-switch">
      <Sun aria-hidden="true" className={dark ? "" : "is-on"} />
      <SquishSwitch
        checked={dark}
        onChange={(next) => next !== dark && toggleTheme()}
        ariaLabel="Tema oscuro"
        width={52}
        height={30}
        trackColor="#dfe4ff"
        trackOnColor="#2f55f4"
        thumbColor="#2f55f4"
        thumbOnColor="#ffffff"
      />
      <Moon aria-hidden="true" className={dark ? "is-on" : ""} />
    </span>
  );
}
