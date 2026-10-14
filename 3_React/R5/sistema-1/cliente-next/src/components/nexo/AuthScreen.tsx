"use client";

import { AuthForm } from "@/components/auth/AuthForm";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import DecryptedText from "@/components/reactbits/DecryptedText";
import Magnet from "@/components/reactbits/Magnet";
import ShinyText from "@/components/reactbits/ShinyText";
import SpotlightCard from "@/components/reactbits/SpotlightCard";
import { useTheme } from "@/context/ThemeContext";
import { Globe } from "./Globe";
import { NexoMark } from "./NexoMark";

// pantalla de ingreso: el globo ocupa la escena y el formulario flota en una tarjeta con foco de luz
export function AuthScreen({ mode }: { mode: "login" | "register" }) {
  const { theme } = useTheme();
  const isRegister = mode === "register";

  return (
    <main className="auth-screen">
      <Globe className="auth-globe" />

      <section className="auth-hero">
        <ShinyText text="A · CONTROL NOCTURNO" className="eyebrow" color={theme === "dark" ? "#9baac2" : "#5d6e86"} shineColor={theme === "dark" ? "#c7ff58" : "#3f7d0e"} speed={3.2} />
        <NexoMark className="auth-logo" />
        <h2 className="display">
          Personas,
          <br />
          <DecryptedText text="en orden." animateOn="view" sequential revealDirection="start" speed={45} className="accent" encryptedClassName="accent dim" characters="01<>/#*+=" />
        </h2>
        <p className="lead">Un equipo organizado hace grandes cosas. Entrá con tu correo o con la red que ya usás.</p>
      </section>

      <SpotlightCard className="auth-card" theme={theme} spotlightColor="rgba(199, 255, 88, 0.22)" style={{ "--spotlight-card-surface": "var(--glass)" } as React.CSSProperties}>
        <div className="auth-card-top">
          <span className="chip">{isRegister ? "Cuenta nueva" : "Acceso seguro"}</span>
          <ThemeToggle />
        </div>
        <AuthForm
          mode={mode}
          title={isRegister ? "Creá tu cuenta" : "Iniciá sesión"}
          subtitle={isRegister ? "Completá los requisitos para empezar." : "Entrá para continuar con tu equipo."}
          wrapSubmit={(button) => <Magnet padding={40} magnetStrength={6} maxOffset={8} wrapperClassName="magnet-block">{button}</Magnet>}
        />
      </SpotlightCard>
    </main>
  );
}
