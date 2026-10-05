import { useEffect, useState } from 'react'
import local from '../data/portfolio.json'

// Trae el contenido desde la API (MySQL). Si la API no responde, muestra la copia local
// para que el portfolio nunca quede vacío, y lo indica con fuente: 'local'.
export function usePortfolio() {
  const [estado, setEstado] = useState({ datos: local, fuente: 'cargando', visitas: null })

  useEffect(() => {
    const control = new AbortController()

    async function cargar() {
      try {
        const respuesta = await fetch('/api/portfolio', { signal: control.signal })
        const json = await respuesta.json()
        if (!json.ok) throw new Error(json.mensaje)
        const { ok, fuente, visitas, ...datos } = json
        setEstado({ datos, fuente, visitas })
        sumarVisita(setEstado)
      } catch (error) {
        if (error.name !== 'AbortError') setEstado((actual) => ({ ...actual, fuente: 'local' }))
      }
    }

    cargar()
    return () => control.abort()
  }, [])

  return estado
}

// Una visita por pestaña, no una por recarga.
async function sumarVisita(setEstado) {
  try {
    if (sessionStorage.getItem('visita-contada')) return
    sessionStorage.setItem('visita-contada', '1')
    const json = await (await fetch('/api/visitas', { method: 'POST' })).json()
    if (json.ok) setEstado((actual) => ({ ...actual, visitas: json.visitas }))
  } catch {
    // El contador es un extra: si falla, la página sigue igual.
  }
}
