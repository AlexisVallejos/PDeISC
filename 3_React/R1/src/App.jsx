import './App.css'
import Fondo from './components/Fondo.jsx'
import ThemeToggle from './components/ThemeToggle.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'

const ejercicios = [
  {
    numero: '01',
    titulo: 'Hola mundo',
    descripcion: 'Primer componente y distintas formas de presentar el saludo.',
    ruta: '/Ejercicio1/',
    tono: 'azul'
  },
  {
    numero: '02',
    titulo: 'Tarjeta de presentación',
    descripcion: 'Componentes reutilizables con datos enviados mediante props.',
    ruta: '/Ejercicio2/',
    tono: 'violeta'
  },
  {
    numero: '03',
    titulo: 'Contador',
    descripcion: 'Estado de React y eventos para sumar y restar.',
    ruta: '/Ejercicio3/',
    tono: 'naranja'
  },
  {
    numero: '04',
    titulo: 'Lista de tareas',
    descripcion: 'Agregá, editá, completá y eliminá tareas de la lista.',
    ruta: '/Ejercicio4/',
    tono: 'verde'
  },
  {
    numero: '05',
    titulo: 'Formulario simple',
    descripcion: 'Capturar un nombre y mostrar una respuesta personalizada.',
    ruta: '/Ejercicio5/',
    tono: 'rosa'
  },
  {
    numero: '06',
    titulo: 'Ta-Te-Ti',
    descripcion: 'Abrí el juego independiente que también está incluido en R1.',
    ruta: '/tateti/',
    tono: 'turquesa'
  }
]

// Presento los accesos a cada proyecto independiente de R1.
function App() {
  return (
    <>
      <Fondo />
      <nav className="barra" aria-label="Principal">
        <a className="barra__marca" href="/">R1</a>
        <ThemeToggle />
      </nav>

      <main className="app">
        <header className="app__encabezado">
          <p className="app__eyebrow">Desarrollo · React</p>
          <h1>Ejercicios de R1.</h1>
          <p className="app__bajada">Elegí un ejercicio para abrir su proyecto independiente.</p>
        </header>

        <ul className="app__grilla">
          {ejercicios.map((ejercicio, indice) => (
            <li key={ejercicio.numero} style={{ '--orden': indice }}>
              <a className={`ejercicio ejercicio--${ejercicio.tono}`} href={ejercicio.ruta}>
                <span className="ejercicio__numero">{ejercicio.numero}</span>
                <h2>{ejercicio.titulo}</h2>
                <p>{ejercicio.descripcion}</p>
                <span className="ejercicio__accion">
                  Abrir <span aria-hidden="true">›</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </main>

      <footer className="pie">PDeISC · React R1</footer>
      <ScrollToTop />
    </>
  )
}

export default App
