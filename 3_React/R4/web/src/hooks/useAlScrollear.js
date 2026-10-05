import { useEffect, useRef } from 'react'

// Llama a alCambiar() una vez por frame mientras se scrollea o cambia el tamaño de la ventana.
// No guarda estado: quien lo usa escribe directo en el DOM y React no vuelve a renderizar.
export function useAlScrollear(alCambiar) {
  const callback = useRef(alCambiar)
  callback.current = alCambiar

  useEffect(() => {
    let frame = 0
    const ejecutar = () => {
      frame = 0
      callback.current()
    }
    const pedir = () => {
      if (!frame) frame = requestAnimationFrame(ejecutar)
    }
    ejecutar()
    window.addEventListener('scroll', pedir, { passive: true })
    window.addEventListener('resize', pedir)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', pedir)
      window.removeEventListener('resize', pedir)
    }
  }, [])
}
