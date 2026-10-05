// Control segmentado al estilo iOS: una pastilla que se desliza bajo la opción
// elegida. Cada opción es un radio, así funciona con teclado (flechas) sin código extra.
export default function ControlSegmentado({ nombre, etiqueta, opciones, valor, onCambiar }) {
  const indice = Math.max(
    0,
    opciones.findIndex((opcion) => opcion.valor === valor),
  )

  return (
    <div
      className="control-segmentado"
      role="radiogroup"
      aria-label={etiqueta}
      style={{ '--cantidad': opciones.length, '--indice': indice }}
    >
      <span className="control-segmentado-pastilla" aria-hidden="true" />
      {opciones.map((opcion) => (
        <label key={opcion.valor} className={`segmento ${opcion.valor === valor ? 'elegido' : ''}`}>
          <input
            type="radio"
            name={nombre}
            value={opcion.valor}
            checked={opcion.valor === valor}
            onChange={() => onCambiar(opcion.valor)}
          />
          <span>{opcion.texto}</span>
          {opcion.cantidad !== undefined && <span className="segmento-cantidad">{opcion.cantidad}</span>}
        </label>
      ))}
    </div>
  )
}
