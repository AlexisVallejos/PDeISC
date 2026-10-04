// Ejercicio 5: formulario que pide un nombre y muestra un mensaje de bienvenida.
import { useState } from 'react'
import './FormularioSimple.css'

function FormularioSimple() {
  // Lo que se escribe en el input (input controlado: su valor viene del estado).
  const [nombre, setNombre] = useState('')
  // Nombre ya enviado. Mientras esté vacío no se muestra ningún mensaje.
  const [bienvenido, setBienvenido] = useState('')

  // Se ejecuta al enviar el formulario (botón o tecla Enter).
  function manejarEnvio(evento) {
    evento.preventDefault() // evita que la página se recargue
    setBienvenido(nombre.trim()) // guardo el nombre para mostrar el mensaje
  }

  return (
    <form className="formulario" onSubmit={manejarEnvio}>
      <label className="formulario__etiqueta" htmlFor="nombre-usuario">
        Tu nombre
      </label>
      <div className="formulario__fila">
        <input
          id="nombre-usuario"
          className="formulario__campo"
          type="text"
          value={nombre}
          onChange={(evento) => setNombre(evento.target.value)}
          autoComplete="given-name"
        />
        <button className="formulario__boton" type="submit">
          Enviar
        </button>
      </div>

      {/* Renderizado condicional: el mensaje aparece solo si hay un nombre enviado */}
      {bienvenido !== '' && (
        <p className="formulario__mensaje" role="status">
          ¡Bienvenido, {bienvenido}!
        </p>
      )}
    </form>
  )
}

export default FormularioSimple
