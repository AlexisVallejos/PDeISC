"use client";

import { AuthForm } from "@/components/auth/AuthForm";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import CurvedLoop from "@/components/reactbits/CurvedLoop";
import { EditorialTitle } from "./EditorialTitle";
import { Masthead } from "./Masthead";
import { PaperCollage } from "./PaperCollage";

// portada de revista: titular y collage a la izquierda, el formulario como columna de texto a la derecha
export function AuthScreen({ mode }: { mode: "login" | "register" }) {
  const isRegister = mode === "register";

  return (
    <main className="auth-screen">
      <header className="auth-top">
        <span className="kicker">B · Estudio editorial</span>
        <Masthead />
        <ThemeToggle />
      </header>

      <section className="auth-cover">
        <EditorialTitle lines={["Un espacio", "para cada"]} emphasis="persona" />
        <p className="dek">Gestioná el equipo, da acceso y mantené el estudio en movimiento.</p>
        <PaperCollage className="auth-collage" />
      </section>

      <section className="auth-column" aria-label={isRegister ? "Crear cuenta" : "Ingresar"}>
        <span className="issue">N.º {isRegister ? "02 · Alta" : "01 · Acceso"}</span>
        <AuthForm
          mode={mode}
          title={isRegister ? <>Creá tu <em>cuenta</em></> : <>Iniciá <em>sesión</em></>}
          subtitle={isRegister ? "Completá los requisitos para sumarte al estudio." : "Entrá con tu correo o con la red que ya usás."}
        />
      </section>

      <div className="auth-loop" aria-hidden="true">
        <CurvedLoop marqueeText="Personas ✦ Ideas ✦ Resultados ✦ " speed={1.2} curveAmount={90} interactive={false} className="loop-text" />
      </div>
    </main>
  );
}
