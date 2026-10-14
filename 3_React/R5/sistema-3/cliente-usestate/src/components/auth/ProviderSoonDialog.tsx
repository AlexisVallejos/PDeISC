import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Clock } from "lucide-react";
import { ProviderIcon } from "./ProviderIcon";
import type { ProviderStatus } from "@/types/oauth";

interface ProviderSoonDialogProps {
  provider: ProviderStatus | null;
  onClose: () => void;
}

// aviso para las redes que todavía no están habilitadas; usa <dialog>, que ya trae foco, Escape y fondo
export function ProviderSoonDialog({ provider, onClose }: ProviderSoonDialogProps) {
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (provider && !dialog.current!.open) dialog.current!.showModal();
  }, [provider]);

  // el evento close llega después de cerrar: si mientras tanto se volvió a abrir, no borro nada
  function handleClose() {
    if (!dialog.current!.open) onClose();
  }

  return createPortal(
    <dialog ref={dialog} className="soon-dialog" onClose={handleClose} onClick={(event) => event.target === dialog.current && dialog.current?.close()} aria-labelledby="soon-title">
      {provider && (
        <div className="soon-card">
          <div className="soon-icons">
            <ProviderIcon id={provider.id} />
            <Clock aria-hidden="true" />
          </div>
          <h2 id="soon-title">Próximamente</h2>
          <p>El ingreso con <strong>{provider.label}</strong> todavía no está habilitado en el sistema. Muy pronto vas a poder usarlo.</p>
          <p className="soon-help">Mientras tanto, ingresá con otra opción o con tu correo y contraseña.</p>
          <button type="button" className="soon-close" onClick={() => dialog.current?.close()} autoFocus>Entendido</button>
        </div>
      )}
    </dialog>,
    document.body,
  );
}
