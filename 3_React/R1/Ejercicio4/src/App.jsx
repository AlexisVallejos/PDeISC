import ListaTareas from './components/ListaTareas/ListaTareas.jsx'
import './App.css'
import './styles/global.css'

export default function App() {
  return (
    <main className="ejercicio">
      <header className="ejercicio__encabezado"><p>REACT · R1 · EJERCICIO4</p><h1>Lista de tareas</h1><span>Ejercicio independiente, con el diseño original del proyecto.</span></header>
      <section className="ejercicio__panel"><ListaTareas /></section>
    </main>
  )
}
