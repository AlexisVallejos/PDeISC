import { useState } from "react";
import { useOAuthProviders } from "@/hooks/useOAuthProviders";
import { ProviderIcon } from "./ProviderIcon";
import { ProviderSoonDialog } from "./ProviderSoonDialog";
import type { ProviderStatus } from "@/types/oauth";

interface SocialButtonsProps {
  isRegister: boolean;
  busy: boolean;
  onSelect: (providerId: string) => void;
}

// botones para ingresar o crear la cuenta con cada red; las que no están habilitadas se ven apagadas y avisan "próximamente"
export function SocialButtons({ isRegister, busy, onSelect }: SocialButtonsProps) {
  const providers = useOAuthProviders();
  const [soon, setSoon] = useState<ProviderStatus | null>(null);
  const action = isRegister ? "Crear cuenta con" : "Ingresar con";

  function choose(provider: ProviderStatus) {
    if (provider.enabled) onSelect(provider.id);
    else setSoon(provider);
  }

  return (
    <div className="social">
      <div className="social-divider" role="separator">
        <span>{isRegister ? "o registrate con" : "o ingresá con"}</span>
      </div>

      <div className="social-list">
        {providers.map((provider) => (
          <button
            key={provider.id}
            type="button"
            className={provider.enabled ? "social-btn" : "social-btn is-soon"}
            disabled={busy}
            aria-disabled={!provider.enabled}
            title={provider.enabled ? undefined : "Próximamente"}
            aria-label={provider.enabled ? `${action} ${provider.label}` : `${provider.label}: próximamente`}
            onClick={() => choose(provider)}
          >
            <ProviderIcon id={provider.id} />
            {provider.label}
          </button>
        ))}
      </div>

      <ProviderSoonDialog provider={soon} onClose={() => setSoon(null)} />
    </div>
  );
}
