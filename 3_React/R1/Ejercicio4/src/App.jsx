import ListaTareas from './components/ListaTareas/ListaTareas.jsx'
import Fondo from './components/Fondo.jsx'
import ThemeToggle from './components/ThemeToggle.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'
import './App.css'
import './styles/global.css'

// Presento la lista interactiva de tareas.
export default function App() {
  return (
    <>
      <Fondo />
      <nav className="barra" aria-label="Principal">
        <a className="volver-inicio" href="/" aria-label="Volver a Inicio - R1"><span aria-hidden="true">‹</span><span>Inicio</span></a>
        <ThemeToggle />
      </nav>
      <main className="ejercicio">
        <header className="ejercicio__encabezado"><p>Ejercicio 4</p><h1>Lista de tareas</h1><span>Agregá tareas, marcá su estado, editá o eliminá.</span></header>
        <section className="ejercicio__panel"><ListaTareas /></section>
      </main>
      <ScrollToTop />
    </>
  )
}
