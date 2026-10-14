"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

// salir pide confirmación y vuelve a la pantalla de ingreso
export function useLogout() {
  const { logout } = useAuth();
  const router = useRouter();
  const [asking, setAsking] = useState(false);

  async function confirm() {
    setAsking(false);
    await logout().catch(() => undefined);
    router.replace("/ingresar");
  }

  return { asking, ask: () => setAsking(true), cancel: () => setAsking(false), confirm };
}
