import Aparecer from './Aparecer'
import Subseccion from './Subseccion'

export default function Logros({ logros }) {
  return (
    <Subseccion titulo="Logros">
      <div className="grilla-logros">
        {logros.map((l, i) => (
          <Aparecer key={l.titulo} orden={i} className="tarjeta logro">
            <p className="logro-valor">{l.valor}</p>
            <h3 className="tarjeta-titulo">{l.titulo}</h3>
            <p className="texto-secundario">{l.detalle}</p>
          </Aparecer>
        ))}
      </div>
    </Subseccion>
  )
}
