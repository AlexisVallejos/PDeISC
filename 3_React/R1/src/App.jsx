import './App.css'
import ThemeToggle from './components/ThemeToggle.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'

const ejercicios = [
  {
    numero: '01',
    titulo: 'Hola mundo',
    descripcion: 'Primer componente y distintas formas de presentar el saludo.',
    ruta: '/Ejercicio1/'
  },
  {
    numero: '02',
    titulo: 'Tarjeta de presentación',
    descripcion: 'Componentes reutilizables con datos enviados mediante props.',
    ruta: '/Ejercicio2/'
  },
  {
    numero: '03',
    titulo: 'Contador',
    descripcion: 'Estado de React y eventos para sumar y restar.',
    ruta: '/Ejercicio3/'
  },
  {
    numero: '04',
    titulo: 'Lista de tareas',
    descripcion: 'Agregá, editá, completá y eliminá tareas de la lista.',
    ruta: '/Ejercicio4/'
  },
  {
    numero: '05',
    titulo: 'Formulario simple',
    descripcion: 'Capturar un nombre y mostrar una respuesta personalizada.',
    ruta: '/Ejercicio5/'
  },
  {
    numero: '06',
    titulo: 'Ta-Te-Ti',
    descripcion: 'Abrí el juego independiente que también está incluido en R1.',
    ruta: '/tateti/'
  }
]

// Presento los accesos a cada proyecto independiente de R1.
function App() {
  return (
    <>
      <ThemeToggle />
      <main className="app">
        <header className="app__encabezado">
          <p className="app__eyebrow">DESARROLLO · REACT</p>
          <h1>Inicio - R1</h1>
          <p>Elegí un ejercicio para abrir su proyecto independiente.</p>
        </header>

        <div className="app__grilla">
          {ejercicios.map((ejercicio) => (
            <article className="seccion ejercicio" key={ejercicio.numero}>
              <span className="ejercicio__numero">{ejercicio.numero}</span>
              <h2>{ejercicio.titulo}</h2>
              <p>{ejercicio.descripcion}</p>
              <a className="ejercicio__boton" href={ejercicio.ruta}>
                Abrir ejercicio <span aria-hidden="true">↗</span>
              </a>
            </article>
          ))}
        </div>
      </main>
      <ScrollToTop />
    </>
  )
}

export default App
