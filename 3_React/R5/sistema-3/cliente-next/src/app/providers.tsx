"use client";

import type { ReactNode } from "react";
import { MotionConfig } from "motion/react";
import ClickSpark from "@/components/reactbits/ClickSpark";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";

// estado global del cliente; cada clic suelta chispas en los colores del atelier
export function Providers({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <ThemeProvider>
        <AuthProvider>
          <ClickSpark sparkColor={["#2f55f4", "#ffb38a", "#8fb1ff"]} sparkSize={9} sparkRadius={22} sparkCount={8} duration={420} className="spark-root">
            {children}
          </ClickSpark>
        </AuthProvider>
      </ThemeProvider>
    </MotionConfig>
  );
}
