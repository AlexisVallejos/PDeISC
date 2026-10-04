// modal simple para confirmar antes de eliminar una tarea
// lo hice a mano en vez de usar alert/confirm como pide la consigna
function ModalEliminar({ titulo, onConfirmar, onCancelar }) {
  return (
    <div className="fondo-modal" onClick={onCancelar}>
      <div
        className="caja-modal"
        role="dialog"
        aria-modal="true"
        // freno la propagacion para que no se cierre al tocar adentro
        onClick={(e) => e.stopPropagation()}
      >
        <h3>¿Eliminar esta tarea?</h3>
        <p>
          Vas a eliminar <strong>"{titulo}"</strong>. Esta accion no se puede
          deshacer.
        </p>
        <div className="acciones-modal">
          <button className="btn btn-outline-acento" onClick={onCancelar}>
            Cancelar
          </button>
          <button className="btn btn-peligro-suave" onClick={onConfirmar}>
            Si, eliminar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalEliminar;
