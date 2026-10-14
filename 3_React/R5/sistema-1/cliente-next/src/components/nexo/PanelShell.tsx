"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { LogOut, UserRound, UsersRound } from "lucide-react";
import type { ReactNode } from "react";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { useAuth } from "@/context/AuthContext";
import { useLogout } from "@/hooks/useLogout";
import { initials } from "@/utils/initials";
import { Globe } from "./Globe";
import { NexoMark } from "./NexoMark";

// el layout persiste entre rutas: el globo 3D no se vuelve a montar al pasar de Usuarios a Mi perfil
export function PanelShell({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const pathname = usePathname();
  const logout = useLogout();

  const links = [
    ...(user?.rol === "administrador" ? [{ href: "/usuarios", label: "Usuarios", icon: UsersRound }] : []),
    { href: "/perfil", label: "Mi perfil", icon: UserRound },
  ];

  return (
    <div className="panel">
      <Globe className="panel-globe" />

      <header className="topbar">
        <Link href="/" className="brand" aria-label="NEXO, inicio">
          <NexoMark className="brand-mark" />
          <span>Gestión de personas</span>
        </Link>

        <nav className="tabs" aria-label="Secciones">
          {links.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link key={href} href={href} className={active ? "tab is-active" : "tab"} aria-current={active ? "page" : undefined}>
                {active && <motion.span layoutId="tab-pill" className="tab-pill" transition={{ type: "spring", bounce: 0, duration: 0.4 }} />}
                <Icon aria-hidden="true" />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="topbar-actions">
          <ThemeToggle />
          <span className="avatar avatar-sm" title={user?.nombre}>{initials(user?.nombre)}</span>
          <button type="button" className="icon-btn" onClick={logout.ask} aria-label="Cerrar sesión">
            <LogOut aria-hidden="true" />
          </button>
        </div>
      </header>

      {children}

      <ConfirmDialog open={logout.asking} title="¿Cerrar sesión?" text="Vas a volver a la pantalla de ingreso." confirmLabel="Salir" onConfirm={logout.confirm} onCancel={logout.cancel} />
    </div>
  );
}
