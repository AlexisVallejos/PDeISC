import { useEffect, useState } from 'react'

function leer(clave, valorInicial) {
  try {
    const guardado = localStorage.getItem(clave)
    return guardado !== null ? JSON.parse(guardado) : valorInicial
  } catch (error) {
    console.error('No se pudo leer localStorage:', error)
    return valorInicial
  }
}

// Estado de React que se guarda solo en localStorage y se mantiene
// sincronizado si la misma app está abierta en otra pestaña.
export function useLocalStorage(clave, valorInicial) {
  const [valor, setValor] = useState(() => leer(clave, valorInicial))

  useEffect(() => {
    try {
      localStorage.setItem(clave, JSON.stringify(valor))
    } catch (error) {
      console.error('No se pudo guardar en localStorage:', error)
    }
  }, [clave, valor])

  useEffect(() => {
    function alCambiarEnOtraPestana(evento) {
      if (evento.key === clave) setValor(leer(clave, valorInicial))
    }
    window.addEventListener('storage', alCambiarEnOtraPestana)
    return () => window.removeEventListener('storage', alCambiarEnOtraPestana)
    // valorInicial solo se usa como respaldo, no hace falta volver a suscribirse.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clave])

  return [valor, setValor]
}
