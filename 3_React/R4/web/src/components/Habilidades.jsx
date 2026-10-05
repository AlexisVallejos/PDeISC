import { useMemo } from 'react'
import Aparecer from './Aparecer'

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
    <div className="habilidades">
      <h3 className="sobretitulo">Habilidades</h3>
      <div className="grilla-habilidades">
        {grupos.map(([categoria, lista], i) => (
          <Aparecer key={categoria} orden={i} className="grupo-habilidades">
            <h4>{categoria}</h4>
            <ul>
              {lista.map((h, j) => (
                <li key={h.nombre} style={{ '--nivel': h.nivel / 100, '--retardo-barra': `${150 + j * 60}ms` }}>
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
    </div>
  )
}
