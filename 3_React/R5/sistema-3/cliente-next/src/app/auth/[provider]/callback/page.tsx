import { Suspense } from "react";
import { redirect } from "next/navigation";
import { CallbackScreen } from "@/components/atelier/CallbackScreen";
import { findProvider } from "@/utils/oauthProviders";

// la API redirige acá con ?code y ?state; un proveedor desconocido vuelve al ingreso
export default async function OAuthCallbackPage({ params }: PageProps<"/auth/[provider]/callback">) {
  const { provider } = await params;
  const known = findProvider(provider);
  if (!known) redirect("/ingresar");

  return (
    <Suspense>
      <CallbackScreen provider={known.id} />
    </Suspense>
  );
}
