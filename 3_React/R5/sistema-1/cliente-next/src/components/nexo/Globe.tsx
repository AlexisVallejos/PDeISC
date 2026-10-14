"use client";

import dynamic from "next/dynamic";
import { useReducedMotion } from "motion/react";
import { useTheme } from "@/context/ThemeContext";

// three.js pesa: se carga aparte y solo en el navegador; mientras tanto queda un halo en CSS
const GlobeScene = dynamic(() => import("./GlobeScene"), {
  ssr: false,
  loading: () => <div className="globe-fallback" />,
});

export function Globe({ className = "" }: { className?: string }) {
  const { theme } = useTheme();
  const reduced = useReducedMotion() ?? false;

  return (
    <div className={`globe ${className}`} aria-hidden="true">
      <GlobeScene dark={theme === "dark"} reduced={reduced} />
    </div>
  );
}
