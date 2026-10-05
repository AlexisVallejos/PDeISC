import { CalendarDays, ChevronRight } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { useTareas } from '../context/TareasContext'
import CasillaCompletar from './CasillaCompletar'

export default function FilaTarea({ tarea }) {
  const { cambiarEstadoTarea } = useTareas()
  const { search } = useLocation()

  return (
    <li className={`fila-tarea ${tarea.completada ? 'fila-completada' : ''}`}>
      <CasillaCompletar
        completada={tarea.completada}
        titulo={tarea.titulo}
        onCambiar={() => cambiarEstadoTarea(tarea.id, !tarea.completada)}
      />
      <Link to={`/tareas/${tarea.id}`} state={{ desde: `/${search}` }} className="contenido-fila-tarea">
        <span className="titulo-tarea">{tarea.titulo}</span>
        <span className="descripcion-corta">{tarea.descripcion}</span>
        <span className="meta-fila">
          <span className={`pildora-estado ${tarea.completada ? 'pildora-hecha' : 'pildora-pendiente'}`}>
            {tarea.completada ? 'Completa' : 'Pendiente'}
          </span>
          <span className="fecha-fila">
            <CalendarDays size={13} strokeWidth={2} aria-hidden="true" />
            <span>{tarea.fechaCreacion}</span>
          </span>
        </span>
        <ChevronRight className="chevron-fila" size={18} strokeWidth={2.4} aria-hidden="true" />
      </Link>
    </li>
  )
}
