import { ChevronLeft } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

// Botón "‹ Mis tareas" de la barra de navegación de iOS. Si se llegó desde un
// filtro, vuelve a ese mismo filtro.
export default function EnlaceVolver({ texto = 'Mis tareas' }) {
  const { state } = useLocation()
  const destino = state?.desde || '/'

  return (
    <Link to={destino} className="enlace-volver">
      <ChevronLeft size={22} strokeWidth={2.6} aria-hidden="true" />
      <span>{texto}</span>
    </Link>
  )
}
