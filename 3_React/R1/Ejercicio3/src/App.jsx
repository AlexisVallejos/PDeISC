import Contador from './components/Contador/Contador.jsx'
import './App.css'
import './styles/global.css'

export default function App() {
  return (
    <main className="ejercicio">
      <header className="ejercicio__encabezado"><p>REACT · R1 · EJERCICIO3</p><h1>Contador</h1><span>Ejercicio independiente, con el diseño original del proyecto.</span></header>
      <section className="ejercicio__panel"><Contador /></section>
    </main>
  )
}
