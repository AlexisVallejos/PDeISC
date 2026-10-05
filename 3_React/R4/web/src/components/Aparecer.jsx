import { useAparecer } from '../hooks/useAparecer'

// Envuelve contenido que entra con un fundido y un leve ascenso al llegar a la pantalla.
// `orden` escalona elementos hermanos (60 ms entre cada uno).
export default function Aparecer({ as: Etiqueta = 'div', orden = 0, className = '', children, ...resto }) {
  const [ref, visible] = useAparecer()

  return (
    <Etiqueta
      ref={ref}
      className={`aparecer ${visible ? 'es-visible' : ''} ${className}`}
      style={{ '--retardo': `${Math.min(orden, 8) * 60}ms` }}
      {...resto}
    >
      {children}
    </Etiqueta>
  )
}
