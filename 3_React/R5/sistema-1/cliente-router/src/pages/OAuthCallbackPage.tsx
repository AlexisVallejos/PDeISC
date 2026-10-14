import { LoaderCircle, TriangleAlert } from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";
import { AuthBrand } from "@/components/auth/AuthBrand";
import { useOAuthCallback } from "@/hooks/useOAuthCallback";
import { findProvider } from "@/utils/oauthProviders";

// pantalla a la que vuelve cualquiera de las redes: procesa el ingreso y redirige
export default function OAuthCallbackPage() {
  const { provider } = useParams();
  if (!findProvider(provider)) return <Navigate to="/ingresar" replace />;

  return <CallbackStatus provider={provider as string} />;
}

function CallbackStatus({ provider }: { provider: string }) {
  const { label, error } = useOAuthCallback(provider);

  return (
    <section className="oauth-status">
      <div className="oauth-card card" role="status" aria-live="polite">
        <AuthBrand />
        {error ? <TriangleAlert className="oauth-icon oauth-icon-error" /> : <LoaderCircle className="oauth-icon oauth-spin" />}
        <h1>{error ? "No pudimos ingresar" : `Ingresando con ${label}`}</h1>
        <p>{error || "Estamos verificando tu cuenta, un momento..."}</p>
        {error && <Link to="/ingresar" className="oauth-back">Volver a ingresar</Link>}
      </div>
    </section>
  );
}
