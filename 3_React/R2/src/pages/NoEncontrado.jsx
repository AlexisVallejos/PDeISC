import { Link } from "react-router-dom";
import { Home } from "lucide-react";

// pagina que se muestra cuando la url no coincide con ninguna ruta
function NoEncontrado() {
  return (
    <div className="pagina-404">
      <p className="codigo">404</p>
      <h1>Esta pagina no existe</h1>
      <p className="text-secondary mb-4">
        Revisa el link o volve al inicio para ver tus tareas.
      </p>
      <Link to="/" className="btn btn-acento d-inline-flex align-items-center gap-2">
        <Home size={18} />
        Volver al inicio
      </Link>
    </div>
  );
}

export default NoEncontrado;
