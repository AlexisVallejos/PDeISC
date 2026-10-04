// Ejercicio 2: tarjeta de presentación. Todos los datos llegan por props.
import './TarjetaPresentacion.css'

// Las props se reciben como un objeto; las "desestructuro" para usarlas directo.
function TarjetaPresentacion({ nombre, apellido, profesion, imagen }) {
  return (
    <article className="tarjeta-presentacion">
      <img
        className="tarjeta-presentacion__imagen"
        src={imagen}
        alt={`Foto de ${nombre} ${apellido}`}
        width="96"
        height="96"
      />
      <h3 className="tarjeta-presentacion__nombre">
        {nombre} {apellido}
      </h3>
      <p className="tarjeta-presentacion__profesion">{profesion}</p>
    </article>
  )
}

export default TarjetaPresentacion
