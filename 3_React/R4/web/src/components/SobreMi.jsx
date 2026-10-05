import { ArrowUpRight, Github, Linkedin, Mail, MapPin } from 'lucide-react'
import { useAparecer } from '../hooks/useAparecer'
import { useHora } from '../hooks/useHora'
import { conEnfasis, primerNombre } from '../utils/texto'
import Aparecer from './Aparecer'
import { Contador } from './Estadisticas'
import Foto from './Foto'
import Habilidades from './Habilidades'
import Seccion from './Seccion'

// Hora local que se muestra en la tarjeta de ubicación.
const ZONA_HORARIA = 'America/Argentina/Buenos_Aires'

// Sobre mí como una grilla "bento" (las grillas de funciones de apple.com): cada tarjeta
// cuenta una sola cosa. En escritorio son 12 columnas; con grid-auto-flow: dense las tarjetas
// llenan los huecos aunque cambie la cantidad de logros en la base.
export default function SobreMi({ perfil, habilidades, logros }) {
  const primeros = logros.slice(0, 2)
  const resto = logros.slice(2)

  return (
    <Seccion id="sobre-mi" sobretitulo="Sobre mí" titulo={`Hola, soy *${primerNombre(perfil.nombre)}*.`}>
      <div className="bento">
        <Aparecer className="tile tile--retrato">
          <Foto src={perfil.foto} nombre={perfil.nombre} className="foto--retrato" />
          <div className="retrato-pie">
            {perfil.disponible && (
              <p className="insignia insignia--clara">
                <span className="insignia-punto insignia-punto--verde" aria-hidden="true" />
                Disponible
              </p>
            )}
            <p className="retrato-nombre">{perfil.nombre}</p>
            <p className="retrato-rol">{perfil.rol}</p>
          </div>
        </Aparecer>

        <Aparecer orden={1} className="tile tile--bio">
          <p className="tile-etiqueta">Quién soy</p>
          <p className="bio-texto">{perfil.bio}</p>
          <Enlaces perfil={perfil} />
        </Aparecer>

        {primeros.map((l, i) => (
          <TileLogro key={l.titulo} logro={l} orden={i + 2} variante={i === 0 ? 'oscuro' : ''} />
        ))}

        <TileUbicacion ubicacion={perfil.ubicacion} />

        {resto.map((l, i) => (
          <TileLogro key={l.titulo} logro={l} orden={i + 5} variante={i === 1 ? 'arena' : ''} />
        ))}

        <Aparecer orden={2} className="tile tile--habilidades">
          <Habilidades habilidades={habilidades} />
        </Aparecer>

        <Aparecer orden={3} className="tile tile--cta">
          <p className="tile-etiqueta">Próximo paso</p>
          <p className="cta-titulo">{conEnfasis('¿Tenés un proyecto en *mente*?')}</p>
          <a className="boton boton--claro" href="#contacto">
            Hablemos <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </Aparecer>
      </div>
    </Seccion>
  )
}

function Enlaces({ perfil }) {
  const enlaces = [
    perfil.github && { href: perfil.github, texto: 'GitHub', Icono: Github },
    perfil.linkedin && { href: perfil.linkedin, texto: 'LinkedIn', Icono: Linkedin },
    perfil.email && { href: `mailto:${perfil.email}`, texto: perfil.email, Icono: Mail },
  ].filter(Boolean)
  if (!enlaces.length) return null

  return (
    <div className="bio-enlaces">
      {enlaces.map(({ href, texto, Icono }) => (
        <a key={href} className="boton boton--contorno boton--chico" href={href} target="_blank" rel="noreferrer">
          <Icono size={15} aria-hidden="true" />
          {texto}
        </a>
      ))}
    </div>
  )
}

// Cada logro en su tarjeta; si el valor es un número ("20+"), cuenta desde 0 al aparecer.
function TileLogro({ logro, orden, variante }) {
  const [ref, visible] = useAparecer()
  return (
    <div
      ref={ref}
      className={`aparecer tile tile--logro ${variante ? `tile--${variante}` : ''} ${visible ? 'es-visible' : ''}`}
      style={{ '--retardo': `${Math.min(orden, 8) * 60}ms` }}
    >
      <p className="logro-valor">
        <Contador valor={logro.valor} activo={visible} />
      </p>
      <div>
        <h3 className="logro-titulo">{logro.titulo}</h3>
        <p className="logro-detalle">{logro.detalle}</p>
      </div>
    </div>
  )
}

function TileUbicacion({ ubicacion }) {
  const { hora, zona } = useHora(ZONA_HORARIA)
  return (
    <Aparecer orden={4} className="tile tile--ubicacion">
      <div className="ubicacion-mapa" aria-hidden="true">
        <span className="ubicacion-pin" />
      </div>
      <p className="tile-etiqueta">
        <MapPin size={13} aria-hidden="true" /> Desde {ubicacion}
      </p>
      <p className="ubicacion-hora">
        <time>{hora}</time>
      </p>
      <p className="ubicacion-zona">Hora local · {zona}</p>
    </Aparecer>
  )
}
