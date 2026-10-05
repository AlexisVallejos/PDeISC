import { ArrowUpRight, Github } from 'lucide-react'
import { useMemo, useState } from 'react'
import Aparecer from './Aparecer'
import Seccion from './Seccion'

const TODAS = 'Todos'

export default function Proyectos({ proyectos }) {
  const [filtro, setFiltro] = useState(TODAS)

  // Las tecnologías más usadas primero, para que el filtro muestre lo relevante.
  const tecnologias = useMemo(() => {
    const cuenta = new Map()
    proyectos.forEach((p) => p.tecnologias.forEach((t) => cuenta.set(t, (cuenta.get(t) ?? 0) + 1)))
    return [TODAS, ...[...cuenta].sort((a, b) => b[1] - a[1]).slice(0, 6).map(([t]) => t)]
  }, [proyectos])

  const visibles = filtro === TODAS ? proyectos : proyectos.filter((p) => p.tecnologias.includes(filtro))

  return (
    <Seccion id="proyectos" sobretitulo="Proyectos" titulo="Cosas que hice.">
      <Aparecer className="filtros" role="group" aria-label="Filtrar por tecnología">
        {tecnologias.map((t) => (
          <button
            key={t}
            type="button"
            className={filtro === t ? 'filtro es-activo' : 'filtro'}
            aria-pressed={filtro === t}
            onClick={() => setFiltro(t)}
          >
            {t}
          </button>
        ))}
      </Aparecer>

      <div className="grilla-proyectos" aria-live="polite">
        {visibles.map((p, i) => (
          <TarjetaProyecto key={p.titulo} proyecto={p} orden={i} />
        ))}
      </div>
    </Seccion>
  )
}

function TarjetaProyecto({ proyecto, orden }) {
  // Un brillo sigue al puntero sobre la tarjeta (solo con mouse; ver CSS).
  function alMoverPuntero(evento) {
    const caja = evento.currentTarget.getBoundingClientRect()
    evento.currentTarget.style.setProperty('--x', `${evento.clientX - caja.left}px`)
    evento.currentTarget.style.setProperty('--y', `${evento.clientY - caja.top}px`)
  }

  const enlacePrincipal = proyecto.demo || proyecto.repo

  return (
    <Aparecer as="article" orden={orden} className="tarjeta proyecto" onPointerMove={alMoverPuntero}>
      <div className="proyecto-portada" aria-hidden="true">
        <span>{proyecto.titulo.slice(0, 1)}</span>
      </div>
      <h3 className="tarjeta-titulo">
        {enlacePrincipal ? (
          <a href={enlacePrincipal} target="_blank" rel="noreferrer" className="proyecto-enlace-principal">
            {proyecto.titulo}
          </a>
        ) : (
          proyecto.titulo
        )}
      </h3>
      <p className="texto-secundario">{proyecto.descripcion}</p>
      <ul className="etiquetas" aria-label="Tecnologías">
        {proyecto.tecnologias.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
      <div className="proyecto-acciones">
        {proyecto.repo && (
          <a href={proyecto.repo} target="_blank" rel="noreferrer">
            <Github size={15} aria-hidden="true" /> Código
          </a>
        )}
        {proyecto.demo && (
          <a href={proyecto.demo} target="_blank" rel="noreferrer">
            Ver demo <ArrowUpRight size={15} aria-hidden="true" />
          </a>
        )}
      </div>
    </Aparecer>
  )
}
