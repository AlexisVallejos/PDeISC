import { Sun, Moon } from "lucide-react";
import { useTema } from "../context/TemaContext";

// boton chiquito que cambia el tema y guarda la preferencia
function BotonTema() {
  const { tema, cambiarTema } = useTema();

  return (
    <button
      className="boton-tema"
      onClick={cambiarTema}
      title={tema === "claro" ? "Activar modo oscuro" : "Activar modo claro"}
      aria-label="Cambiar tema"
    >
      {tema === "claro" ? <Moon size={18} /> : <Sun size={18} />}
    </button>
  );
}

export default BotonTema;
