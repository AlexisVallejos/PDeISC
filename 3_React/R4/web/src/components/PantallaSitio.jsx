import { ArrowUpRight, Play } from 'lucide-react'
import { primerNombre } from '../utils/texto'
import Foto from './Foto'

// Mini versión del sitio que se "enciende" en la pantalla de la MacBook al final de la apertura.
// Se diseña a 1000×677 px (la proporción de la pantalla) y HeroMacbook la deforma con matrix3d
// para que calce en las cuatro esquinas de la pantalla de cada fotograma. Es decorativa: el
// contenido real está en la página.
export const ANCHO_PANTALLA = 1000
export const ALTO_PANTALLA = 677

export default function PantallaSitio({ perfil, refPantalla }) {
  const [primera, ...resto] = perfil.rol.split(' ')

  return (
    <div className="pantalla-sitio" ref={refPantalla} aria-hidden="true">
      <div className="ps-haz" />
      <Foto src={perfil.foto} nombre={perfil.nombre} className="ps-foto" />
      <div className="ps-barra">
        <span className="ps-marca">
          {primerNombre(perfil.nombre)}
          <i />
        </span>
        <span className="ps-enlaces">
          <b>Inicio</b>
          <span>Proyectos</span>
          <span>Sobre mí</span>
          <span>Contacto</span>
        </span>
        <span className="ps-boton-chico">
          Hablemos <ArrowUpRight size={12} />
        </span>
      </div>
      <div className="ps-contenido">
        <p className="ps-saludo">Hola, soy</p>
        <p className="ps-nombre">{primerNombre(perfil.nombre)}</p>
        <p className="ps-rol">
          {primera}
          <br />
          {resto.join(' ')}
        </p>
        <p className="ps-texto">Diseño y programo productos digitales que la gente disfruta usar.</p>
        <span className="ps-boton">
          <span className="ps-play">
            <Play size={12} fill="currentColor" />
          </span>
          Ver proyectos
        </span>
      </div>
      <p className="ps-firma">
        Diseñar
        <br />
        Programar
        <br />
        Publicar
      </p>
      <div className="ps-notch" />
    </div>
  )
}
