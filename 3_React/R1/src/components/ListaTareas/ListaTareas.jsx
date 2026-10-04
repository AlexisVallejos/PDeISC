// Ejercicio 4: lista de tareas. Las tareas se guardan en un arreglo dentro del estado.
import { useState } from 'react'
import './ListaTareas.css'

function ListaTareas() {
  // Arreglo de tareas. Cada tarea es un objeto: { id, texto, completada }.
  const [tareas, setTareas] = useState([
    { id: 1, texto: 'Estudiar componentes', completada: false },
    { id: 2, texto: 'Practicar useState', completada: true }
  ])
  // Texto que el usuario está escribiendo en el input (input controlado).
  const [nuevaTarea, setNuevaTarea] = useState('')

  // Agrega una tarea nueva al arreglo.
  function agregarTarea(evento) {
    evento.preventDefault() // evita que el formulario recargue la página
    const texto = nuevaTarea.trim() // saco espacios de los costados
    if (texto === '') return // no agrego tareas vacías
    // Creo un arreglo NUEVO con las tareas anteriores (...tareas) y la nueva al final.
    setTareas([...tareas, { id: Date.now(), texto, completada: false }])
    setNuevaTarea('') // limpio el input
  }

  // Marca o desmarca una tarea como completada.
  function alternarTarea(id) {
    // map recorre el arreglo y devuelve uno nuevo: solo cambia la tarea con ese id.
    setTareas(
      tareas.map((tarea) =>
        tarea.id === id ? { ...tarea, completada: !tarea.completada } : tarea
      )
    )
  }

  return (
    <div className="tareas">
      <form className="tareas__formulario" onSubmit={agregarTarea}>
        <input
          className="tareas__campo"
          type="text"
          value={nuevaTarea}
          onChange={(evento) => setNuevaTarea(evento.target.value)}
          placeholder="Nueva tarea"
          aria-label="Nueva tarea"
        />
        <button className="tareas__boton" type="submit">
          Agregar
        </button>
      </form>

      {tareas.length === 0 && <p className="tareas__vacio">No hay tareas todavía.</p>}

      <ul className="tareas__lista">
        {/* Para renderizar listas uso map y una "key" única por elemento */}
        {tareas.map((tarea) => (
          <li key={tarea.id} className="tareas__item">
            <label className="tareas__etiqueta">
              <input
                type="checkbox"
                checked={tarea.completada}
                onChange={() => alternarTarea(tarea.id)}
              />
              {/* Si la tarea está completada se agrega la clase que tacha el texto */}
              <span className={tarea.completada ? 'tareas__texto tareas__texto--hecha' : 'tareas__texto'}>
                {tarea.texto}
              </span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ListaTareas
