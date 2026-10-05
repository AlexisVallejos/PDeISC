import { useEffect, useRef } from 'react'
import { useAparecer } from '../hooks/useAparecer'
import { useReducirMovimiento } from '../hooks/useReducirMovimiento'
import { separarValor } from '../utils/texto'

const DURACION = 1400 // ms
const desacelerar = (t) => 1 - Math.pow(1 - t, 4)

// Cifras del hero: cuentan desde 0 la primera vez que se ven.
export default function Estadisticas({ estadisticas }) {
  const [ref, visible] = useAparecer({ margen: '0px' })

  return (
    <dl className="estadisticas" ref={ref}>
      {estadisticas.map((e) => (
        <div key={e.etiqueta} className="estadistica">
          <dt>{e.etiqueta}</dt>
          <dd>
            <Contador valor={e.valor} activo={visible} />
          </dd>
        </div>
      ))}
    </dl>
  )
}

export function Contador({ valor, activo }) {
  const { numero, sufijo } = separarValor(valor)
  const ref = useRef(null)
  const reducir = useReducirMovimiento()

  useEffect(() => {
    const el = ref.current
    if (numero === null || !el) return
    if (!activo || reducir) {
      el.textContent = activo || reducir ? numero : 0
      return
    }
    let frame = 0
    const inicio = performance.now()
    function paso(ahora) {
      const t = Math.min(1, (ahora - inicio) / DURACION)
      el.textContent = Math.round(numero * desacelerar(t))
      if (t < 1) frame = requestAnimationFrame(paso)
    }
    frame = requestAnimationFrame(paso)
    return () => cancelAnimationFrame(frame)
  }, [numero, activo, reducir])

  if (numero === null) return valor
  return (
    <>
      {/* El lector de pantalla lee el valor final, no la cuenta. */}
      <span className="solo-lectores">{valor}</span>
      <span aria-hidden="true">
        <span ref={ref}>0</span>
        {sufijo}
      </span>
    </>
  )
}
