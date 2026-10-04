import { useState } from "react";
import {
  validarTitulo,
  validarDescripcion,
  TITULO_MAX,
  DESCRIPCION_MAX,
} from "../utils/validaciones";

// formulario que se usa tanto para crear una tarea como para editarla
// recibe los valores iniciales y una funcion que se ejecuta al confirmar
function FormularioTarea({
  valoresIniciales,
  onGuardar,
  textoBoton,
  mostrarEstado = true,
}) {
  const [titulo, setTitulo] = useState(valoresIniciales?.titulo || "");
  const [descripcion, setDescripcion] = useState(
    valoresIniciales?.descripcion || ""
  );
  const [completada, setCompletada] = useState(
    valoresIniciales?.completada || false
  );

  // guardo los errores y tambien si el campo ya fue tocado
  // asi el error solo aparece despues de que el usuario interactuo
  const [errores, setErrores] = useState({ titulo: "", descripcion: "" });
  const [tocado, setTocado] = useState({ titulo: false, descripcion: false });

  function manejarCambioTitulo(valor) {
    setTitulo(valor);
    if (tocado.titulo) {
      setErrores((prev) => ({ ...prev, titulo: validarTitulo(valor) }));
    }
  }

  function manejarCambioDescripcion(valor) {
    setDescripcion(valor);
    if (tocado.descripcion) {
      setErrores((prev) => ({
        ...prev,
        descripcion: validarDescripcion(valor),
      }));
    }
  }

  function manejarBlurTitulo() {
    setTocado((prev) => ({ ...prev, titulo: true }));
    setErrores((prev) => ({ ...prev, titulo: validarTitulo(titulo) }));
  }

  function manejarBlurDescripcion() {
    setTocado((prev) => ({ ...prev, descripcion: true }));
    setErrores((prev) => ({
      ...prev,
      descripcion: validarDescripcion(descripcion),
    }));
  }

  function manejarEnvio(evento) {
    evento.preventDefault();

    // valido todo de nuevo antes de enviar, por si el usuario nunca toco un campo
    const errorTitulo = validarTitulo(titulo);
    const errorDescripcion = validarDescripcion(descripcion);

    setErrores({ titulo: errorTitulo, descripcion: errorDescripcion });
    setTocado({ titulo: true, descripcion: true });

    // si hay algun error no dejo mandar el formulario
    if (errorTitulo || errorDescripcion) {
      return;
    }

    onGuardar({
      titulo: titulo.trim(),
      descripcion: descripcion.trim(),
      completada: mostrarEstado ? completada : false,
    });
  }

  return (
    <form onSubmit={manejarEnvio} noValidate>
      <div className="mb-3">
        <label htmlFor="campoTitulo" className="form-label">
          Titulo
        </label>
        <input
          id="campoTitulo"
          type="text"
          className={`form-control ${errores.titulo ? "es-invalido" : ""}`}
          placeholder="Ej: Terminar la guia de ejercicios"
          value={titulo}
          maxLength={TITULO_MAX}
          required
          minLength={3}
          onChange={(e) => manejarCambioTitulo(e.target.value)}
          onBlur={manejarBlurTitulo}
        />
        {errores.titulo && <p className="mensaje-error">{errores.titulo}</p>}
      </div>

      <div className="mb-3">
        <label htmlFor="campoDescripcion" className="form-label">
          Descripcion
        </label>
        <textarea
          id="campoDescripcion"
          className={`form-control ${
            errores.descripcion ? "es-invalido" : ""
          }`}
          placeholder="Contá con un poco mas de detalle de que se trata la tarea"
          rows={4}
          value={descripcion}
          maxLength={DESCRIPCION_MAX}
          required
          minLength={10}
          onChange={(e) => manejarCambioDescripcion(e.target.value)}
          onBlur={manejarBlurDescripcion}
        />
        {errores.descripcion && (
          <p className="mensaje-error">{errores.descripcion}</p>
        )}
      </div>

      {mostrarEstado && (
        <div className="mb-4">
          <label className="form-label d-block">Estado</label>
          <div className="selector-estado">
            <label
              className={`opcion-estado ${!completada ? "activa" : ""}`}
            >
              <input
                type="radio"
                name="estado"
                checked={!completada}
                onChange={() => setCompletada(false)}
              />
              Incompleta
            </label>
            <label className={`opcion-estado ${completada ? "activa" : ""}`}>
              <input
                type="radio"
                name="estado"
                checked={completada}
                onChange={() => setCompletada(true)}
              />
              Completa
            </label>
          </div>
        </div>
      )}

      <button type="submit" className="btn btn-acento w-100">
        {textoBoton}
      </button>
    </form>
  );
}

export default FormularioTarea;
