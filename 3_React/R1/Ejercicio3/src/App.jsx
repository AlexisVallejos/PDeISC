import Contador from './components/Contador/Contador.jsx'
import Fondo from './components/Fondo.jsx'
import ThemeToggle from './components/ThemeToggle.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'
import './App.css'
import './styles/global.css'

// Presento el contador y sus controles de interacción.
export default function App() {
  return (
    <>
      <Fondo />
      <nav className="barra" aria-label="Principal">
        <a className="volver-inicio" href="/" aria-label="Volver a Inicio - R1"><span aria-hidden="true">‹</span><span>Inicio</span></a>
        <ThemeToggle />
      </nav>
      <main className="ejercicio">
        <header className="ejercicio__encabezado"><p>Ejercicio 3</p><h1>Contador</h1><span>Estado y eventos para sumar y restar.</span></header>
        <section className="ejercicio__panel"><Contador /></section>
      </main>
      <ScrollToTop />
    </>
  )
}
