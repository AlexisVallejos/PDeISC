import Aparecer from './Aparecer'

// Bloque con título dentro de una sección (por ejemplo, Habilidades dentro de Sobre mí).
export default function Subseccion({ titulo, children }) {
  return (
    <div className="subseccion">
      <Aparecer as="h3" className="titulo-subseccion">
        {titulo}
      </Aparecer>
      {children}
    </div>
  )
}
