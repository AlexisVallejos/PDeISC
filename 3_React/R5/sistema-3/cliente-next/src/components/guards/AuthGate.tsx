"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Loader } from "@/components/common/Loader";
import { homePath } from "@/utils/homePath";

interface AuthGateProps {
  children: ReactNode;
  // "guest": solo sin sesión (ingresar / registro); "user": con sesión; "admin": solo administradores
  need: "guest" | "user" | "admin";
}

// guarda de rutas del lado del cliente; el rol real lo confirma la API
export function AuthGate({ children, need }: AuthGateProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const target = loading ? null
    : need === "guest" ? (user ? homePath(user) : null)
    : !user ? "/ingresar"
    : need === "admin" && user.rol !== "administrador" ? homePath(user)
    : null;

  useEffect(() => {
    if (target && target !== pathname) router.replace(target);
  }, [target, pathname, router]);

  // el formulario de ingreso se muestra enseguida; el panel espera a conocer la sesión
  if (need === "guest") return target ? null : <>{children}</>;
  if (loading || target) return <Loader text="Verificando la sesión..." />;
  return <>{children}</>;
}
