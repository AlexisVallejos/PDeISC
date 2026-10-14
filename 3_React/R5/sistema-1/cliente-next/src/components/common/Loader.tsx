import { LoaderCircle } from "lucide-react";

// pantalla de espera mientras se consulta la sesión
export function Loader({ text = "Cargando..." }: { text?: string }) {
  return (
    <div className="loader" role="status">
      <LoaderCircle className="spin" aria-hidden="true" />
      <span>{text}</span>
    </div>
  );
}
