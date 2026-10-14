"use client";

import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, LogOut } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import GooeyNav from "@/components/reactbits/GooeyNav";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useLogout } from "@/hooks/useLogout";
import { initials } from "@/utils/initials";
import { Brand } from "./Brand";
import { ThemeSwitch } from "./ThemeSwitch";

// barra de vidrio flotante: marca, navegación «gooey», tema y menú de cuenta
export function PanelShell({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { theme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const logout = useLogout();
  const [menuOpen, setMenuOpen] = useState(false);
  const account = useRef<HTMLDivElement>(null);

  // el menú se cierra al tocar afuera
  useEffect(() => {
    if (!menuOpen) return;
    const close = (event: PointerEvent) => { if (!account.current?.contains(event.target as Node)) setMenuOpen(false); };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [menuOpen]);

  const links = [
    ...(user?.rol === "administrador" ? [{ href: "/usuarios", label: "Directorio" }] : []),
    { href: "/perfil", label: "Mi perfil" },
  ];
  const active = Math.max(0, links.findIndex((link) => link.href === pathname));

  return (
    <div className="panel">
      <header className="glassbar">
        <Brand title={pathname === "/perfil" ? "Mi perfil" : "Usuarios"} />

        <GooeyNav
          key={links.length}
          items={links.map(({ label }) => ({ label }))}
          activeIndex={active}
          onChange={(index) => router.push(links[index].href)}
          theme={theme}
          color="#2f55f4"
          activeTextColor="#ffffff"
          colors={["#2f55f4", "#8fb1ff", "#ffb38a", "#c7c9ff"]}
          className="gooey"
        />

        <div className="glassbar-end">
          <ThemeSwitch />
          <div className="account" ref={account}>
            <button type="button" className="account-btn" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-haspopup="menu" aria-label="Cuenta">
              <span className="avatar avatar-sm">{initials(user?.nombre)}</span>
              <ChevronDown aria-hidden="true" />
            </button>
            {menuOpen && (
              <div className="account-menu" role="menu" onKeyDown={(event) => event.key === "Escape" && setMenuOpen(false)}>
                <p><strong>{user?.nombre}</strong><span>{user?.email}</span></p>
                <button type="button" role="menuitem" onClick={() => { setMenuOpen(false); logout.ask(); }} autoFocus>
                  <LogOut aria-hidden="true" /> Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {children}

      <ConfirmDialog open={logout.asking} title="¿Cerrar sesión?" text="Vas a volver a la pantalla de ingreso." confirmLabel="Salir" onConfirm={logout.confirm} onCancel={logout.cancel} />
    </div>
  );
}
