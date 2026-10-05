import Aparecer from './Aparecer'
import LineaTiempo from './LineaTiempo'
import Seccion from './Seccion'
import TarjetaResenas from './TarjetaResenas'

export default function Experiencia({ experiencias, habilidades, resenas }) {
  return (
    <Seccion id="experiencia" sobretitulo="Experiencia" titulo="Un recorrido por diseño, código y *curiosidad*." lateral>
      <div className="experiencia">
        <LineaTiempo experiencias={experiencias} />
        <Aparecer orden={1}>
          <TarjetaResenas habilidades={habilidades} resenas={resenas} />
        </Aparecer>
      </div>
    </Seccion>
  )
}
