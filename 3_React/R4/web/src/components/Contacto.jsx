import { Check, LoaderCircle } from 'lucide-react'
import { useState } from 'react'
import Aparecer from './Aparecer'
import Seccion from './Seccion'

const VACIO = { nombre: '', email: '', mensaje: '' }
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function validar({ nombre, email, mensaje }) {
  const errores = {}
  if (nombre.trim().length < 2) errores.nombre = 'Escribí tu nombre'
  if (!EMAIL.test(email.trim())) errores.email = 'Revisá el email'
  if (mensaje.trim().length < 10) errores.mensaje = 'El mensaje necesita al menos 10 caracteres'
  return errores
}

export default function Contacto() {
  const [valores, setValores] = useState(VACIO)
  const [tocados, setTocados] = useState({})
  const [erroresServidor, setErroresServidor] = useState({})
  const [estado, setEstado] = useState({ tipo: 'inicial', texto: '' })

  const errores = { ...validar(valores), ...erroresServidor }
  const enviando = estado.tipo === 'enviando'

  function alCambiar(evento) {
    const { name, value } = evento.target
    setValores((actual) => ({ ...actual, [name]: value }))
    setErroresServidor(({ [name]: _, ...resto }) => resto)
    if (estado.tipo !== 'inicial' && estado.tipo !== 'enviando') setEstado({ tipo: 'inicial', texto: '' })
  }

  // Valido al salir del campo, no mientras se escribe: no marco errores en lo que todavía no terminaste.
  function alSalir(evento) {
    setTocados((actual) => ({ ...actual, [evento.target.name]: true }))
  }

  async function alEnviar(evento) {
    evento.preventDefault()
    setTocados({ nombre: true, email: true, mensaje: true })
    if (Object.keys(validar(valores)).length) return

    setEstado({ tipo: 'enviando', texto: '' })
    try {
      const respuesta = await fetch('/api/mensajes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(valores),
      })
      const json = await respuesta.json()
      if (json.ok) {
        setValores(VACIO)
        setTocados({})
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
    const Control = props.as ?? 'input'
    const { as, ...resto } = props
    return (
      <div className={mostrarError ? 'campo tiene-error' : 'campo'}>
        <label htmlFor={`contacto-${nombre}`}>{etiqueta}</label>
        <Control
          id={`contacto-${nombre}`}
          name={nombre}
          value={valores[nombre]}
          onChange={alCambiar}
          onBlur={alSalir}
          aria-invalid={Boolean(mostrarError)}
          aria-describedby={mostrarError ? `contacto-${nombre}-error` : undefined}
          disabled={enviando}
          {...resto}
        />
        <p id={`contacto-${nombre}-error`} className="campo-error" aria-live="polite">
          {mostrarError || ''}
        </p>
      </div>
    )
  }

  return (
    <Seccion id="contacto" sobretitulo="Contacto" titulo="Hablemos de tu *próximo proyecto*." lateral>
      <Aparecer className="contacto">
        <p className="contacto-intro">
          ¿Tenés una idea, una propuesta o una pregunta? Dejame un mensaje: queda guardado en la base de datos y te
          respondo a la brevedad.
        </p>
        <form className="formulario tarjeta" onSubmit={alEnviar} noValidate>
          {campo('nombre', 'Nombre', { autoComplete: 'name', maxLength: 80 })}
          {campo('email', 'Email', { type: 'email', autoComplete: 'email', inputMode: 'email', maxLength: 120 })}
          {campo('mensaje', 'Mensaje', { as: 'textarea', rows: 5, maxLength: 2000 })}

          <div className="formulario-pie">
            <button type="submit" className="boton boton--oscuro" disabled={enviando}>
              {enviando ? <LoaderCircle size={17} className="girando" aria-hidden="true" /> : null}
              {enviando ? 'Enviando…' : 'Enviar mensaje'}
            </button>
            <p className={`formulario-estado formulario-estado--${estado.tipo}`} role="status">
              {estado.tipo === 'exito' && <Check size={16} aria-hidden="true" />}
              {estado.texto}
            </p>
          </div>
        </form>
      </Aparecer>
    </Seccion>
  )
}
