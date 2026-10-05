import { useMemo } from 'react'
import Aparecer from './Aparecer'
import Subseccion from './Subseccion'

export default function Habilidades({ habilidades }) {
  // Agrupo por categoría respetando el orden en que vienen de la base.
  const grupos = useMemo(() => {
    const mapa = new Map()
    for (const h of habilidades) {
      if (!mapa.has(h.categoria)) mapa.set(h.categoria, [])
      mapa.get(h.categoria).push(h)
    }
    return [...mapa]
  }, [habilidades])

  return (
    <Subseccion titulo="Habilidades">
      <div className="grilla-habilidades">
        {grupos.map(([categoria, lista], i) => (
          <Aparecer key={categoria} orden={i} className="tarjeta tarjeta-habilidades">
            <h3 className="tarjeta-titulo">{categoria}</h3>
            <ul className="lista-habilidades">
              {lista.map((h, j) => (
                <li key={h.nombre} style={{ '--nivel': h.nivel / 100, '--retardo-barra': `${120 + j * 60}ms` }}>
                  <div className="habilidad-fila">
                    <span>{h.nombre}</span>
                    <span className="habilidad-nivel">{h.nivel}%</span>
                  </div>
                  <div
                    className="barra-nivel"
                    role="meter"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={h.nivel}
                    aria-label={h.nombre}
                  >
                    <span />
                  </div>
                </li>
              ))}
            </ul>
          </Aparecer>
        ))}
      </div>
    </Subseccion>
  )
}
