import { useEffect, useState } from 'react'
import { TemaContext } from './TemaContext.js'

const CLAVE_TEMA = 'r1-preferencia-tema'

// Recupero el tema guardado o consulto la preferencia actual del sistema.
function obtenerTemaInicial() {
  const guardado = window.localStorage.getItem(CLAVE_TEMA)
  if (guardado === 'claro' || guardado === 'oscuro') return guardado
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'oscuro' : 'claro'
}

// Aplico el tema seleccionado y lo guardo para la próxima visita.
export function TemaProvider({ children }) {
  const [tema, setTema] = useState(obtenerTemaInicial)

  useEffect(() => {
    document.documentElement.dataset.theme = tema
    window.localStorage.setItem(CLAVE_TEMA, tema)
  }, [tema])

  // Alterno entre los dos temas.
  function alternarTema() {
    setTema((actual) => actual === 'claro' ? 'oscuro' : 'claro')
  }

  return <TemaContext.Provider value={{ tema, alternarTema }}>{children}</TemaContext.Provider>
}
