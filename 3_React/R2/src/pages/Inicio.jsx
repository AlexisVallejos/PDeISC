import { CheckCheck, Plus, RotateCcw, Search, Sparkles, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import ControlSegmentado from '../components/ControlSegmentado'
import FilaTarea from '../components/FilaTarea'
import { useTareas } from '../context/TareasContext'
import { useTituloPagina } from '../hooks/useTituloPagina'
import { leerFiltro } from '../utils/filtros'

const ENCABEZADOS = {
  todas: { etiqueta: 'Tu lista', titulo: 'Tus tareas' },
  pendientes: { etiqueta: 'Por hacer', titulo: 'Pendientes' },
  completadas: { etiqueta: 'Ya hechas', titulo: 'Completadas' },
}

export default function Inicio() {
  const { tareas, alternarEstadoTodas } = useTareas()
  const [parametros, setParametros] = useSearchParams()
  const [busqueda, setBusqueda] = useState('')
  const filtro = leerFiltro(parametros)

  const completas = tareas.filter((tarea) => tarea.completada).length
  const pendientes = tareas.length - completas
  const porcentaje = tareas.length ? Math.round((completas / tareas.length) * 100) : 0
  const todasCompletas = tareas.length > 0 && pendientes === 0

  useTituloPagina(ENCABEZADOS[filtro].titulo)

  const visibles = useMemo(() => {
    const texto = busqueda.trim().toLocaleLowerCase('es')
    return tareas.filter((tarea) => {
      const coincideEstado =
        filtro === 'todas' ||
        (filtro === 'pendientes' && !tarea.completada) ||
        (filtro === 'completadas' && tarea.completada)
      const coincideTexto =
        !texto || `${tarea.titulo} ${tarea.descripcion}`.toLocaleLowerCase('es').includes(texto)
      return coincideEstado && coincideTexto
    })
  }, [busqueda, filtro, tareas])

  function cambiarFiltro(nuevo) {
    const siguientes = new URLSearchParams(parametros)
    siguientes.set('estado', nuevo)
    setParametros(siguientes, { replace: true })
  }

  return (
    <section className="pagina inicio-pagina">
      <header className="encabezado-inicio">
        <div className="titular-inicio">
          <p className="sobretitulo">Tu espacio, a tu ritmo</p>
          <h1 className="titulo-grande">Un día a la vez.</h1>
          <p className="subtitulo">Tareas claras, una mente más tranquila.</p>
        </div>

        <ResumenAvance total={tareas.length} completas={completas} pendientes={pendientes} porcentaje={porcentaje} />
      </header>

      <div className="barra-lista">
        <ControlSegmentado
          nombre="filtro"
          etiqueta="Filtrar tareas"
          valor={filtro}
          onCambiar={cambiarFiltro}
          opciones={[
            { valor: 'todas', texto: 'Todas', cantidad: tareas.length },
            { valor: 'pendientes', texto: 'Pendientes', cantidad: pendientes },
            { valor: 'completadas', texto: 'Completadas', cantidad: completas },
          ]}
        />

        <label className="campo-busqueda">
          <Search size={16} strokeWidth={2.4} aria-hidden="true" />
          <span className="solo-lectores">Buscar tareas</span>
          <input
            type="search"
            value={busqueda}
            onChange={(evento) => setBusqueda(evento.target.value)}
            onKeyDown={(evento) => evento.key === 'Escape' && setBusqueda('')}
            placeholder="Buscar"
            aria-label="Buscar por título o descripción"
          />
          {busqueda && (
            <button type="button" className="limpiar-busqueda" onClick={() => setBusqueda('')} aria-label="Limpiar búsqueda">
              <X size={12} strokeWidth={3} />
            </button>
          )}
        </label>
      </div>

      <div className="titulo-lista">
        <div>
          <p className="sobretitulo">{ENCABEZADOS[filtro].etiqueta}</p>
          <h2>{ENCABEZADOS[filtro].titulo}</h2>
        </div>
        <div className="acciones-lista">
          {tareas.length > 0 && (
            <button type="button" className="boton boton-gris boton-chico" onClick={alternarEstadoTodas}>
              {todasCompletas ? <RotateCcw size={15} strokeWidth={2.4} /> : <CheckCheck size={16} strokeWidth={2.4} />}
              <span>{todasCompletas ? 'Desmarcar todas' : 'Completar todas'}</span>
            </button>
          )}
          <Link to="/crear" className="boton boton-relleno boton-chico">
            <Plus size={16} strokeWidth={2.6} />
            <span>Nueva tarea</span>
          </Link>
        </div>
      </div>

      {busqueda && visibles.length > 0 && (
        <p className="resultado-busqueda" aria-live="polite">
          {visibles.length === 1 ? '1 resultado' : `${visibles.length} resultados`} para “{busqueda.trim()}”
        </p>
      )}

      {visibles.length ? (
        <ul className="lista-tareas">
          {visibles.map((tarea) => (
            <FilaTarea key={tarea.id} tarea={tarea} />
          ))}
        </ul>
      ) : (
        <EstadoVacio
          busqueda={busqueda}
          sinTareas={tareas.length === 0}
          filtro={filtro}
          onLimpiar={() => setBusqueda('')}
        />
      )}

      <footer className="pie-inicio">Tus tareas se guardan automáticamente en este dispositivo.</footer>
    </section>
  )
}

// Anillo de progreso al estilo de los anillos de Actividad.
function ResumenAvance({ total, completas, pendientes, porcentaje }) {
  const radio = 34
  const circunferencia = 2 * Math.PI * radio

  return (
    <aside className="resumen-avance" aria-label="Resumen del progreso de tus tareas">
      <div
        className="anillo-avance"
        role="progressbar"
        aria-valuenow={porcentaje}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Tareas completadas"
      >
        <svg viewBox="0 0 80 80" aria-hidden="true">
          <circle className="anillo-fondo" cx="40" cy="40" r={radio} />
          <circle
            className="anillo-relleno"
            cx="40"
            cy="40"
            r={radio}
            strokeDasharray={circunferencia}
            strokeDashoffset={circunferencia * (1 - porcentaje / 100)}
          />
        </svg>
        <span className="anillo-porcentaje">
          {porcentaje}
          <small>%</small>
        </span>
      </div>
      <div className="resumen-texto">
        <p className="resumen-titulo">Tu avance</p>
        <p className="resumen-detalle">
          {total === 0
            ? 'Cuando empieces, vas a ver tu progreso acá.'
            : pendientes === 0
              ? '¡Terminaste todo! Buen trabajo.'
              : `${completas} de ${total} ${total === 1 ? 'tarea completada' : 'tareas completadas'}`}
        </p>
        {total > 0 && (
          <div className="resumen-contadores">
            <span className="contador-hecho">
              {completas} {completas === 1 ? 'completa' : 'completas'}
            </span>
            <span className="contador-pendiente">
              {pendientes} {pendientes === 1 ? 'pendiente' : 'pendientes'}
            </span>
          </div>
        )}
      </div>
    </aside>
  )
}

function EstadoVacio({ busqueda, sinTareas, filtro, onLimpiar }) {
  let titulo = 'No hay tareas en esta lista'
  let texto = 'Cuando agregues o cambies una tarea, va a aparecer acá.'
  if (busqueda) {
    titulo = 'No encontramos coincidencias'
    texto = `Nada coincide con “${busqueda.trim()}”. Probá con otra palabra o limpiá la búsqueda.`
  } else if (sinTareas) {
    titulo = 'Empezá con una tarea'
    texto = 'Anotá eso que tenés en mente y avanzá de a poco.'
  } else if (filtro === 'pendientes') {
    titulo = 'No te queda nada pendiente'
    texto = 'Todo lo que anotaste ya está hecho.'
  } else if (filtro === 'completadas') {
    titulo = 'Todavía no completaste ninguna'
    texto = 'Tocá el círculo de una tarea para marcarla como hecha.'
  }

  return (
    <div className="estado-vacio" aria-live="polite">
      <span className="icono-vacio">
        <Sparkles size={22} />
      </span>
      <h3>{titulo}</h3>
      <p>{texto}</p>
      {busqueda ? (
        <button type="button" className="boton boton-gris" onClick={onLimpiar}>
          Limpiar búsqueda
        </button>
      ) : sinTareas ? (
        <Link to="/crear" className="boton boton-relleno">
          <Plus size={16} strokeWidth={2.6} />
          <span>Crear primera tarea</span>
        </Link>
      ) : null}
    </div>
  )
}
