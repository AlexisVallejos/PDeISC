import { Leaf, Plus } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import BotonTema from './BotonTema'

// Barra translúcida que reemplaza a la lateral en pantallas angostas.
export default function BarraSuperior() {
  const { pathname } = useLocation()

  return (
    <header className="barra-superior">
      <Link to="/" className="marca" aria-label="Mis Tareas, inicio">
        <span className="marca-icono">
          <Leaf size={16} strokeWidth={2.2} />
        </span>
        <span>Mis Tareas</span>
      </Link>
      <div className="barra-superior-acciones">
        <BotonTema />
        {pathname !== '/crear' && (
          <Link to="/crear" className="boton-icono boton-icono-relleno" aria-label="Nueva tarea" title="Nueva tarea">
            <Plus size={19} strokeWidth={2.4} />
          </Link>
        )}
      </div>
    </header>
  )
}
