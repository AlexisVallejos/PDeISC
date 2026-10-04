import { RotateCcw } from "lucide-react";

// Presento la acción para reiniciar el tablero.
export default function Controles({ onReset }) {
  return (
    <button className="reset" type="button" onClick={onReset}>
      <RotateCcw /> Reiniciar partida
    </button>
  );
}
