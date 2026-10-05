import Aparecer from './Aparecer'
import Subseccion from './Subseccion'

export default function Experiencia({ experiencias }) {
  return (
    <Subseccion titulo="Experiencia">
      <ol className="linea-tiempo">
        {experiencias.map((e, i) => (
          <Aparecer as="li" key={`${e.rol}-${i}`} orden={i} className="hito">
            <span className="hito-periodo">{e.periodo}</span>
            <div className="hito-cuerpo">
              <h3 className="tarjeta-titulo">{e.rol}</h3>
              <p className="hito-lugar">{e.lugar}</p>
              <p className="texto-secundario">{e.descripcion}</p>
            </div>
          </Aparecer>
        ))}
      </ol>
    </Subseccion>
  )
}
