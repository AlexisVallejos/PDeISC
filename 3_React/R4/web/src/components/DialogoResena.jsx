import { Check, LoaderCircle, Star, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useReducirMovimiento } from '../hooks/useReducirMovimiento'

const VACIO = { nombre: '', rol: '', texto: '', puntaje: 5 }
const MAXIMO = 600
const SALIDA_MS = 180

function validar({ nombre, rol, texto, puntaje }) {
  const errores = {}
  if (nombre.trim().length < 2) errores.nombre = 'Escribí tu nombre'
  if (rol.trim().length > 80) errores.rol = 'Máximo 80 caracteres'
  if (texto.trim().length < 20) errores.texto = 'Contá un poco más: al menos 20 caracteres'
  if (!(puntaje >= 1 && puntaje <= 5)) errores.puntaje = 'Elegí de 1 a 5 estrellas'
  return errores
}

// Formulario para dejar una reseña, en un <dialog> nativo: atrapa el foco, se cierra con Escape
// y devuelve el foco al botón que lo abrió. Entra con un leve ascenso y sale por el mismo camino.
export default function DialogoResena({ abierto, alCerrar, alPublicar }) {
  const dialogoRef = useRef(null)
  const [valores, setValores] = useState(VACIO)
  const [tocados, setTocados] = useState({})
  const [erroresServidor, setErroresServidor] = useState({})
  const [estado, setEstado] = useState({ tipo: 'inicial', texto: '' })
  const [vistaPrevia, setVistaPrevia] = useState(null)
  const reducir = useReducirMovimiento()

  const errores = { ...validar(valores), ...erroresServidor }
  const enviando = estado.tipo === 'enviando'

  useEffect(() => {
    const dialogo = dialogoRef.current
    if (abierto && !dialogo.open) {
      dialogo.classList.remove('es-saliendo')
      dialogo.showModal()
    }
  }, [abierto])

  function cerrar() {
    const dialogo = dialogoRef.current
    if (!dialogo.open || dialogo.classList.contains('es-saliendo')) return
    const terminar = () => {
      dialogo.classList.remove('es-saliendo')
      dialogo.close()
      alCerrar()
      if (estado.tipo === 'exito') {
        setValores(VACIO)
        setTocados({})
        setEstado({ tipo: 'inicial', texto: '' })
      }
    }
    if (reducir) return terminar()
    dialogo.classList.add('es-saliendo')
    setTimeout(terminar, SALIDA_MS)
  }

  function alCambiar(evento) {
    const { name, value } = evento.target
    setValores((actual) => ({ ...actual, [name]: name === 'puntaje' ? Number(value) : value }))
    setErroresServidor(({ [name]: _, ...resto }) => resto)
    if (estado.tipo === 'error') setEstado({ tipo: 'inicial', texto: '' })
  }

  const alSalir = (evento) => setTocados((actual) => ({ ...actual, [evento.target.name]: true }))

  async function alEnviar(evento) {
    evento.preventDefault()
    setTocados({ nombre: true, rol: true, texto: true, puntaje: true })
    if (Object.keys(validar(valores)).length) return

    setEstado({ tipo: 'enviando', texto: '' })
    try {
      const respuesta = await fetch('/api/resenas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(valores),
      })
      const json = await respuesta.json()
      if (json.ok) {
        if (json.publicada) alPublicar({ ...valores, nombre: valores.nombre.trim(), texto: valores.texto.trim() })
        setEstado({ tipo: 'exito', texto: json.mensaje })
      } else {
        if (json.errores) setErroresServidor(json.errores)
        setEstado({ tipo: 'error', texto: json.mensaje ?? 'Revisá los campos marcados' })
      }
    } catch {
      setEstado({ tipo: 'error', texto: 'No hay conexión con el servidor. Probá de nuevo en un momento.' })
    }
  }

  function campo(nombre, etiqueta, props = {}) {
    const mostrarError = tocados[nombre] && errores[nombre]
    const { as: Control = 'input', ayuda, ...resto } = props
    return (
      <div className={mostrarError ? 'campo tiene-error' : 'campo'}>
        <label htmlFor={`resena-${nombre}`}>{etiqueta}</label>
        <Control
          id={`resena-${nombre}`}
          name={nombre}
          value={valores[nombre]}
          onChange={alCambiar}
          onBlur={alSalir}
          aria-invalid={Boolean(mostrarError)}
          aria-describedby={`resena-${nombre}-ayuda`}
          disabled={enviando}
          {...resto}
        />
        <p id={`resena-${nombre}-ayuda`} className={mostrarError ? 'campo-error' : 'campo-ayuda'} aria-live="polite">
          {mostrarError || ayuda || ''}
        </p>
      </div>
    )
  }

  const puntajeVisible = vistaPrevia ?? valores.puntaje

  return (
    <dialog
      ref={dialogoRef}
      className="dialogo"
      aria-labelledby="resena-titulo"
      onCancel={(evento) => {
        evento.preventDefault()
        cerrar()
      }}
      onClick={(evento) => evento.target === evento.currentTarget && cerrar()}
    >
      <div className="dialogo-contenido">
        <header className="dialogo-cabecera">
          <div>
            <p className="sobretitulo">Reseñas</p>
            <h2 id="resena-titulo" className="dialogo-titulo">
              {estado.tipo === 'exito' ? (
                '¡Gracias!'
              ) : (
                <>
                  Contame tu <em>experiencia</em>
                </>
              )}
            </h2>
          </div>
          <button type="button" className="dialogo-cerrar" onClick={cerrar} aria-label="Cerrar">
            <X size={18} />
          </button>
        </header>

        {estado.tipo === 'exito' ? (
          <div className="dialogo-exito" role="status">
            <span className="dialogo-exito-icono" aria-hidden="true">
              <Check size={26} strokeWidth={2.5} />
            </span>
            <p>{estado.texto}</p>
            <button type="button" className="boton boton--oscuro" onClick={cerrar}>
              Listo
            </button>
          </div>
        ) : (
          <form className="formulario formulario--resena" onSubmit={alEnviar} noValidate>
            <fieldset className="campo campo-estrellas" disabled={enviando}>
              <legend>Puntaje</legend>
              <div className="estrellas-entrada" onPointerLeave={() => setVistaPrevia(null)}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <label
                    key={n}
                    className={n <= puntajeVisible ? 'estrella es-llena' : 'estrella'}
                    onPointerEnter={(evento) => evento.pointerType === 'mouse' && setVistaPrevia(n)}
                  >
                    <input type="radio" name="puntaje" value={n} checked={valores.puntaje === n} onChange={alCambiar} />
                    <Star size={26} fill={n <= puntajeVisible ? 'currentColor' : 'none'} aria-hidden="true" />
                    <span className="solo-lectores">
                      {n} {n === 1 ? 'estrella' : 'estrellas'}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            {campo('nombre', 'Nombre', { autoComplete: 'name', maxLength: 80 })}
            {campo('rol', 'Rol o empresa (opcional)', { autoComplete: 'organization-title', maxLength: 80 })}
            {campo('texto', 'Reseña', {
              as: 'textarea',
              rows: 4,
              maxLength: MAXIMO,
              ayuda: `${valores.texto.length}/${MAXIMO}`,
            })}

            <div className="formulario-pie">
              <button type="submit" className="boton boton--oscuro" disabled={enviando}>
                {enviando && <LoaderCircle size={17} className="girando" aria-hidden="true" />}
                {enviando ? 'Enviando…' : 'Publicar reseña'}
              </button>
              <p className="formulario-estado formulario-estado--error" role="status">
                {estado.tipo === 'error' && estado.texto}
              </p>
            </div>
            <p className="dialogo-nota">Las reseñas se revisan antes de publicarse.</p>
          </form>
        )}
      </div>
    </dialog>
  )
}
