import { useEffect, useState } from 'react'

// Id de la sección que ocupa el centro de la pantalla, para marcarla en la barra de navegación.
export function useSeccionActiva(ids) {
  const [activa, setActiva] = useState(null)
  const clave = ids.join(',')

  useEffect(() => {
    const observador = new IntersectionObserver(
      (entradas) => {
        for (const entrada of entradas) {
          if (entrada.isIntersecting) setActiva(entrada.target.id)
        }
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    clave.split(',').forEach((id) => {
      const el = document.getElementById(id)
      if (el) observador.observe(el)
    })
    return () => observador.disconnect()
  }, [clave])

  return activa
}
