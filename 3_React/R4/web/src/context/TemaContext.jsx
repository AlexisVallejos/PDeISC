import { createContext, useContext, useEffect } from 'react'
import { flushSync } from 'react-dom'
import { useLocalStorage } from '../hooks/useLocalStorage'

const TemaContext = createContext(null)
const COLOR_BARRA = { claro: '#f5f5f7', oscuro: '#000000' }

// La primera vez sigo la apariencia del sistema; después, la que elija la persona.
function temaDelSistema() {
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'oscuro' : 'claro'
}

export function TemaProvider({ children }) {
  const [tema, setTema] = useLocalStorage('tema', temaDelSistema())

  useEffect(() => {
    document.documentElement.setAttribute('data-tema', tema)
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', COLOR_BARRA[tema])
  }, [tema])

  // El cambio se revela como un círculo que crece desde el botón (View Transitions).
  // Sin soporte o con "reducir movimiento", el cambio es directo.
  function cambiarTema(evento) {
    const siguiente = tema === 'claro' ? 'oscuro' : 'claro'
    const reducir = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!document.startViewTransition || reducir) return setTema(siguiente)

    const caja = evento?.currentTarget?.getBoundingClientRect()
    const x = caja ? caja.left + caja.width / 2 : innerWidth / 2
    const y = caja ? caja.top + caja.height / 2 : 0
    const radio = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))

    const transicion = document.startViewTransition(() => {
      flushSync(() => setTema(siguiente))
      document.documentElement.setAttribute('data-tema', siguiente)
    })
    transicion.ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radio}px at ${x}px ${y}px)`] },
        { duration: 550, easing: 'cubic-bezier(0.23, 1, 0.32, 1)', pseudoElement: '::view-transition-new(root)' },
      )
    })
  }

  return <TemaContext.Provider value={{ tema, cambiarTema }}>{children}</TemaContext.Provider>
}

export function useTema() {
  const contexto = useContext(TemaContext)
  if (!contexto) throw new Error('useTema tiene que usarse dentro de un TemaProvider')
  return contexto
}
