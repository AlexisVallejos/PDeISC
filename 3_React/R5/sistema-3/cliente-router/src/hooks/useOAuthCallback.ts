import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
  const [params] = useSearchParams();
  const { oauthLogin } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const started = useRef(false);
  const label = findProvider(providerId)?.label;

  useEffect(() => {
    if (started.current) return; // el código de autorización sirve una sola vez
    started.current = true;

    const code = params.get("code");
    const state = params.get("state");
    if (!code || !state || params.get("error")) { setError(returnError(params, label)); return; }

    oauthLogin({ provider: providerId, code, state })
      .then((user) => navigate(homePath(user), { replace: true }))
      .catch((requestError) => setError(getMessage(requestError)));
  }, []);

  return { label, error };
}
