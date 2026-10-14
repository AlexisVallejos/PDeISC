"use client";

import { AuthForm } from "@/components/auth/AuthForm";
import { Brand } from "./Brand";
import { Clay } from "./Clay";
import { ThemeSwitch } from "./ThemeSwitch";

// una sola tarjeta grande: la ventana 3D a la izquierda y el formulario a la derecha
export function AuthScreen({ mode }: { mode: "login" | "register" }) {
  const isRegister = mode === "register";

  return (
    <main className="auth-screen">
      <div className="blob blob-a" aria-hidden="true" />
      <div className="blob blob-b" aria-hidden="true" />

      <section className="auth-shell">
        <div className="auth-window">
          <Clay className="auth-clay" />
          <div className="auth-window-copy">
            <span className="eyebrow">Gestión de usuarios</span>
            <h2>Tu comunidad,<br /><span className="accent">de un vistazo</span></h2>
            <p>Tocá las piezas: cada persona encaja en su lugar.</p>
          </div>
        </div>

        <div className="auth-panel">
          <header className="auth-panel-top">
            <Brand title={isRegister ? "Registro" : "Ingreso"} />
            <ThemeSwitch />
          </header>
          <AuthForm
            mode={mode}
            title={isRegister ? "Creá tu cuenta" : "Hola de nuevo"}
            subtitle={isRegister ? "Completá los requisitos para sumarte." : "Ingresá con tu correo o con una de tus redes."}
          />
        </div>
      </section>
    </main>
  );
}
