import ListaTareas from './components/ListaTareas/ListaTareas.jsx'
import ThemeToggle from './components/ThemeToggle.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'
import './App.css'
import './styles/global.css'

// Presento la lista interactiva de tareas.
export default function App() {
  return (
    <>
      <ThemeToggle />
      <main className="ejercicio">
        <a className="volver-inicio" href="/" aria-label="Volver a Inicio - R1" title="Volver a Inicio - R1"><span aria-hidden="true">⌂</span><span>Inicio - R1</span></a>
        <header className="ejercicio__encabezado"><p>REACT · R1 · EJERCICIO 4</p><h1>Lista de tareas</h1><span>Agregá tareas, marcá su estado, editá o eliminá.</span></header>
        <section className="ejercicio__panel"><ListaTareas /></section>
      </main>
      <ScrollToTop />
    </>
  )
}
