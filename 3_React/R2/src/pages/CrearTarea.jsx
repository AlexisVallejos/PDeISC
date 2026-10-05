import { useNavigate } from 'react-router-dom'
import EnlaceVolver from '../components/EnlaceVolver'
import FormularioTarea from '../components/FormularioTarea'
import { useTareas } from '../context/TareasContext'
import { useTituloPagina } from '../hooks/useTituloPagina'

export default function CrearTarea() {
  const { agregarTarea } = useTareas()
  const navegar = useNavigate()
  useTituloPagina('Nueva tarea')

  function crear(datos) {
    const nueva = agregarTarea(datos)
    navegar(`/tareas/${nueva.id}`, { replace: true })
  }

  return (
    <div className="pagina pagina-angosta">
      <EnlaceVolver />
      <header className="encabezado-pagina">
        <h1 className="titulo-grande">Nueva tarea</h1>
        <p className="subtitulo">Completá los datos para agregarla a tu lista.</p>
      </header>
      <FormularioTarea
        onGuardar={crear}
        onCancelar={() => navegar('/')}
        textoBoton="Crear tarea"
        mostrarEstado={false}
      />
    </div>
  )
}
