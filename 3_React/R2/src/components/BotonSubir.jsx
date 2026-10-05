import { ArrowUp } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function BotonSubir() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    function alDesplazar() {
      setVisible(window.scrollY > 300)
    }
    alDesplazar()
    window.addEventListener('scroll', alDesplazar, { passive: true })
    return () => window.removeEventListener('scroll', alDesplazar)
  }, [])

  function subir() {
    const reducir = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: reducir ? 'auto' : 'smooth' })
  }

  return (
    <button
      type="button"
      className={`boton-subir ${visible ? 'visible' : ''}`}
      onClick={subir}
      aria-label="Volver arriba"
      title="Volver arriba"
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
    >
      <ArrowUp size={20} />
    </button>
  )
}
