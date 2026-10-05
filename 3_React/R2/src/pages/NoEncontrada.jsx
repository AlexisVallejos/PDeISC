import { House } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTituloPagina } from '../hooks/useTituloPagina'

export default function NoEncontrada() {
  useTituloPagina('Página no encontrada')

  return (
    <div className="pagina pagina-404">
      <p className="codigo">404</p>
      <h1 className="titulo-mediano">Esta página no existe</h1>
      <p className="subtitulo">Revisá el link o volvé al inicio para ver tus tareas.</p>
      <Link to="/" className="boton boton-relleno">
        <House size={17} strokeWidth={2.2} />
        <span>Volver al inicio</span>
      </Link>
    </div>
  )
}
