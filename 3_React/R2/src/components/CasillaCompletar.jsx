import { Check } from 'lucide-react'

// Círculo de Recordatorios: vacío cuando está pendiente, relleno con tilde al completarse.
export default function CasillaCompletar({ completada, titulo, onCambiar, tamano = 'normal' }) {
  const accion = completada ? 'Volver incompleta' : 'Marcar como completa'

  return (
    <button
      type="button"
      className={`casilla-completar casilla-${tamano} ${completada ? 'marcada' : ''}`}
      onClick={onCambiar}
      aria-pressed={completada}
      aria-label={titulo ? `${accion}: ${titulo}` : accion}
      title={accion}
    >
      <span className="casilla-circulo" aria-hidden="true">
        <Check size={tamano === 'grande' ? 16 : 13} strokeWidth={3.2} />
      </span>
    </button>
  )
}
