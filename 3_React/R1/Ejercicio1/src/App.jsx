import HolaMundo from './components/HolaMundo/HolaMundo.jsx'
import ThemeToggle from './components/ThemeToggle.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'
import './App.css'
import './styles/global.css'

// Presento el ejercicio inicial con el componente de saludo.
export default function App() {
  return (
    <>
      <ThemeToggle />
      <main className="ejercicio">
        <a className="volver-inicio" href="/" aria-label="Volver a Inicio - R1" title="Volver a Inicio - R1"><span aria-hidden="true">⌂</span><span>Inicio - R1</span></a>
        <header className="ejercicio__encabezado"><p>REACT · R1 · EJERCICIO 1</p><h1>Hola mundo</h1><span>Primer componente y distintas formas de presentar el saludo.</span></header>
        <section className="ejercicio__panel"><HolaMundo /></section>
      </main>
      <ScrollToTop />
    </>
  )
}
