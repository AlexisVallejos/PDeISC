"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import type { ReactNode } from "react";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { useAuth } from "@/context/AuthContext";
import { useLogout } from "@/hooks/useLogout";
import { Masthead } from "./Masthead";

// cabecera de revista con secciones en texto; el subrayado coral se desliza entre ellas
export function PanelShell({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const pathname = usePathname();
  const logout = useLogout();

  const links = [
    ...(user?.rol === "administrador" ? [{ href: "/usuarios", label: "Personas" }] : []),
    { href: "/perfil", label: "Mi perfil" },
  ];

  return (
    <div className="panel">
      <header className="masthead-bar">
        <div className="masthead-left">
          <span className="kicker">B · Estudio editorial</span>
          <Link href="/" aria-label="Estudio, inicio"><Masthead /></Link>
        </div>
        <nav className="sections" aria-label="Secciones">
          {links.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <Link key={href} href={href} className={active ? "section is-active" : "section"} aria-current={active ? "page" : undefined}>
                {label}
                {active && <motion.span layoutId="section-rule" className="section-rule" transition={{ type: "spring", bounce: 0, duration: 0.45 }} />}
              </Link>
            );
          })}
          <button type="button" className="section" onClick={logout.ask}>Salir</button>
          <ThemeToggle />
        </nav>
      </header>

      {children}

      <ConfirmDialog open={logout.asking} title="¿Cerrar sesión?" text="Vas a volver a la portada de ingreso." confirmLabel="Salir" onConfirm={logout.confirm} onCancel={logout.cancel} />
    </div>
  );
}
