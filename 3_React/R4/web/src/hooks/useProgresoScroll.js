import { useEffect, useRef } from 'react'

// Llama a alCambiar(progreso) mientras se scrollea a través de `ref`:
// 0 cuando su borde superior toca el de la ventana, 1 cuando su borde inferior toca el de abajo.
// No usa estado de React: así el objeto 3D se mueve en cada frame sin volver a renderizar.
export function useProgresoScroll(ref, alCambiar) {
  const callback = useRef(alCambiar)
  callback.current = alCambiar

  useEffect(() => {
    let frame = 0

    function medir() {
      frame = 0
      const el = ref.current
      if (!el) return
      const { top, height } = el.getBoundingClientRect()
      const recorrido = height - window.innerHeight
      const progreso = recorrido > 0 ? Math.min(1, Math.max(0, -top / recorrido)) : 0
      callback.current(progreso)
    }

    function pedirFrame() {
      if (!frame) frame = requestAnimationFrame(medir)
    }

    medir()
    window.addEventListener('scroll', pedirFrame, { passive: true })
    window.addEventListener('resize', pedirFrame)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', pedirFrame)
      window.removeEventListener('resize', pedirFrame)
    }
  }, [ref])
}
