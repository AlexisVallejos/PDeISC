import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Check, Search, Sparkles } from "lucide-react";
import { useTareas } from "../context/TareasContext";
import TareaCard from "../components/TareaCard";

// pagina principal con resumen, filtros y busqueda de tareas
function Inicio() {
  const { tareas } = useTareas();
  const [parametros, setParametros] = useSearchParams();
  const [busqueda, setBusqueda] = useState("");
  const filtro = parametros.get("estado") || "todas";
  const cantidadCompletas = tareas.filter((tarea) => tarea.completada).length;
  const cantidadPendientes = tareas.length - cantidadCompletas;
  const avance = tareas.length ? Math.round((cantidadCompletas / tareas.length) * 100) : 0;
  const pestanas = [
    { id: "todas", texto: "Todas", cantidad: tareas.length },
    { id: "pendientes", texto: "Pendientes", cantidad: cantidadPendientes },
    { id: "completadas", texto: "Completadas", cantidad: cantidadCompletas },
  ];

  const tareasFiltradas = useMemo(() => {
    const consulta = busqueda.trim().toLocaleLowerCase("es");
    return tareas.filter((tarea) => {
      const coincideEstado = filtro === "todas"
        || (filtro === "pendientes" && !tarea.completada)
        || (filtro === "completadas" && tarea.completada);
      const coincideTexto = !consulta
        || `${tarea.titulo} ${tarea.descripcion}`.toLocaleLowerCase("es").includes(consulta);
      return coincideEstado && coincideTexto;
    });
  }, [busqueda, filtro, tareas]);

  // cambia el filtro sin borrar otros parametros de la pagina
  function cambiarFiltro(id) {
    const nuevosParametros = new URLSearchParams(parametros);
    nuevosParametros.set("estado", id);
    setParametros(nuevosParametros);
  }

  return (
    <section className="inicio-pagina">
      <header className="encabezado-inicio">
        <div className="titular-inicio">
          <p className="fecha-contexto">TU ESPACIO, A TU RITMO</p>
          <h1>Un día a la vez.</h1>
          <p className="subtitulo-inicio">Tareas claras, una mente más tranquila.</p>
        </div>

        <aside className="resumen-avance" aria-label="Resumen del progreso de tus tareas">
          <div className="resumen-titulo">
            <span>Tu avance</span>
            <span>{cantidadCompletas} de {tareas.length}</span>
          </div>
          <div className="barra-avance" role="progressbar" aria-valuenow={avance} aria-valuemin="0" aria-valuemax="100" aria-label="Tareas completadas">
            <span style={{ width: `${avance}%` }} />
          </div>
          <p>{tareas.length === 0 ? "Cuando empieces, vas a ver tu progreso acá." : `${avance}% de tus tareas completadas`}</p>
          <div className="resumen-contadores">
            <span><Check size={14} /> {cantidadCompletas} completas</span>
            <span>{cantidadPendientes} pendientes</span>
          </div>
        </aside>
      </header>

      <div className="barra-lista">
        <div className="pestanas-tareas" role="tablist" aria-label="Filtrar tareas">
          {pestanas.map((pestana) => (
            <button
              key={pestana.id}
              type="button"
              role="tab"
              aria-selected={filtro === pestana.id}
              className={`pestana-tarea ${filtro === pestana.id ? "seleccionada" : ""}`}
              onClick={() => cambiarFiltro(pestana.id)}
            >
              {pestana.texto}<span>{pestana.cantidad}</span>
            </button>
          ))}
        </div>

        <label className="busqueda-tareas">
          <Search size={17} aria-hidden="true" />
          <span className="visually-hidden">Buscar tareas</span>
          <input
            type="search"
            value={busqueda}
            onChange={(evento) => setBusqueda(evento.target.value)}
            placeholder="Buscar tareas..."
            aria-label="Buscar por título o descripción"
          />
          {busqueda && <button type="button" onClick={() => setBusqueda("")} aria-label="Limpiar búsqueda">×</button>}
        </label>
      </div>

      <div className="titulo-lista">
        <div>
          <p className="etiqueta-seccion">{filtro === "todas" ? "TU LISTA" : filtro === "pendientes" ? "POR HACER" : "YA HECHAS"}</p>
          <h2>{filtro === "todas" ? "Tus tareas" : filtro === "pendientes" ? "Pendientes" : "Completadas"}</h2>
        </div>
        <Link to="/crear" className="boton-nueva-tarea">+ <span>Nueva tarea</span></Link>
      </div>

      {tareasFiltradas.length ? (
        <div className="lista-tareas" aria-live="polite">
          {tareasFiltradas.map((tarea) => <TareaCard key={tarea.id} tarea={tarea} />)}
        </div>
      ) : (
        <div className="estado-vacio">
          <span className="icono-vacio"><Sparkles size={22} /></span>
          <h3>{busqueda ? "No encontramos coincidencias" : tareas.length === 0 ? "Empezá con una tarea" : "No hay tareas en esta lista"}</h3>
          <p>{busqueda ? "Probá con otra palabra o limpiá la búsqueda." : tareas.length === 0 ? "Anotá eso que tenés en mente y avanzá de a poco." : "Cuando agregues o cambies una tarea, va a aparecer acá."}</p>
          {busqueda ? (
            <button type="button" className="enlace-limpiar" onClick={() => setBusqueda("")}>Limpiar búsqueda</button>
          ) : tareas.length === 0 ? (
            <Link to="/crear" className="boton-nueva-tarea">+ <span>Crear primera tarea</span></Link>
          ) : null}
        </div>
      )}

      <footer className="pie-inicio">Tus tareas se guardan automáticamente en este dispositivo.</footer>
    </section>
  );
}

export default Inicio;
