import TarjetaPresentacion from './components/TarjetaPresentacion/TarjetaPresentacion.jsx'
import avatarAna from './components/TarjetaPresentacion/avatar-ana.svg'
import avatarLuis from './components/TarjetaPresentacion/avatar-luis.svg'
import Fondo from './components/Fondo.jsx'
import ThemeToggle from './components/ThemeToggle.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'
import './App.css'
import './styles/global.css'

// Presento dos tarjetas para mostrar el uso de props.
export default function App() {
  return (
    <>
      <Fondo />
      <nav className="barra" aria-label="Principal">
        <a className="volver-inicio" href="/" aria-label="Volver a Inicio - R1"><span aria-hidden="true">‹</span><span>Inicio</span></a>
        <ThemeToggle />
      </nav>
      <main className="ejercicio">
        <header className="ejercicio__encabezado"><p>Ejercicio 2</p><h1>Tarjeta de presentación</h1><span>Componentes reutilizables con propiedades distintas.</span></header>
        <section className="ejercicio__panel"><div className="tarjetas">
          <TarjetaPresentacion nombre="Ana" apellido="Gómez" profesion="Diseñadora UX" imagen={avatarAna} />
          <TarjetaPresentacion nombre="Luis" apellido="Pérez" profesion="Desarrollador web" imagen={avatarLuis} />
        </div></section>
      </main>
      <ScrollToTop />
    </>
  )
}
