import { useEffect, useState } from "react";
import { oauthProvidersRequest } from "@/services/authService";
import { oauthProviders } from "@/utils/oauthProviders";
import type { ProviderStatus } from "@/types/oauth";

// las redes con su estado ({ id, label, enabled }); mientras carga o si falla, se muestran todas habilitadas
// (si alguna no estuviera configurada, la API lo avisa al tocarla)
export function useOAuthProviders(): ProviderStatus[] {
  const [enabledById, setEnabledById] = useState<Record<string, boolean> | null>(null);

  useEffect(() => {
    oauthProvidersRequest()
      .then((list) => setEnabledById(Object.fromEntries(list.map((item) => [item.id, item.enabled]))))
      .catch(() => setEnabledById(null));
  }, []);

  return oauthProviders.map((provider) => ({ ...provider, enabled: enabledById ? enabledById[provider.id] === true : true }));
}
