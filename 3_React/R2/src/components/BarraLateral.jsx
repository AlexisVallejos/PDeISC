import { CircleCheck, Circle, ClipboardList, Leaf, Plus } from 'lucide-react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useTareas } from '../context/TareasContext'
import { leerFiltro } from '../utils/filtros'
import BotonTema from './BotonTema'

// Las tres listas se muestran como las "listas inteligentes" de Recordatorios:
// un mosaico con ícono de color, el número grande y el nombre debajo.
export default function BarraLateral() {
  const { tareas } = useTareas()
  const { pathname, search } = useLocation()
  const filtroActual = leerFiltro(new URLSearchParams(search))
  const pendientes = tareas.filter((tarea) => !tarea.completada).length

  const listas = [
    { id: 'todas', texto: 'Todas', cantidad: tareas.length, Icono: ClipboardList },
    { id: 'pendientes', texto: 'Pendientes', cantidad: pendientes, Icono: Circle },
    { id: 'completadas', texto: 'Completadas', cantidad: tareas.length - pendientes, Icono: CircleCheck },
  ]

  return (
    <aside className="barra-lateral" aria-label="Navegación principal">
      <Link to="/" className="marca" aria-label="Mis Tareas, inicio">
        <span className="marca-icono">
          <Leaf size={18} strokeWidth={2.2} />
        </span>
        <span>Mis Tareas</span>
      </Link>

      <nav className="listas-inteligentes" aria-label="Listas">
        {listas.map(({ id, texto, cantidad, Icono }) => {
          const activa = pathname === '/' && filtroActual === id
          return (
            <NavLink
              key={id}
              to={`/?estado=${id}`}
              className={`lista-inteligente lista-${id} ${activa ? 'activa' : ''}`}
              aria-current={activa ? 'page' : undefined}
            >
              <span className="lista-icono">
                <Icono size={16} strokeWidth={2.4} />
              </span>
              <span className="lista-cantidad">{cantidad}</span>
              <span className="lista-nombre">{texto}</span>
            </NavLink>
          )
        })}
      </nav>

      <div className="bloque-lateral-inferior">
        <Link to="/crear" className="boton boton-relleno boton-ancho">
          <Plus size={17} strokeWidth={2.4} />
          <span>Nueva tarea</span>
        </Link>
        <p className="nota-lateral">“Pequeños pasos también avanzan.”</p>
        <div className="controles-laterales">
          <span>Apariencia</span>
          <BotonTema />
        </div>
      </div>
    </aside>
  )
}
