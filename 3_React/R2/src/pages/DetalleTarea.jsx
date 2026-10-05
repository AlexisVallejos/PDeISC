import { CalendarDays, CircleCheck, Pencil, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import CasillaCompletar from '../components/CasillaCompletar'
import EnlaceVolver from '../components/EnlaceVolver'
import FormularioTarea from '../components/FormularioTarea'
import ModalEliminar from '../components/ModalEliminar'
import { useTareas } from '../context/TareasContext'
import { useTituloPagina } from '../hooks/useTituloPagina'

export default function DetalleTarea() {
  const { id } = useParams()
  const navegar = useNavigate()
  const { buscarTarea, editarTarea, eliminarTarea, cambiarEstadoTarea } = useTareas()
  const [editando, setEditando] = useState(false)
  const [confirmando, setConfirmando] = useState(false)
  const [guardado, setGuardado] = useState(false)
  const tarea = buscarTarea(id)

  useTituloPagina(tarea ? (editando ? 'Editar tarea' : tarea.titulo) : 'Tarea no encontrada')

  // El aviso de "Cambios guardados" se va solo.
  useEffect(() => {
    if (!guardado) return
    const temporizador = setTimeout(() => setGuardado(false), 2600)
    return () => clearTimeout(temporizador)
  }, [guardado])

  if (!tarea) {
    return (
      <div className="pagina">
        <EnlaceVolver />
        <div className="estado-vacio">
          <h1 className="titulo-mediano">No encontramos esa tarea</h1>
          <p>Puede que ya haya sido eliminada o que el link esté mal.</p>
          <Link to="/" className="boton boton-relleno">
            Volver al inicio
          </Link>
        </div>
      </div>
    )
  }

  function guardarCambios(cambios) {
    editarTarea(tarea.id, cambios)
    setEditando(false)
    setGuardado(true)
  }

  function confirmarEliminacion() {
    eliminarTarea(tarea.id)
    navegar('/', { replace: true })
  }

  if (editando) {
    return (
      <div className="pagina pagina-angosta">
        <header className="encabezado-pagina">
          <h1 className="titulo-grande">Editar tarea</h1>
          <p className="subtitulo">Los cambios se guardan al tocar “Guardar cambios”.</p>
        </header>
        <FormularioTarea
          valoresIniciales={tarea}
          onGuardar={guardarCambios}
          onCancelar={() => setEditando(false)}
          textoBoton="Guardar cambios"
        />
      </div>
    )
  }

  return (
    <div className="pagina pagina-angosta">
      <EnlaceVolver />

      <article className={`tarjeta-detalle ${tarea.completada ? 'detalle-completado' : ''}`}>
        <div className="detalle-cabecera">
          <CasillaCompletar
            tamano="grande"
            completada={tarea.completada}
            onCambiar={() => cambiarEstadoTarea(tarea.id, !tarea.completada)}
          />
          <div>
            <h1 className="titulo-detalle">{tarea.titulo}</h1>
            <p className="meta-detalle">
              <span className={`pildora-estado ${tarea.completada ? 'pildora-hecha' : 'pildora-pendiente'}`}>
                {tarea.completada ? 'Completa' : 'Pendiente'}
              </span>
              <span className="fecha-fila">
                <CalendarDays size={14} strokeWidth={2} aria-hidden="true" />
                Creada el {tarea.fechaCreacion}
              </span>
            </p>
          </div>
        </div>
        <p className="descripcion-completa">{tarea.descripcion}</p>
      </article>

      <div className="grupo-celdas grupo-acciones">
        <button type="button" className="celda-accion" onClick={() => setEditando(true)}>
          <Pencil size={18} strokeWidth={2.2} aria-hidden="true" />
          Editar tarea
        </button>
        <button type="button" className="celda-accion celda-destructiva" onClick={() => setConfirmando(true)}>
          <Trash2 size={18} strokeWidth={2.2} aria-hidden="true" />
          Eliminar tarea
        </button>
      </div>

      <p className={`aviso-guardado ${guardado ? 'visible' : ''}`} role="status">
        {guardado && (
          <>
            <CircleCheck size={16} strokeWidth={2.4} aria-hidden="true" />
            Cambios guardados
          </>
        )}
      </p>

      {confirmando && (
        <ModalEliminar
          titulo={tarea.titulo}
          onConfirmar={confirmarEliminacion}
          onCancelar={() => setConfirmando(false)}
        />
      )}
    </div>
  )
}
