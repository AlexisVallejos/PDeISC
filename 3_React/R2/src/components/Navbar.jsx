import { Link, useLocation } from "react-router-dom";
import { CheckCircle2, Circle, ClipboardList, Leaf, Plus } from "lucide-react";
import { useTareas } from "../context/TareasContext";
import BotonTema from "./BotonTema";

// arma el filtro elegido desde la direccion actual
function obtenerFiltro(search) {
  return new URLSearchParams(search).get("estado") || "todas";
}

// muestra la navegacion de tareas y los totales guardados
function Navbar() {
  const { tareas } = useTareas();
  const location = useLocation();
  const filtroActual = obtenerFiltro(location.search);
  const pendientes = tareas.filter((tarea) => !tarea.completada).length;
  const completas = tareas.length - pendientes;
  const filtros = [
    { id: "todas", texto: "Todas", cantidad: tareas.length, Icono: ClipboardList },
    { id: "pendientes", texto: "Pendientes", cantidad: pendientes, Icono: Circle },
    { id: "completadas", texto: "Completadas", cantidad: completas, Icono: CheckCircle2 },
  ];

  return (
    <aside className="barra-lateral" aria-label="Navegación principal">
      <Link to="/" className="marca" aria-label="Mis tareas, inicio">
        <span className="marca-icono"><Leaf size={20} strokeWidth={2.2} /></span>
        <span>Mis Tareas</span>
      </Link>

      <div className="navegacion-grupo">
        <p className="etiqueta-navegacion">TU ESPACIO</p>
        <nav className="lista-navegacion">
          {filtros.map(({ id, texto, cantidad, Icono }) => (
            <Link
              key={id}
              to={`/?estado=${id}`}
              className={`enlace-navegacion ${location.pathname === "/" && filtroActual === id ? "activo" : ""}`}
              aria-current={location.pathname === "/" && filtroActual === id ? "page" : undefined}
            >
              <Icono size={18} strokeWidth={1.8} />
              <span>{texto}</span>
              <span className="contador-navegacion">{cantidad}</span>
            </Link>
          ))}
        </nav>
      </div>

      <div className="bloque-lateral-inferior">
        <Link to="/crear" className="boton-crear-lateral">
          <Plus size={17} />
          <span>Nueva tarea</span>
        </Link>
        <p className="nota-lateral">“Pequeños pasos también avanzan.”</p>
        <div className="controles-laterales">
          <span className="texto-tema">Apariencia</span>
          <BotonTema />
        </div>
      </div>
    </aside>
  );
}

export default Navbar;
