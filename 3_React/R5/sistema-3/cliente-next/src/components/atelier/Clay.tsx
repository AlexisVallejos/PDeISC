"use client";

import dynamic from "next/dynamic";
import { useReducedMotion } from "motion/react";
import { useTheme } from "@/context/ThemeContext";

// three.js se carga aparte y solo en el navegador; mientras tanto quedan manchas suaves en CSS
const ClayScene = dynamic(() => import("./ClayScene"), {
  ssr: false,
  loading: () => <div className="clay-fallback" />,
});

export function Clay({ className = "" }: { className?: string }) {
  const { theme } = useTheme();
  const reduced = useReducedMotion() ?? false;

  return (
    <div className={`clay ${className}`}>
      <ClayScene dark={theme === "dark"} reduced={reduced} />
    </div>
  );
}
