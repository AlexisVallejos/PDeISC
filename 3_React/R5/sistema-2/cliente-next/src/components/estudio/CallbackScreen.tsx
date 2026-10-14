"use client";

import Link from "next/link";
import { LoaderCircle, TriangleAlert } from "lucide-react";
import { ProviderIcon } from "@/components/auth/ProviderIcon";
import { useOAuthCallback } from "@/hooks/useOAuthCallback";
import { Masthead } from "./Masthead";
import { PaperCollage } from "./PaperCollage";
import type { ProviderId } from "@/types/oauth";

// a esta pantalla vuelve cualquiera de las redes: canjea el código y redirige
export function CallbackScreen({ provider }: { provider: ProviderId }) {
  const { label, error } = useOAuthCallback(provider);

  return (
    <main className="callback-screen">
      <PaperCollage className="callback-collage" />
      <article className="callback-card" role="status" aria-live="polite">
        <Masthead />
        <div className="callback-icons">
          <ProviderIcon id={provider} className="callback-provider" />
          {error ? <TriangleAlert className="callback-state is-error" aria-hidden="true" /> : <LoaderCircle className="callback-state spin" aria-hidden="true" />}
        </div>
        <h1>{error ? "No pudimos ingresar" : <>Ingresando con <em>{label}</em></>}</h1>
        <p>{error || "Estamos verificando tu cuenta, un momento..."}</p>
        {error && <Link href="/ingresar" className="btn btn-primary">Volver a ingresar</Link>}
      </article>
    </main>
  );
}
