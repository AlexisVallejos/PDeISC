import TarjetaPresentacion from './components/TarjetaPresentacion/TarjetaPresentacion.jsx'
import avatarAna from './components/TarjetaPresentacion/avatar-ana.svg'
import avatarLuis from './components/TarjetaPresentacion/avatar-luis.svg'
import ThemeToggle from './components/ThemeToggle.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'
import './App.css'
import './styles/global.css'

// Presento dos tarjetas para mostrar el uso de props.
export default function App() {
  return (
    <>
      <ThemeToggle />
      <main className="ejercicio">
        <a className="volver-inicio" href="/" aria-label="Volver a Inicio - R1" title="Volver a Inicio - R1"><span aria-hidden="true">⌂</span><span>Inicio - R1</span></a>
        <header className="ejercicio__encabezado"><p>REACT · R1 · EJERCICIO 2</p><h1>Tarjeta de presentación</h1><span>Componentes reutilizables con propiedades distintas.</span></header>
        <section className="ejercicio__panel"><div className="tarjetas">
          <TarjetaPresentacion nombre="Ana" apellido="Gómez" profesion="Diseñadora UX" imagen={avatarAna} />
          <TarjetaPresentacion nombre="Luis" apellido="Pérez" profesion="Desarrollador web" imagen={avatarLuis} />
        </div></section>
      </main>
      <ScrollToTop />
    </>
  )
}
