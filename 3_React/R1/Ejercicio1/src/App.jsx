import HolaMundo from './components/HolaMundo/HolaMundo.jsx'
import './App.css'
import './styles/global.css'

export default function App() {
  return (
    <main className="ejercicio">
      <header className="ejercicio__encabezado"><p>REACT · R1 · EJERCICIO1</p><h1>Hola mundo</h1><span>Ejercicio independiente, con el diseño original del proyecto.</span></header>
      <section className="ejercicio__panel"><HolaMundo /></section>
    </main>
  )
}
