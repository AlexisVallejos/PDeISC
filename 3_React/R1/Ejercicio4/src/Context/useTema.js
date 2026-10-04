import { useContext } from 'react'
import { TemaContext } from './TemaContext.js'

// Obtengo el tema y su acción para los componentes de la interfaz.
export function useTema() {
  const contexto = useContext(TemaContext)
  if (!contexto) throw new Error('useTema necesita estar dentro de TemaProvider.')
  return contexto
}
