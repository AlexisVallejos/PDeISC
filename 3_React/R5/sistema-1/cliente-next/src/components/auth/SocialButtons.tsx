"use client";

import { useState } from "react";
import { Clock } from "lucide-react";
import { useOAuthProviders } from "@/hooks/useOAuthProviders";
import { Modal } from "@/components/common/Modal";
import { ProviderIcon } from "./ProviderIcon";
import type { ProviderStatus } from "@/types/oauth";

interface SocialButtonsProps {
  isRegister: boolean;
  busy: boolean;
  onSelect: (providerId: string) => void;
}

// una red por botón; las que no tienen credenciales en la API se ven apagadas y avisan «próximamente»
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
            title={provider.enabled ? `${action} ${provider.label}` : "Próximamente"}
            aria-label={provider.enabled ? `${action} ${provider.label}` : `${provider.label}: próximamente`}
            onClick={() => choose(provider)}
          >
            <ProviderIcon id={provider.id} />
            <span>{provider.label}</span>
          </button>
        ))}
      </div>

      <Modal
        open={!!soon}
        onClose={() => setSoon(null)}
        title="Próximamente"
        className="soon"
        description={soon && <>El ingreso con <strong>{soon.label}</strong> todavía no está habilitado. Mientras tanto, usá otra red o tu correo y contraseña.</>}
        footer={<button type="button" className="btn btn-primary" onClick={() => setSoon(null)} autoFocus>Entendido</button>}
      >
        {soon && (
          <div className="soon-icons" aria-hidden="true">
            <ProviderIcon id={soon.id} />
            <Clock />
          </div>
        )}
      </Modal>
    </div>
  );
}
