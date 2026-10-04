import FormularioSimple from './components/FormularioSimple/FormularioSimple.jsx'
import ThemeToggle from './components/ThemeToggle.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'
import './App.css'
import './styles/global.css'

// Presento el formulario validado de bienvenida.
export default function App() {
  return (
    <>
      <ThemeToggle />
      <main className="ejercicio">
        <a className="volver-inicio" href="/" aria-label="Volver a Inicio - R1" title="Volver a Inicio - R1"><span aria-hidden="true">⌂</span><span>Inicio - R1</span></a>
        <header className="ejercicio__encabezado"><p>REACT · R1 · EJERCICIO 5</p><h1>Formulario simple</h1><span>Ingresá tu nombre para ver el mensaje personalizado.</span></header>
        <section className="ejercicio__panel"><FormularioSimple /></section>
      </main>
      <ScrollToTop />
    </>
  )
}
