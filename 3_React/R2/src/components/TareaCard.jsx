import { Link } from "react-router-dom";
import { CalendarDays, Check, Circle, MoreHorizontal } from "lucide-react";
import { useTareas } from "../context/TareasContext";

// muestra una tarea como fila y permite cambiar su estado al instante
function TareaCard({ tarea }) {
  const { cambiarEstadoTarea } = useTareas();

  // actualiza la tarea sin abrir su página de detalle
  function alternarEstado() {
    cambiarEstadoTarea(tarea.id, !tarea.completada);
  }

  return (
    <article className={`fila-tarea ${tarea.completada ? "fila-completada" : ""}`}>
      <button
        type="button"
        className={`control-completar ${tarea.completada ? "marcado" : ""}`}
        onClick={alternarEstado}
        aria-label={`${tarea.completada ? "Volver incompleta" : "Marcar como completa"}: ${tarea.titulo}`}
        aria-pressed={tarea.completada}
      >
        {tarea.completada ? <Check size={15} strokeWidth={2.5} /> : <Circle size={23} strokeWidth={1.35} />}
      </button>

      <Link to={`/tareas/${tarea.id}`} className="contenido-fila-tarea">
        <span className="titulo-tarea">{tarea.titulo}</span>
        <span className="descripcion-corta">{tarea.descripcion}</span>
      </Link>

      <span className={`estado-fila ${tarea.completada ? "estado-hecho" : "estado-pendiente"}`}>
        {tarea.completada ? "Completa" : "Pendiente"}
      </span>

      <span className="fecha-fila">
        <CalendarDays size={15} strokeWidth={1.7} />
        <span>{tarea.fechaCreacion}</span>
      </span>

      <Link to={`/tareas/${tarea.id}`} className="boton-detalle-fila" aria-label={`Ver detalles: ${tarea.titulo}`}>
        <MoreHorizontal size={19} />
      </Link>
    </article>
  );
}

export default TareaCard;
