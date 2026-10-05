import { ArrowUp } from 'lucide-react'
import { useRef, useState } from 'react'
import { useAlScrollear } from '../hooks/useAlScrollear'
import { scrollArriba } from '../utils/scrollSuave'

const RADIO = 21
const CIRCUNFERENCIA = 2 * Math.PI * RADIO

// Botón flotante para volver arriba (como en R1 y R2). Aparece pasada la primera pantalla
// y su anillo muestra cuánto de la página llevás recorrido.
export default function BotonSubir() {
  const [visible, setVisible] = useState(false)
  const anilloRef = useRef(null)

  useAlScrollear(() => {
    const recorrido = document.documentElement.scrollHeight - window.innerHeight
    const progreso = recorrido > 0 ? window.scrollY / recorrido : 0
    anilloRef.current.style.strokeDashoffset = CIRCUNFERENCIA * (1 - progreso)
    const mostrar = window.scrollY > window.innerHeight * 0.9
    setVisible((actual) => (actual === mostrar ? actual : mostrar))
  })

  return (
    <button
      type="button"
      className={visible ? 'boton-subir es-visible' : 'boton-subir'}
      onClick={scrollArriba}
      aria-label="Volver arriba"
      title="Volver arriba"
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
    >
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <circle cx="24" cy="24" r={RADIO} className="boton-subir-pista" />
        <circle
          ref={anilloRef}
          cx="24"
          cy="24"
          r={RADIO}
          className="boton-subir-anillo"
          strokeDasharray={CIRCUNFERENCIA}
          strokeDashoffset={CIRCUNFERENCIA}
        />
      </svg>
      <ArrowUp size={18} />
    </button>
  )
}
