import { Moon, Sun } from 'lucide-react'
import { useTema } from '../context/TemaContext'

export default function BotonTema() {
  const { tema, cambiarTema } = useTema()
  const textoAccion = tema === 'claro' ? 'Activar modo oscuro' : 'Activar modo claro'

  return (
    <button type="button" className="boton-icono" onClick={cambiarTema} title={textoAccion} aria-label={textoAccion}>
      {tema === 'claro' ? <Moon size={18} /> : <Sun size={18} />}
    </button>
  )
}
