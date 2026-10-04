import { CheckCircle2, Circle } from "lucide-react";

// muestra un badge visual segun si la tarea esta completa o no
// lo separo en su propio componente porque se usa en la tarjeta y en el detalle
function EstadoTarea({ completada }) {
  return (
    <span
      className={`badge-estado ${completada ? "completada" : "pendiente"}`}
    >
      {completada ? <CheckCircle2 size={14} /> : <Circle size={14} />}
      {completada ? "Completa" : "Incompleta"}
    </span>
  );
}

export default EstadoTarea;
