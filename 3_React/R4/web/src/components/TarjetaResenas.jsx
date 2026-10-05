import { Atom, Braces, ChevronLeft, ChevronRight, Code, Database, MessageSquareQuote, Server, Star, Zap } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useReducirMovimiento } from '../hooks/useReducirMovimiento'
import DialogoResena from './DialogoResena'

// Íconos para las tecnologías principales; el resto usa un ícono genérico.
const ICONOS = [
  [/html|css/i, Code],
  [/javascript/i, Braces],
  [/react/i, Atom],
  [/node/i, Server],
  [/mysql|sql/i, Database],
]

const iniciales = (nombre) =>
  nombre
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join('')

// Tarjeta de la derecha en Experiencia: tecnologías principales y reseñas reales de quienes
// trabajaron conmigo. Las reseñas llegan desde MySQL ya aprobadas; si no hay, se invita a dejar la primera.
export default function TarjetaResenas({ habilidades, resenas }) {
  const [publicadasAhora, setPublicadasAhora] = useState([])
  const [dialogoAbierto, setDialogoAbierto] = useState(false)
  const lista = [...publicadasAhora, ...resenas]
  const tecnologias = [...habilidades].sort((a, b) => b.nivel - a.nivel).slice(0, 4)

  return (
    <div className="tarjeta-confianza">
      <p className="sobretitulo">Tecnologías que uso</p>
      <ul className="tecnologias">
        {tecnologias.map(({ nombre }) => {
          const Icono = ICONOS.find(([patron]) => patron.test(nombre))?.[1] ?? Zap
          return (
            <li key={nombre}>
              <Icono size={18} strokeWidth={2.2} aria-hidden="true" />
              {nombre.split(' · ')[0]}
            </li>
          )
        })}
      </ul>

      <div className="resenas-cabecera">
        <p className="sobretitulo">Reseñas</p>
        {lista.length > 0 && <Promedio resenas={lista} />}
      </div>

      {lista.length ? (
        <Carrusel resenas={lista} />
      ) : (
        <div className="resenas-vacio">
          <span className="resenas-vacio-icono" aria-hidden="true">
            <MessageSquareQuote size={22} />
          </span>
          <p>
            <b>Todavía no hay reseñas.</b> ¿Trabajamos juntos o usaste algo que hice? Contame qué te pareció.
          </p>
        </div>
      )}

      <button type="button" className="boton boton--contorno boton--chico resenas-boton" onClick={() => setDialogoAbierto(true)}>
        Dejar una reseña
      </button>

      <DialogoResena
        abierto={dialogoAbierto}
        alCerrar={() => setDialogoAbierto(false)}
        alPublicar={(resena) => setPublicadasAhora((actuales) => [resena, ...actuales])}
      />
    </div>
  )
}

function Promedio({ resenas }) {
  const promedio = resenas.reduce((suma, r) => suma + r.puntaje, 0) / resenas.length
  return (
    <p className="resenas-promedio">
      <Star size={13} fill="currentColor" aria-hidden="true" />
      {promedio.toFixed(1).replace('.', ',')}
      <span>
        · {resenas.length} {resenas.length === 1 ? 'reseña' : 'reseñas'}
      </span>
    </p>
  )
}

export function Estrellas({ puntaje }) {
  return (
    <span className="estrellas" role="img" aria-label={`${puntaje} de 5 estrellas`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} size={13} fill={i < puntaje ? 'currentColor' : 'none'} aria-hidden="true" />
      ))}
    </span>
  )
}

// Carrusel con scroll-snap: en el celular se desliza con el dedo con la inercia nativa,
// y las flechas, los puntos y el teclado mueven el mismo scroll.
function Carrusel({ resenas }) {
  const pistaRef = useRef(null)
  const [actual, setActual] = useState(0)
  const reducir = useReducirMovimiento()

  useEffect(() => {
    const pista = pistaRef.current
    let frame = 0
    function alScrollear() {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => setActual(Math.round(pista.scrollLeft / pista.clientWidth)))
    }
    pista.addEventListener('scroll', alScrollear, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      pista.removeEventListener('scroll', alScrollear)
    }
  }, [])

  function irA(indice) {
    const pista = pistaRef.current
    const destino = Math.max(0, Math.min(resenas.length - 1, indice))
    pista.scrollTo({ left: destino * pista.clientWidth, behavior: reducir ? 'auto' : 'smooth' })
  }

  function alPresionarTecla(evento) {
    if (evento.key === 'ArrowRight') irA(actual + 1)
    else if (evento.key === 'ArrowLeft') irA(actual - 1)
    else return
    evento.preventDefault()
  }

  const varias = resenas.length > 1

  return (
    <>
      <div
        className={varias ? 'carrusel' : 'carrusel carrusel--una'}
        role="region"
        aria-roledescription="carrusel"
        aria-label="Reseñas"
        tabIndex={varias ? 0 : undefined}
        onKeyDown={varias ? alPresionarTecla : undefined}
      >
        {varias && (
          <button type="button" className="carrusel-flecha" onClick={() => irA(actual - 1)} disabled={actual === 0} aria-label="Reseña anterior">
            <ChevronLeft size={16} />
          </button>
        )}

        <div className="carrusel-pista" ref={pistaRef}>
          {resenas.map((r, i) => (
            <figure
              key={r.id ?? `${r.nombre}-${i}`}
              className="carrusel-diapositiva"
              role="group"
              aria-roledescription="diapositiva"
              aria-label={`${i + 1} de ${resenas.length}`}
            >
              <span className="resena-avatar" aria-hidden="true">
                {iniciales(r.nombre)}
              </span>
              <div>
                <Estrellas puntaje={r.puntaje} />
                <blockquote>“{r.texto}”</blockquote>
                <figcaption>
                  <b>{r.nombre}</b>
                  {r.rol && <span>{r.rol}</span>}
                </figcaption>
              </div>
            </figure>
          ))}
        </div>

        {varias && (
          <button
            type="button"
            className="carrusel-flecha"
            onClick={() => irA(actual + 1)}
            disabled={actual === resenas.length - 1}
            aria-label="Reseña siguiente"
          >
            <ChevronRight size={16} />
          </button>
        )}
      </div>

      {varias && (
        <div className="carrusel-puntos">
          {resenas.map((r, i) => (
            <button
              key={r.id ?? `${r.nombre}-${i}`}
              type="button"
              className={i === actual ? 'es-actual' : ''}
              aria-label={`Ir a la reseña ${i + 1}`}
              aria-current={i === actual ? 'true' : undefined}
              onClick={() => irA(i)}
            />
          ))}
        </div>
      )}
    </>
  )
}
