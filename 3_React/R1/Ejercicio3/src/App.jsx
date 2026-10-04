import Contador from './components/Contador/Contador.jsx'
import ThemeToggle from './components/ThemeToggle.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'
import './App.css'
import './styles/global.css'

// Presento el contador y sus controles de interacción.
export default function App() {
  return (
    <>
      <ThemeToggle />
      <main className="ejercicio">
        <a className="volver-inicio" href="/" aria-label="Volver a Inicio - R1" title="Volver a Inicio - R1"><span aria-hidden="true">⌂</span><span>Inicio - R1</span></a>
        <header className="ejercicio__encabezado"><p>REACT · R1 · EJERCICIO 3</p><h1>Contador</h1><span>Estado y eventos para sumar y restar.</span></header>
        <section className="ejercicio__panel"><Contador /></section>
      </main>
      <ScrollToTop />
    </>
  )
}
