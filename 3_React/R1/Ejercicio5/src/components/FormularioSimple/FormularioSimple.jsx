import { useState } from 'react'
import './FormularioSimple.css'

const PATRON_NOMBRE = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ ]{2,40}$/

// Valido el nombre con las mismas reglas del formulario.
function validarNombre(valor) {
  if (!valor.trim()) return 'El nombre es obligatorio.'
  if (!PATRON_NOMBRE.test(valor.trim())) return 'Usá entre 2 y 40 letras; no agregues números ni símbolos.'
  return ''
}

// Administro la escritura, validación y respuesta de bienvenida.
function FormularioSimple() {
  const [nombre, setNombre] = useState('')
  const [error, setError] = useState('')
  const [bienvenido, setBienvenido] = useState('')

  // Actualizo el campo y muestro el error mientras se escribe.
  function manejarCambio(evento) {
    const valor = evento.target.value
    setNombre(valor)
    setBienvenido('')
    setError(valor.length > 0 ? validarNombre(valor) : '')
  }

  // Detengo el envío cuando el nombre no cumple las reglas.
  function manejarEnvio(evento) {
    evento.preventDefault()
    const errorActual = validarNombre(nombre)
    setError(errorActual)
    if (errorActual) return
    setBienvenido(nombre.trim())
  }

  return (
    <form className="formulario" onSubmit={manejarEnvio} noValidate>
      <label className="formulario__etiqueta" htmlFor="nombre-usuario">Tu nombre</label>
      <div className="formulario__fila">
        <input
          id="nombre-usuario"
          className={`formulario__campo${error ? ' formulario__campo--error' : ''}`}
          type="text"
          value={nombre}
          onChange={manejarCambio}
          autoComplete="given-name"
          minLength={2}
          maxLength={40}
          pattern="[A-Za-zÁÉÍÓÚÜÑáéíóúüñ ]{2,40}"
          required
          aria-invalid={Boolean(error)}
          aria-describedby="error-nombre"
        />
        <button className="formulario__boton" type="submit">Enviar</button>
      </div>
      <p className={error ? 'formulario__error' : 'formulario__ayuda'} id="error-nombre" role="status">
        {error || 'Ingresá de 2 a 40 letras.'}
      </p>
      {bienvenido && <p className="formulario__mensaje" role="status">¡Bienvenido, {bienvenido}!</p>}
    </form>
  )
}

export default FormularioSimple
