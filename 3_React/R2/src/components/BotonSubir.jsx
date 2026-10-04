import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

// boton flotante que aparece cuando el usuario scrollea para abajo
function BotonSubir() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function manejarScroll() {
      // lo muestro recien despues de scrollear un poco, no desde el arranque
      setVisible(window.scrollY > 300);
    }

    window.addEventListener("scroll", manejarScroll);
    return () => window.removeEventListener("scroll", manejarScroll);
  }, []);

  function subirArriba() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <button
      className={`boton-subir ${visible ? "visible" : ""}`}
      onClick={subirArriba}
      aria-label="Volver arriba"
      title="Volver arriba"
    >
      <ArrowUp size={20} />
    </button>
  );
}

export default BotonSubir;
