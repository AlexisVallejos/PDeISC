import { ArrowUpRight, Github } from 'lucide-react'
import { useState } from 'react'
import Aparecer from './Aparecer'
import Mockup from './Mockup'
import Seccion from './Seccion'

const DESTACADOS = 3

export default function Proyectos({ proyectos }) {
  const [verTodos, setVerTodos] = useState(false)
  const visibles = verTodos ? proyectos : proyectos.slice(0, DESTACADOS)
  const hayMas = proyectos.length > DESTACADOS

  return (
    <Seccion
      id="proyectos"
      sobretitulo="Proyectos destacados"
      titulo="Proyectos con *impacto real*."
      descripcion="Desarrollo web, apps móviles y bases de datos: proyectos hechos de punta a punta, del servidor a la interfaz."
      accion={
        hayMas && (
          <button
            type="button"
            className="boton boton--contorno"
            aria-expanded={verTodos}
            aria-controls="grilla-proyectos"
            onClick={() => setVerTodos((v) => !v)}
          >
            {verTodos ? 'Ver menos' : 'Ver todos los proyectos'}
            <ArrowUpRight size={16} aria-hidden="true" className={verTodos ? 'flecha-girada' : ''} />
          </button>
        )
      }
    >
      <div className="grilla-proyectos" id="grilla-proyectos">
        {visibles.map((p, i) => (
          <TarjetaProyecto key={p.titulo} proyecto={p} indice={i} />
        ))}
      </div>
    </Seccion>
  )
}

const TEMAS = ['oscuro', 'arena', 'niebla']

function TarjetaProyecto({ proyecto, indice }) {
  const tema = TEMAS[indice % TEMAS.length]
  const enlace = proyecto.demo || proyecto.repo

  return (
    <Aparecer as="article" orden={indice % DESTACADOS} className="proyecto-envoltura">
      <div className={`proyecto proyecto--${tema}`}>
        <header className="proyecto-cabecera">
          <span className="proyecto-nombre">
            <span className="proyecto-logo" aria-hidden="true">
              {proyecto.titulo.slice(0, 1)}
            </span>
            {proyecto.titulo}
          </span>
          <span className="proyecto-tipo">{proyecto.tipo}</span>
        </header>

        <div className="proyecto-texto">
          <h3 className="proyecto-lema">
            {enlace ? (
              <a href={enlace} target="_blank" rel="noreferrer" className="proyecto-enlace">
                {proyecto.lema || proyecto.titulo}
              </a>
            ) : (
              proyecto.lema || proyecto.titulo
            )}
          </h3>
          <p className="proyecto-descripcion">{proyecto.descripcion}</p>
        </div>

        <div className="proyecto-pie">
          <span className="boton-circulo" aria-hidden="true">
            <ArrowUpRight size={16} />
          </span>
          {proyecto.repo && proyecto.demo && (
            <a className="proyecto-repo" href={proyecto.repo} target="_blank" rel="noreferrer">
              <Github size={14} aria-hidden="true" /> Código
            </a>
          )}
        </div>

        <div className="proyecto-visual" aria-hidden="true">
          {proyecto.imagen ? (
            <img src={proyecto.imagen} alt="" loading="lazy" />
          ) : (
            <Mockup proyecto={proyecto} tema={tema} indice={indice} />
          )}
        </div>
      </div>
    </Aparecer>
  )
}
