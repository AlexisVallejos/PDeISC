"use client";

import type { ReactNode } from "react";
import { MotionConfig } from "motion/react";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";

// estado global del cliente; MotionConfig respeta «reducir movimiento» del sistema
export function Providers({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <ThemeProvider>
        <AuthProvider>{children}</AuthProvider>
      </ThemeProvider>
    </MotionConfig>
  );
}
