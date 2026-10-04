import { useEffect, useState } from 'react'
import './ListaTareas.css'

const TAREAS_INICIALES = [
  { id: 1, texto: 'Estudiar componentes', completada: false },
  { id: 2, texto: 'Practicar useState', completada: true }
]

// Cargo la lista guardada y recupero el ejemplo si no hay datos válidos.
function leerTareasGuardadas() {
  try {
    const guardadas = JSON.parse(window.localStorage.getItem('r1-lista-tareas') || 'null')
    if (Array.isArray(guardadas) && guardadas.every((tarea) => tarea.id && typeof tarea.texto === 'string')) {
      return guardadas
    }
  } catch {
    return TAREAS_INICIALES
  }
  return TAREAS_INICIALES
}

// Reviso que el texto tenga contenido y no supere el máximo permitido.
function validarTexto(valor) {
  const texto = valor.trim()
  if (texto.length < 2) return 'Escribí al menos 2 caracteres.'
  if (texto.length > 80) return 'La tarea no puede superar los 80 caracteres.'
  return ''
}

// Administro el alta, edición, estado y eliminación de las tareas.
function ListaTareas() {
  const [tareas, setTareas] = useState(leerTareasGuardadas)
  const [nuevaTarea, setNuevaTarea] = useState('')
  const [errorNueva, setErrorNueva] = useState('')
  const [idEnEdicion, setIdEnEdicion] = useState(null)
  const [textoEdicion, setTextoEdicion] = useState('')
  const [errorEdicion, setErrorEdicion] = useState('')
  const completadas = tareas.filter((tarea) => tarea.completada).length

  useEffect(() => {
    // Guardo el array actual para conservar la lista al volver a abrir el ejercicio.
    window.localStorage.setItem('r1-lista-tareas', JSON.stringify(tareas))
  }, [tareas])

  // Agrego una tarea nueva cuando pasa la validación.
  function agregarTarea(evento) {
    evento.preventDefault()
    const error = validarTexto(nuevaTarea)
    setErrorNueva(error)
    if (error) return
    setTareas((actuales) => [...actuales, {
      id: Date.now(),
      texto: nuevaTarea.trim(),
      completada: false
    }])
    setNuevaTarea('')
    setErrorNueva('')
  }

  // Actualizo el mensaje de validación mientras se escribe una tarea nueva.
  function cambiarNuevaTarea(evento) {
    const valor = evento.target.value
    setNuevaTarea(valor)
    setErrorNueva(valor.length > 0 ? validarTexto(valor) : '')
  }

  // Preparo el formulario con el texto de la tarea que se va a editar.
  function iniciarEdicion(tarea) {
    setIdEnEdicion(tarea.id)
    setTextoEdicion(tarea.texto)
    setErrorEdicion('')
  }

  // Guardo los cambios de texto en el array de tareas.
  function guardarEdicion(evento) {
    evento.preventDefault()
    const error = validarTexto(textoEdicion)
    setErrorEdicion(error)
    if (error) return
    setTareas((actuales) => actuales.map((tarea) => (
      tarea.id === idEnEdicion ? { ...tarea, texto: textoEdicion.trim() } : tarea
    )))
    setIdEnEdicion(null)
    setTextoEdicion('')
  }

  // Cancelo la edición y descarto el texto que todavía no se guardó.
  function cancelarEdicion() {
    setIdEnEdicion(null)
    setTextoEdicion('')
    setErrorEdicion('')
  }

  // Actualizo el texto editado y su mensaje de validación.
  function cambiarTextoEdicion(evento) {
    const valor = evento.target.value
    setTextoEdicion(valor)
    setErrorEdicion(valor.length > 0 ? validarTexto(valor) : '')
  }

  // Cambio el estado de completada sin modificar las otras tareas.
  function alternarTarea(id) {
    setTareas((actuales) => actuales.map((tarea) => (
      tarea.id === id ? { ...tarea, completada: !tarea.completada } : tarea
    )))
  }

  // Elimino la tarea seleccionada del array.
  function eliminarTarea(id) {
    setTareas((actuales) => actuales.filter((tarea) => tarea.id !== id))
    if (idEnEdicion === id) cancelarEdicion()
  }

  // Selecciono la tarea asociada al botón de edición.
  function editarDesdeBoton(evento) {
    const id = Number(evento.currentTarget.value)
    const tarea = tareas.find((item) => item.id === id)
    if (tarea) iniciarEdicion(tarea)
  }

  // Elimino la tarea indicada por el botón seleccionado.
  function eliminarDesdeBoton(evento) {
    eliminarTarea(Number(evento.currentTarget.value))
  }

  // Cambio el estado de la tarea indicada por su checkbox.
  function cambiarEstadoDesdeCheckbox(evento) {
    alternarTarea(Number(evento.currentTarget.value))
  }

  // Renderizo formularios accesibles y las acciones de cada tarea.
  return (
    <div className="tareas">
      <div className="tareas__resumen" aria-live="polite">
        <span>{tareas.length} {tareas.length === 1 ? 'tarea' : 'tareas'}</span>
        <span>{completadas} completadas</span>
      </div>

      <form className="tareas__formulario" onSubmit={agregarTarea} noValidate>
        <label className="tareas__etiqueta-campo" htmlFor="nueva-tarea">Nueva tarea</label>
        <div className="tareas__fila-alta">
          <input
            id="nueva-tarea"
            className={`tareas__campo${errorNueva ? ' tareas__campo--error' : ''}`}
            type="text"
            value={nuevaTarea}
            onChange={cambiarNuevaTarea}
            minLength={2}
            maxLength={80}
            required
            aria-invalid={Boolean(errorNueva)}
            aria-describedby="error-nueva-tarea"
            autoComplete="off"
          />
          <button className="tareas__boton tareas__boton--principal" type="submit">Agregar</button>
        </div>
        <p className={errorNueva ? 'tareas__error' : 'tareas__ayuda'} id="error-nueva-tarea" role="status">
          {errorNueva || 'Entre 2 y 80 caracteres.'}
        </p>
      </form>

      {tareas.length === 0 ? (
        <p className="tareas__vacio">Todavía no hay tareas. Agregá la primera arriba.</p>
      ) : (
        <ul className="tareas__lista">
          {tareas.map((tarea) => (
            <li key={tarea.id} className="tareas__item">
              {idEnEdicion === tarea.id ? (
                <form className="tareas__edicion" onSubmit={guardarEdicion} noValidate>
                  <label className="tareas__etiqueta-campo" htmlFor={`editar-tarea-${tarea.id}`}>Editar tarea</label>
                  <input
                    id={`editar-tarea-${tarea.id}`}
                    className={`tareas__campo${errorEdicion ? ' tareas__campo--error' : ''}`}
                    value={textoEdicion}
                    onChange={cambiarTextoEdicion}
                    minLength={2}
                    maxLength={80}
                    required
                    aria-invalid={Boolean(errorEdicion)}
                    aria-describedby={`error-edicion-${tarea.id}`}
                    autoFocus
                  />
                  <p className={errorEdicion ? 'tareas__error' : 'tareas__ayuda'} id={`error-edicion-${tarea.id}`} role="status">
                    {errorEdicion || 'Entre 2 y 80 caracteres.'}
                  </p>
                  <div className="tareas__acciones">
                    <button className="tareas__boton tareas__boton--principal" type="submit">Guardar</button>
                    <button className="tareas__boton" type="button" onClick={cancelarEdicion}>Cancelar</button>
                  </div>
                </form>
              ) : (
                <>
                  <label className="tareas__etiqueta">
                    <input
                      type="checkbox"
                      checked={tarea.completada}
                      value={tarea.id}
                      onChange={cambiarEstadoDesdeCheckbox}
                      aria-label={`Marcar ${tarea.texto} como ${tarea.completada ? 'pendiente' : 'completada'}`}
                    />
                    <span className={tarea.completada ? 'tareas__texto tareas__texto--hecha' : 'tareas__texto'}>
                      {tarea.texto}
                    </span>
                  </label>
                  <div className="tareas__acciones">
                    <button className="tareas__boton" type="button" value={tarea.id} onClick={editarDesdeBoton} aria-label={`Editar ${tarea.texto}`}>Editar</button>
                    <button className="tareas__boton tareas__boton--borrar" type="button" value={tarea.id} onClick={eliminarDesdeBoton} aria-label={`Eliminar ${tarea.texto}`}>Eliminar</button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default ListaTareas
