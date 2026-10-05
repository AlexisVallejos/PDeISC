import { Moon, Sun } from 'lucide-react'
import { useTema } from '../context/TemaContext'

export default function BotonTema() {
  const { tema, cambiarTema } = useTema()
  const texto = tema === 'claro' ? 'Activar modo oscuro' : 'Activar modo claro'

  return (
    <button type="button" className="boton-tema" onClick={cambiarTema} aria-label={texto} title={texto}>
      {/* Los dos íconos están siempre; se cruzan girando (sol ↔ luna) */}
      <Sun size={18} className="boton-tema-sol" aria-hidden="true" />
      <Moon size={18} className="boton-tema-luna" aria-hidden="true" />
    </button>
  )
}
