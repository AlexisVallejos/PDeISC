import { useEffect, useState } from 'react'

// Hora actual en una zona horaria, actualizada justo al cambiar cada minuto.
export function useHora(zona) {
  const [ahora, setAhora] = useState(() => new Date())

  useEffect(() => {
    let temporizador = 0
    function programar() {
      const hasta = 60_000 - (Date.now() % 60_000)
      temporizador = setTimeout(() => {
        setAhora(new Date())
        programar()
      }, hasta + 50)
    }
    programar()
    return () => clearTimeout(temporizador)
  }, [])

  const formato = (opciones) => new Intl.DateTimeFormat('es-AR', { timeZone: zona, ...opciones }).format(ahora)
  return {
    hora: formato({ hour: '2-digit', minute: '2-digit', hour12: false }),
    zona: formato({ timeZoneName: 'shortOffset' }).split(' ').pop(),
  }
}
