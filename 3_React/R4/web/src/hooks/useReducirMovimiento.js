import { useEffect, useState } from 'react'

const consulta = '(prefers-reduced-motion: reduce)'

// true cuando la persona activó "reducir movimiento" en su sistema. Se actualiza en vivo.
export function useReducirMovimiento() {
  const [reducir, setReducir] = useState(() => window.matchMedia?.(consulta).matches ?? false)

  useEffect(() => {
    const media = window.matchMedia(consulta)
    const alCambiar = () => setReducir(media.matches)
    media.addEventListener('change', alCambiar)
    return () => media.removeEventListener('change', alCambiar)
  }, [])

  return reducir
}
