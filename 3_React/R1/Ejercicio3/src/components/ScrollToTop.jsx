import { useEffect, useState } from 'react'

// Muestro una flecha fija cuando la persona ya se alejó del inicio.
export default function ScrollToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Actualizo la visibilidad mientras cambia la posición de la página.
    function revisarDesplazamiento() {
      setVisible(window.scrollY > 360)
    }

    revisarDesplazamiento()
    window.addEventListener('scroll', revisarDesplazamiento, { passive: true })
    return () => window.removeEventListener('scroll', revisarDesplazamiento)
  }, [])

  if (!visible) return null

  return (
    <button
      className="back-to-top"
      type="button"
      aria-label="Volver arriba"
      title="Volver arriba"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    >
      <span aria-hidden="true">↑</span>
    </button>
  )
}
