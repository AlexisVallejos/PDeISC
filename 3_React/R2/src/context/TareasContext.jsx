import { createContext, useContext } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import tareasIniciales from "../data/tareas";
import { obtenerFechaHoy } from "../utils/fecha";

// contexto para compartir las tareas entre todas las paginas
// asi no tengo que pasar props para todos lados
const TareasContext = createContext(null);

export function TareasProvider({ children }) {
  // el estado real de las tareas vive aca, y se sincroniza solo con localStorage
  const [tareas, setTareas] = useLocalStorage("tareas", tareasIniciales);

  // agrega una tarea nueva al array, generando el id y la fecha automaticamente
  function agregarTarea({ titulo, descripcion, completada }) {
    const idNuevo =
      tareas.length > 0 ? Math.max(...tareas.map((t) => t.id)) + 1 : 1;

    const tareaNueva = {
      id: idNuevo,
      titulo: titulo.trim(),
      descripcion: descripcion.trim(),
      completada,
      fechaCreacion: obtenerFechaHoy(),
    };

    setTareas((prev) => [...prev, tareaNueva]);
    return tareaNueva;
  }

  // actualiza los datos de una tarea existente (se usa desde el modo edicion)
  function editarTarea(id, datosNuevos) {
    setTareas((prev) =>
      prev.map((tarea) =>
        tarea.id === id ? { ...tarea, ...datosNuevos } : tarea
      )
    );
  }

  // elimina una tarea del array segun su id
  function eliminarTarea(id) {
    setTareas((prev) => prev.filter((tarea) => tarea.id !== id));
  }

  // cambia el estado de una tarea individual y lo conserva en localStorage
  function cambiarEstadoTarea(id, completada) {
    setTareas((prev) =>
      prev.map((tarea) =>
        tarea.id === id ? { ...tarea, completada } : tarea
      )
    );
  }

  // completa todas o vuelve incompletas todas las tareas, según el estado actual
  function alternarEstadoTodas() {
    setTareas((prev) => {
      const todasCompletadas = prev.length > 0 && prev.every((tarea) => tarea.completada);
      return prev.map((tarea) => ({ ...tarea, completada: !todasCompletadas }));
    });
  }

  // busca una tarea puntual por id, la usa la pagina de detalle
  function buscarTarea(id) {
    return tareas.find((tarea) => tarea.id === Number(id));
  }

  const valor = {
    tareas,
    agregarTarea,
    editarTarea,
    eliminarTarea,
    cambiarEstadoTarea,
    alternarEstadoTodas,
    buscarTarea,
  };

  return (
    <TareasContext.Provider value={valor}>{children}</TareasContext.Provider>
  );
}

// hook para usar el contexto mas facil desde cualquier componente
export function useTareas() {
  const contexto = useContext(TareasContext);
  if (!contexto) {
    throw new Error("useTareas tiene que usarse dentro de un TareasProvider");
  }
  return contexto;
}
