import { RotateCcw } from "lucide-react";

export default function Controles({ onReset }) {
  return (
    <button className="reset" type="button" onClick={onReset}>
      <RotateCcw /> Reiniciar partida
    </button>
  );
}
