import FormularioSimple from './components/FormularioSimple/FormularioSimple.jsx'
import './App.css'
import './styles/global.css'

export default function App() {
  return (
    <main className="ejercicio">
      <header className="ejercicio__encabezado"><p>REACT · R1 · EJERCICIO5</p><h1>Formulario simple</h1><span>Ejercicio independiente, con el diseño original del proyecto.</span></header>
      <section className="ejercicio__panel"><FormularioSimple /></section>
    </main>
  )
}
