import { ArrowUpRight, Menu, X } from 'lucide-react'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useSeccionActiva } from '../hooks/useSeccionActiva'
import { primerNombre } from '../utils/texto'
import BotonTema from './BotonTema'

export const SECCIONES = [
  { id: 'inicio', texto: 'Inicio' },
  { id: 'proyectos', texto: 'Proyectos' },
  { id: 'experiencia', texto: 'Experiencia' },
  { id: 'sobre-mi', texto: 'Sobre mí' },
  { id: 'contacto', texto: 'Contacto' },
]
const IDS = SECCIONES.map((s) => s.id)

export default function BarraNav({ nombre }) {
  const activa = useSeccionActiva(IDS) ?? 'inicio'
  const [menuAbierto, setMenuAbierto] = useState(false)
  const barraRef = useRef(null)
  const listaRef = useRef(null)
  const puntoRef = useRef(null)

  // Un solo punto se desliza debajo del enlace activo (en vez de aparecer y desaparecer).
  useLayoutEffect(() => {
    function ubicar() {
      const enlace = listaRef.current?.querySelector(`a[href="#${activa}"]`)
      if (!enlace || !puntoRef.current) return
      const centro = enlace.offsetLeft + enlace.offsetWidth / 2
      puntoRef.current.style.transform = `translate3d(${centro - 2}px, 0, 0)`
      puntoRef.current.style.opacity = 1
    }
    ubicar()
    document.fonts?.ready.then(ubicar)
    window.addEventListener('resize', ubicar)
    return () => window.removeEventListener('resize', ubicar)
  }, [activa])

  // El menú del celular se cierra con Escape o tocando fuera.
  useEffect(() => {
    if (!menuAbierto) return
    const alPresionarTecla = (evento) => evento.key === 'Escape' && setMenuAbierto(false)
    const alTocarFuera = (evento) => !barraRef.current?.contains(evento.target) && setMenuAbierto(false)
    document.addEventListener('keydown', alPresionarTecla)
    document.addEventListener('pointerdown', alTocarFuera)
    return () => {
      document.removeEventListener('keydown', alPresionarTecla)
      document.removeEventListener('pointerdown', alTocarFuera)
    }
  }, [menuAbierto])

  const enlaces = (alElegir) =>
    SECCIONES.map(({ id, texto }) => (
      <li key={id}>
        <a href={`#${id}`} aria-current={activa === id ? 'true' : undefined} onClick={alElegir}>
          {texto}
        </a>
      </li>
    ))

  return (
    <header className="barra" ref={barraRef}>
      <nav className="contenedor barra-interior" aria-label="Secciones">
        <a className="marca" href="#inicio">
          {primerNombre(nombre)}
          <span className="marca-punto" aria-hidden="true" />
        </a>

        <ul className="barra-enlaces" ref={listaRef}>
          {enlaces()}
          <li className="barra-indicador" ref={puntoRef} aria-hidden="true" />
        </ul>

        <BotonTema />
        <a className="boton boton--oscuro boton--chico barra-cta" href="#contacto">
          Hablemos <ArrowUpRight size={15} aria-hidden="true" />
        </a>
        <button
          type="button"
          className="barra-menu-boton"
          aria-label={menuAbierto ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={menuAbierto}
          aria-controls="menu-movil"
          onClick={() => setMenuAbierto((abierto) => !abierto)}
        >
          {menuAbierto ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      <ul id="menu-movil" className={menuAbierto ? 'menu-movil es-abierto' : 'menu-movil'} inert={menuAbierto ? undefined : ''}>
        {enlaces(() => setMenuAbierto(false))}
      </ul>
    </header>
  )
}
