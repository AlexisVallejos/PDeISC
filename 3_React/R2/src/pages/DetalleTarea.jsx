import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { CalendarDays, ArrowLeft, Check, Circle, Pencil, Trash2 } from "lucide-react";
import { useTareas } from "../context/TareasContext";
import FormularioTarea from "../components/FormularioTarea";
import ModalEliminar from "../components/ModalEliminar";

// pagina de detalle, busca la tarea real usando el id de la url
function DetalleTarea() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { buscarTarea, editarTarea, eliminarTarea, cambiarEstadoTarea } =
    useTareas();

  const [modoEdicion, setModoEdicion] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);

  const tarea = buscarTarea(id);

  // si no existe una tarea con ese id, no rompo la app, muestro un mensaje
  if (!tarea) {
    return (
      <div className="estado-vacio contenedor-pagina">
        <h3>No encontramos esa tarea</h3>
        <p>Puede que ya haya sido eliminada o que el link este mal.</p>
        <Link to="/" className="btn btn-acento">
          Volver al inicio
        </Link>
      </div>
    );
  }

  function guardarEdicion(datosNuevos) {
    editarTarea(tarea.id, datosNuevos);
    setModoEdicion(false);
  }

  function confirmarEliminar() {
    eliminarTarea(tarea.id);
    navigate("/");
  }

  // si estoy editando, muestro el formulario reutilizable ya cargado con los datos
  if (modoEdicion) {
    return (
      <div className="contenedor-pagina">
        <div className="encabezado-pagina">
          <h1>Editar tarea</h1>
        </div>
        <div className="tarjeta-formulario">
          <FormularioTarea
            valoresIniciales={tarea}
            onGuardar={guardarEdicion}
            textoBoton="Guardar cambios"
          />
          <button
            className="btn btn-outline-acento w-100 mt-2"
            onClick={() => setModoEdicion(false)}
          >
            Cancelar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="contenedor-pagina">
      <Link to="/" className="enlace-volver">
        <ArrowLeft size={16} />
        Volver al inicio
      </Link>

      <div className="tarjeta-detalle">
        <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-3">
          <h1 className="mb-0">{tarea.titulo}</h1>
          <button
            type="button"
            className={`boton-estado ${tarea.completada ? "completada" : "pendiente"}`}
            onClick={() => cambiarEstadoTarea(tarea.id, !tarea.completada)}
            aria-pressed={tarea.completada}
            aria-label={tarea.completada ? "Volver incompleta" : "Marcar como completa"}
          >
            {tarea.completada ? <Check size={14} /> : <Circle size={14} />}
            {tarea.completada ? "Completa" : "Incompleta"}
          </button>
        </div>

        <p className="d-flex align-items-center gap-2 text-secondary mb-3">
          <CalendarDays size={16} />
          Creada el {tarea.fechaCreacion}
        </p>

        <p className="descripcion-completa">{tarea.descripcion}</p>

        <div className="acciones-detalle">
          <button
            className="btn btn-outline-acento d-flex align-items-center gap-2"
            onClick={() => setModoEdicion(true)}
          >
            <Pencil size={16} />
            Editar
          </button>

          <button
            className="btn btn-peligro-suave d-flex align-items-center gap-2"
            onClick={() => setMostrarModal(true)}
          >
            <Trash2 size={16} />
            Eliminar
          </button>
        </div>
      </div>

      {mostrarModal && (
        <ModalEliminar
          titulo={tarea.titulo}
          onConfirmar={confirmarEliminar}
          onCancelar={() => setMostrarModal(false)}
        />
      )}
    </div>
  );
}

export default DetalleTarea;
