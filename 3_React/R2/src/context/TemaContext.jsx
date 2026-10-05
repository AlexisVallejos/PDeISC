import { createContext, useContext, useEffect } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

const TemaContext = createContext(null)

// La primera vez sigo la apariencia del sistema; después, la que elija la persona.
function temaDelSistema() {
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'oscuro' : 'claro'
}

export function TemaProvider({ children }) {
  const [tema, setTema] = useLocalStorage('tema', temaDelSistema())

  useEffect(() => {
    document.documentElement.setAttribute('data-tema', tema)
    document
      .querySelectorAll('meta[name="theme-color"]')
      .forEach((meta) => meta.setAttribute('content', tema === 'oscuro' ? '#000000' : '#f2f2f7'))
  }, [tema])

  function cambiarTema() {
    setTema((actual) => (actual === 'claro' ? 'oscuro' : 'claro'))
  }

  return <TemaContext.Provider value={{ tema, cambiarTema }}>{children}</TemaContext.Provider>
}

export function useTema() {
  const contexto = useContext(TemaContext)
  if (!contexto) throw new Error('useTema tiene que usarse dentro de un TemaProvider')
  return contexto
}
