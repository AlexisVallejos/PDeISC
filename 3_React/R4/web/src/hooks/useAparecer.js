import { useEffect, useRef, useState } from 'react'

// Devuelve [ref, visible]: visible pasa a true la primera vez que el elemento entra en pantalla.
export function useAparecer({ margen = '0px 0px -12% 0px' } = {}) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || visible) return
    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          setVisible(true)
          observador.disconnect()
        }
      },
      { rootMargin: margen },
    )
    observador.observe(el)
    return () => observador.disconnect()
  }, [margen, visible])

  return [ref, visible]
}
