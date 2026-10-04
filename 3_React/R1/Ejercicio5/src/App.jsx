import FormularioSimple from './components/FormularioSimple/FormularioSimple.jsx'
import Fondo from './components/Fondo.jsx'
import ThemeToggle from './components/ThemeToggle.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'
import './App.css'
import './styles/global.css'

// Presento el formulario validado de bienvenida.
export default function App() {
  return (
    <>
      <Fondo />
      <nav className="barra" aria-label="Principal">
        <a className="volver-inicio" href="/" aria-label="Volver a Inicio - R1"><span aria-hidden="true">‹</span><span>Inicio</span></a>
        <ThemeToggle />
      </nav>
      <main className="ejercicio">
        <header className="ejercicio__encabezado"><p>Ejercicio 5</p><h1>Formulario simple</h1><span>Ingresá tu nombre para ver el mensaje personalizado.</span></header>
        <section className="ejercicio__panel"><FormularioSimple /></section>
      </main>
      <ScrollToTop />
    </>
  )
}
