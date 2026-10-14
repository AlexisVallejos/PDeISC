import { useEffect, useRef, useState } from "react";
import { AuthBrand } from "@/components/auth/AuthBrand";
import { useAuth } from "@/context/AuthContext";
import { getMessage } from "@/services/api";
import { findProvider } from "@/utils/oauthProviders";

export default function OAuthCallbackPage({ provider }: { provider: string }) {
  const { oauthLogin } = useAuth();
  const [error, setError] = useState("");
  const started = useRef(false);
  const label = findProvider(provider)?.label;

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const state = params.get("state");
    if (!label || !code || !state || params.has("error")) {
      setError(params.get("error") === "access_denied" ? `Cancelaste el ingreso con ${label || "esta red"}.` : "No se pudo completar el ingreso.");
      return;
    }
    oauthLogin({ provider, code, state })
      .then(() => window.location.replace("/"))
      .catch((requestError) => setError(getMessage(requestError)));
  }, [provider, label]);

  return <main className="auth-main"><section className="oauth-status"><div className="oauth-card card" role="status" aria-live="polite">
    <AuthBrand />
    <h1>{error ? "No pudimos ingresar" : `Ingresando con ${label || "tu cuenta"}`}</h1>
    <p>{error || "Estamos verificando tu cuenta, un momento..."}</p>
    {error && <a href="/" className="oauth-back">Volver a ingresar</a>}
  </div></section></main>;
}
