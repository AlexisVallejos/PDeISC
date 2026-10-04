// Pantalla principal: muestra los 5 ejercicios en secciones separadas, cada una con su título.
import HolaMundo from './components/HolaMundo/HolaMundo.jsx'
import TarjetaPresentacion from './components/TarjetaPresentacion/TarjetaPresentacion.jsx'
import Contador from './components/Contador/Contador.jsx'
import ListaTareas from './components/ListaTareas/ListaTareas.jsx'
import FormularioSimple from './components/FormularioSimple/FormularioSimple.jsx'
import avatarAna from './components/TarjetaPresentacion/avatar-ana.svg'
import avatarLuis from './components/TarjetaPresentacion/avatar-luis.svg'
import './App.css'

function App() {
  return (
    <main className="app">
      <header className="app__encabezado">
        <h1>Inicio - R1</h1>
        <p>Cinco ejercicios con componentes de React.</p>
      </header>

      <div className="app__grilla">
        <section className="seccion seccion--ancha">
          <h2>1. Hola mundo</h2>
          <HolaMundo />
        </section>

        <section className="seccion seccion--ancha">
          <h2>2. Tarjeta de presentación</h2>
          <div className="app__tarjetas">
            {/* Mismo componente, dos veces, con datos distintos pasados por props */}
            <TarjetaPresentacion
              nombre="Ana"
              apellido="Gómez"
              profesion="Diseñadora UX"
              imagen={avatarAna}
            />
            <TarjetaPresentacion
              nombre="Luis"
              apellido="Pérez"
              profesion="Desarrollador web"
              imagen={avatarLuis}
            />
          </div>
        </section>

        <section className="seccion">
          <h2>3. Contador</h2>
          <Contador />
        </section>

        <section className="seccion">
          <h2>4. Lista de tareas</h2>
          <ListaTareas />
        </section>

        <section className="seccion seccion--ancha">
          <h2>5. Formulario simple</h2>
          <FormularioSimple />
        </section>
      </div>
    </main>
  )
}

export default App
