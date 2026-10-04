import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useTareas } from "../context/TareasContext";
import FormularioTarea from "../components/FormularioTarea";

// pagina para crear una tarea nueva
function CrearTarea() {
  const { agregarTarea } = useTareas();
  const navigate = useNavigate();

  function manejarGuardar(datos) {
    const tareaCreada = agregarTarea(datos);
    // despues de crearla, la muestro directamente en su pagina de detalle
    navigate(`/tareas/${tareaCreada.id}`);
  }

  return (
    <div className="contenedor-pagina">
      <div className="encabezado-pagina">
        <div>
          <h1>Nueva tarea</h1>
          <p>Completa los datos para agregarla a tu lista.</p>
        </div>
        <Link
          to="/"
          className="btn btn-outline-acento d-inline-flex align-items-center gap-2 enlace-volver"
        >
          <ArrowLeft size={16} />
          Volver a mis tareas
        </Link>
      </div>

      <div className="tarjeta-formulario">
        <FormularioTarea
          onGuardar={manejarGuardar}
          textoBoton="Crear tarea"
          mostrarEstado={false}
        />
      </div>
    </div>
  );
}

export default CrearTarea;
