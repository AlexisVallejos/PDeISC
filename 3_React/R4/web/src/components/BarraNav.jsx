import { useSeccionActiva } from '../hooks/useSeccionActiva'

export const SECCIONES = [
  { id: 'proyectos', texto: 'Proyectos' },
  { id: 'sobre-mi', texto: 'Sobre mí' },
  { id: 'contacto', texto: 'Contacto' },
]
const IDS = SECCIONES.map((s) => s.id)

export default function BarraNav({ nombre }) {
  const activa = useSeccionActiva(IDS)

  return (
    <header className="barra">
      <nav className="barra-interior" aria-label="Secciones">
        <a className="barra-marca" href="#inicio">
          {nombre}
        </a>
        <ul className="barra-enlaces">
          {SECCIONES.map(({ id, texto }) => (
            <li key={id}>
              <a
                href={`#${id}`}
                className={activa === id ? 'es-activa' : ''}
                aria-current={activa === id ? 'true' : undefined}
              >
                {texto}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
