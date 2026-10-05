import { Github, Linkedin, Mail, MapPin } from 'lucide-react'
import Aparecer from './Aparecer'
import Foto from './Foto'
import Seccion from './Seccion'

export default function SobreMi({ perfil, children }) {
  const enlaces = [
    perfil.github && { href: perfil.github, texto: 'GitHub', Icono: Github },
    perfil.linkedin && { href: perfil.linkedin, texto: 'LinkedIn', Icono: Linkedin },
    perfil.email && { href: `mailto:${perfil.email}`, texto: perfil.email, Icono: Mail },
  ].filter(Boolean)

  return (
    <Seccion id="sobre-mi" sobretitulo="Sobre mí" titulo={`Hola, soy ${perfil.nombre.split(" ")[0]}.`}>
      <div className="sobre-mi">
        <Aparecer className="sobre-mi-foto">
          <Foto src={perfil.foto} nombre={perfil.nombre} className="foto--grande" />
        </Aparecer>
        <Aparecer orden={1} className="sobre-mi-texto">
          <p className="texto-destacado">{perfil.bio}</p>
          <dl className="datos">
            <div>
              <dt>Rol</dt>
              <dd>{perfil.rol}</dd>
            </div>
            <div>
              <dt>Ubicación</dt>
              <dd>
                <MapPin size={15} aria-hidden="true" /> {perfil.ubicacion}
              </dd>
            </div>
            <div>
              <dt>Estado</dt>
              <dd>
                <span className={perfil.disponible ? 'punto punto--verde' : 'punto'} aria-hidden="true" />
                {perfil.disponible ? 'Disponible' : 'Ocupado'}
              </dd>
            </div>
          </dl>
          {enlaces.length > 0 && (
            <div className="enlaces-sociales">
              {enlaces.map(({ href, texto, Icono }) => (
                <a key={href} className="chip-enlace" href={href} target="_blank" rel="noreferrer">
                  <Icono size={16} aria-hidden="true" />
                  {texto}
                </a>
              ))}
            </div>
          )}
        </Aparecer>
      </div>
      {children}
    </Seccion>
  )
}
