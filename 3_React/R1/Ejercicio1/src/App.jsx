import HolaMundo from './components/HolaMundo/HolaMundo.jsx'
import Fondo from './components/Fondo.jsx'
import ThemeToggle from './components/ThemeToggle.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'
import './App.css'
import './styles/global.css'

// Presento el ejercicio inicial con el componente de saludo.
export default function App() {
  return (
    <>
      <Fondo />
      <nav className="barra" aria-label="Principal">
        <a className="volver-inicio" href="/" aria-label="Volver a Inicio - R1"><span aria-hidden="true">‹</span><span>Inicio</span></a>
        <ThemeToggle />
      </nav>
      <main className="ejercicio">
        <header className="ejercicio__encabezado"><p>Ejercicio 1</p><h1>Hola mundo</h1><span>Primer componente y distintas formas de presentar el saludo.</span></header>
        <section className="ejercicio__panel"><HolaMundo /></section>
      </main>
      <ScrollToTop />
    </>
  )
}
