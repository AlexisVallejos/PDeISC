import { createContext, useContext } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { fechaDeHoy } from '../utils/fecha'

const tareasIniciales = [
  {
    id: 1,
    titulo: 'Terminar el trabajo práctico de React',
    descripcion:
      'Repasar los componentes, revisar que las rutas funcionen bien y dejar todo prolijo antes de entregar. Falta probar el modo oscuro en el celular.',
    completada: false,
    fechaCreacion: '18/08/26',
  },
  {
    id: 2,
    titulo: 'Estudiar para la mesa de examen',
    descripcion:
      'Leer de nuevo el capítulo de estructuras de control y hacer los ejercicios que quedaron pendientes de la guía 3.',
    completada: false,
    fechaCreacion: '19/08/26',
  },
  {
    id: 3,
    titulo: 'Comprar útiles para el proyecto grupal',
    descripcion: 'Hoja afiche, marcadores y la carpeta para entregar la maqueta el viernes que viene.',
    completada: true,
    fechaCreacion: '15/08/26',
  },
  {
    id: 4,
    titulo: 'Subir el video de la exposición',
    descripcion:
      'Editar el video que grabamos en el laboratorio y subirlo al classroom antes de la clase del jueves.',
    completada: false,
    fechaCreacion: '20/08/26',
  },
]

const TareasContext = createContext(null)

export function TareasProvider({ children }) {
  const [guardadas, setGuardadas] = useLocalStorage('tareas', tareasIniciales)
  // Si lo guardado se rompió (no es una lista), arranco de cero en vez de fallar.
  const tareas = Array.isArray(guardadas) ? guardadas : []

  function setTareas(actualizar) {
    setGuardadas((anteriores) => actualizar(Array.isArray(anteriores) ? anteriores : []))
  }

  function agregarTarea({ titulo, descripcion, completada }) {
    const nueva = {
      id: tareas.length > 0 ? Math.max(...tareas.map((tarea) => tarea.id)) + 1 : 1,
      titulo: titulo.trim(),
      descripcion: descripcion.trim(),
      completada,
      fechaCreacion: fechaDeHoy(),
    }
    setTareas((anteriores) => [...anteriores, nueva])
    return nueva
  }

  function editarTarea(id, cambios) {
    setTareas((anteriores) =>
      anteriores.map((tarea) => (tarea.id === id ? { ...tarea, ...cambios } : tarea)),
    )
  }

  function eliminarTarea(id) {
    setTareas((anteriores) => anteriores.filter((tarea) => tarea.id !== id))
  }

  function cambiarEstadoTarea(id, completada) {
    setTareas((anteriores) =>
      anteriores.map((tarea) => (tarea.id === id ? { ...tarea, completada } : tarea)),
    )
  }

  // Si están todas completas las vuelve pendientes; si no, las completa todas.
  function alternarEstadoTodas() {
    setTareas((anteriores) => {
      const todasCompletas = anteriores.length > 0 && anteriores.every((tarea) => tarea.completada)
      return anteriores.map((tarea) => ({ ...tarea, completada: !todasCompletas }))
    })
  }

  function buscarTarea(id) {
    return tareas.find((tarea) => tarea.id === Number(id))
  }

  const valor = {
    tareas,
    agregarTarea,
    editarTarea,
    eliminarTarea,
    cambiarEstadoTarea,
    alternarEstadoTodas,
    buscarTarea,
  }

  return <TareasContext.Provider value={valor}>{children}</TareasContext.Provider>
}

export function useTareas() {
  const contexto = useContext(TareasContext)
  if (!contexto) throw new Error('useTareas tiene que usarse dentro de un TareasProvider')
  return contexto
}
