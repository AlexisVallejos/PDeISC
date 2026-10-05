import { useEffect } from 'react'

export function useTituloPagina(titulo) {
  useEffect(() => {
    document.title = titulo ? `${titulo} · Mis Tareas` : 'Mis Tareas'
  }, [titulo])
}
