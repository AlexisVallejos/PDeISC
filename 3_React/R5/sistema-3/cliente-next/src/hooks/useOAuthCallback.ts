"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getMessage } from "@/services/api";
import { findProvider } from "@/utils/oauthProviders";
import { homePath } from "@/utils/homePath";

// mensaje cuando el proveedor nos devuelve sin código (por ejemplo, la persona canceló)
function returnError(params: URLSearchParams, label: string | undefined): string {
  if (params.get("error") === "access_denied") return `Cancelaste el ingreso con ${label}.`;
  return `${label} no completó el ingreso. Probá de nuevo.`;
}

// al volver del proveedor: toma code y state de la URL, los manda a la API y abre la sesión
export function useOAuthCallback(providerId: string) {
  const params = useSearchParams();
  const { oauthLogin } = useAuth();
  const router = useRouter();
  const [error, setError] = useState("");
  const started = useRef(false);
  const label = findProvider(providerId)?.label;

  useEffect(() => {
    if (started.current) return; // el código de autorización sirve una sola vez
    started.current = true;

    const query = new URLSearchParams(params.toString());
    const code = query.get("code");
    const state = query.get("state");
    if (!code || !state || query.get("error")) { setError(returnError(query, label)); return; }

    oauthLogin({ provider: providerId, code, state })
      .then((user) => router.replace(homePath(user)))
      .catch((requestError) => setError(getMessage(requestError)));
  }, []);

  return { label, error };
}
