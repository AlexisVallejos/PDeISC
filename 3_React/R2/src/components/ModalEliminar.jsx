import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

// Alerta al estilo iOS: fondo atenuado, caja centrada y botones separados por
// líneas finas. Escape o tocar afuera cancela; el foco arranca en "Cancelar"
// (la opción segura) y vuelve al botón que la abrió al cerrarse.
export default function ModalEliminar({ titulo, onConfirmar, onCancelar }) {
  const cancelarRef = useRef(null)
  const cajaRef = useRef(null)
  const cancelar = useRef(onCancelar)
  cancelar.current = onCancelar

  useEffect(() => {
    const anterior = document.activeElement
    cancelarRef.current?.focus()
    const overflowPrevio = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function alPresionar(evento) {
      if (evento.key === 'Escape') {
        cancelar.current()
        return
      }
      // Mantengo el Tab dentro de la alerta.
      if (evento.key === 'Tab') {
        const botones = cajaRef.current?.querySelectorAll('button')
        if (!botones?.length) return
        const primero = botones[0]
        const ultimo = botones[botones.length - 1]
        if (evento.shiftKey && document.activeElement === primero) {
          evento.preventDefault()
          ultimo.focus()
        } else if (!evento.shiftKey && document.activeElement === ultimo) {
          evento.preventDefault()
          primero.focus()
        }
      }
    }

    document.addEventListener('keydown', alPresionar)
    return () => {
      document.removeEventListener('keydown', alPresionar)
      document.body.style.overflow = overflowPrevio
      anterior?.focus?.()
    }
  }, [])

  // Se monta en <body> para cubrir toda la pantalla aunque la página tenga transform.
  return createPortal(
    <div className="fondo-modal" onClick={onCancelar}>
      <div
        ref={cajaRef}
        className="caja-alerta"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="tituloAlerta"
        aria-describedby="textoAlerta"
        onClick={(evento) => evento.stopPropagation()}
      >
        <div className="alerta-texto">
          <h2 id="tituloAlerta">¿Eliminar esta tarea?</h2>
          <p id="textoAlerta">
            Vas a eliminar <strong>“{titulo}”</strong>. Esta acción no se puede deshacer.
          </p>
        </div>
        <div className="alerta-acciones">
          <button ref={cancelarRef} type="button" onClick={onCancelar}>
            Cancelar
          </button>
          <button type="button" className="alerta-destructiva" onClick={onConfirmar}>
            Eliminar
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
