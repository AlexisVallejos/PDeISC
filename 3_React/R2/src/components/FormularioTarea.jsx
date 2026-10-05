import { CircleAlert } from 'lucide-react'
import { useState } from 'react'
import {
  DESCRIPCION_MAX,
  DESCRIPCION_MIN,
  TITULO_MAX,
  TITULO_MIN,
  validarDescripcion,
  validarTitulo,
} from '../utils/validaciones'
import ControlSegmentado from './ControlSegmentado'

// Formulario "inset grouped": cada campo es una celda con la etiqueta arriba,
// el contador de caracteres a la derecha y el error justo debajo.
// Valida al salir del campo y, una vez tocado, mientras se escribe.
export default function FormularioTarea({ valoresIniciales, onGuardar, onCancelar, textoBoton, mostrarEstado = true }) {
  const [titulo, setTitulo] = useState(valoresIniciales?.titulo || '')
  const [descripcion, setDescripcion] = useState(valoresIniciales?.descripcion || '')
  const [completada, setCompletada] = useState(valoresIniciales?.completada || false)
  const [errores, setErrores] = useState({ titulo: '', descripcion: '' })
  const [tocados, setTocados] = useState({ titulo: false, descripcion: false })

  function cambiarTitulo(valor) {
    setTitulo(valor)
    if (tocados.titulo) setErrores((anteriores) => ({ ...anteriores, titulo: validarTitulo(valor) }))
  }

  function cambiarDescripcion(valor) {
    setDescripcion(valor)
    if (tocados.descripcion) setErrores((anteriores) => ({ ...anteriores, descripcion: validarDescripcion(valor) }))
  }

  function salirDe(campo) {
    setTocados((anteriores) => ({ ...anteriores, [campo]: true }))
    setErrores((anteriores) => ({
      ...anteriores,
      [campo]: campo === 'titulo' ? validarTitulo(titulo) : validarDescripcion(descripcion),
    }))
  }

  function enviar(evento) {
    evento.preventDefault()
    const errorTitulo = validarTitulo(titulo)
    const errorDescripcion = validarDescripcion(descripcion)
    setErrores({ titulo: errorTitulo, descripcion: errorDescripcion })
    setTocados({ titulo: true, descripcion: true })

    if (errorTitulo) return document.getElementById('campoTitulo')?.focus()
    if (errorDescripcion) return document.getElementById('campoDescripcion')?.focus()

    onGuardar({
      titulo: titulo.trim(),
      descripcion: descripcion.trim(),
      completada: mostrarEstado ? completada : false,
    })
  }

  return (
    <form className="formulario" onSubmit={enviar} noValidate>
      <div className="grupo-celdas">
        <Campo
          id="campoTitulo"
          etiqueta="Título"
          error={errores.titulo}
          largo={titulo.trim().length}
          minimo={TITULO_MIN}
          maximo={TITULO_MAX}
        >
          <input
            id="campoTitulo"
            type="text"
            placeholder="Ej: Terminar la guía de ejercicios"
            value={titulo}
            maxLength={TITULO_MAX}
            autoComplete="off"
            enterKeyHint="next"
            aria-invalid={Boolean(errores.titulo)}
            aria-describedby={errores.titulo ? 'errorTitulo' : 'contadorTitulo'}
            onChange={(evento) => cambiarTitulo(evento.target.value)}
            onBlur={() => salirDe('titulo')}
          />
        </Campo>
        <Campo
          id="campoDescripcion"
          etiqueta="Descripción"
          error={errores.descripcion}
          largo={descripcion.trim().length}
          minimo={DESCRIPCION_MIN}
          maximo={DESCRIPCION_MAX}
        >
          <textarea
            id="campoDescripcion"
            placeholder="Contá con un poco más de detalle de qué se trata la tarea"
            rows={4}
            value={descripcion}
            maxLength={DESCRIPCION_MAX}
            aria-invalid={Boolean(errores.descripcion)}
            aria-describedby={errores.descripcion ? 'errorDescripcion' : 'contadorDescripcion'}
            onChange={(evento) => cambiarDescripcion(evento.target.value)}
            onBlur={() => salirDe('descripcion')}
          />
        </Campo>
      </div>

      {mostrarEstado && (
        <div className="grupo-estado">
          <p className="etiqueta-grupo" id="etiquetaEstado">
            Estado
          </p>
          <ControlSegmentado
            nombre="estado"
            etiqueta="Estado"
            valor={completada ? 'completa' : 'incompleta'}
            onCambiar={(valor) => setCompletada(valor === 'completa')}
            opciones={[
              { valor: 'incompleta', texto: 'Incompleta' },
              { valor: 'completa', texto: 'Completa' },
            ]}
          />
        </div>
      )}

      <div className="acciones-formulario">
        {onCancelar && (
          <button type="button" className="boton boton-gris" onClick={onCancelar}>
            Cancelar
          </button>
        )}
        <button type="submit" className="boton boton-relleno">
          {textoBoton}
        </button>
      </div>
    </form>
  )
}

function Campo({ id, etiqueta, error, largo, minimo, maximo, children }) {
  const sufijo = id.replace('campo', '')
  const cerca = largo > maximo * 0.9

  return (
    <div className={`celda-campo ${error ? 'con-error' : ''}`}>
      <div className="celda-encabezado">
        <label htmlFor={id}>{etiqueta}</label>
        <span id={`contador${sufijo}`} className={`contador ${cerca ? 'contador-cerca' : ''}`}>
          {largo < minimo ? `mín. ${minimo}` : `${largo}/${maximo}`}
        </span>
      </div>
      {children}
      {error && (
        <p id={`error${sufijo}`} className="mensaje-error" role="alert">
          <CircleAlert size={14} strokeWidth={2.4} aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  )
}
