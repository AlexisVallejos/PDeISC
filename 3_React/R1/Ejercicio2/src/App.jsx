import TarjetaPresentacion from './components/TarjetaPresentacion/TarjetaPresentacion.jsx'
import avatarAna from './components/TarjetaPresentacion/avatar-ana.svg'
import avatarLuis from './components/TarjetaPresentacion/avatar-luis.svg'
import './App.css'
import './styles/global.css'

export default function App() {
  return (
    <main className="ejercicio">
      <header className="ejercicio__encabezado"><p>REACT · R1 · EJERCICIO 2</p><h1>Tarjeta de presentación</h1><span>Componentes reutilizables con propiedades distintas.</span></header>
      <section className="ejercicio__panel"><div className="tarjetas">
        <TarjetaPresentacion nombre="Ana" apellido="Gómez" profesion="Diseñadora UX" imagen={avatarAna} />
        <TarjetaPresentacion nombre="Luis" apellido="Pérez" profesion="Desarrollador web" imagen={avatarLuis} />
      </div></section>
    </main>
  )
}
