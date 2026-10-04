import { useState } from 'react'
import Controles from './components/Controles.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'
import EstadoPartida from './components/EstadoPartida.jsx'
import Tablero from './components/Tablero.jsx'
import Fondo from './components/Fondo.jsx'
import ThemeToggle from './components/ThemeToggle.jsx'
import { verificarGanador } from './utils/verificarGanador.js'

// Armo las nueve casillas vacías para una partida nueva.
function crearTableroVacio() {
  return Array(9).fill(null)
}

// Coordino el tablero, los turnos y el resultado del tatetí.
export default function App() {
  const [tablero, setTablero] = useState(crearTableroVacio)
  const [turno, setTurno] = useState('X')
  const lineaGanadora = verificarGanador(tablero)
  const empate = !lineaGanadora && tablero.every(Boolean)
  const partidaTerminada = Boolean(lineaGanadora) || empate

  // Coloco la ficha actual y luego cambio el turno.
  function jugar(indice) {
    if (tablero[indice] || partidaTerminada) return
    const siguienteTablero = [...tablero]
    siguienteTablero[indice] = turno
    setTablero(siguienteTablero)
    setTurno(turno === 'X' ? 'O' : 'X')
  }

  // Vuelvo al estado inicial para empezar otra partida.
  function reiniciar() {
    setTablero(crearTableroVacio())
    setTurno('X')
  }

  return (
    <>
      <Fondo />
      <nav className="barra" aria-label="Principal">
        <a className="volver-inicio" href="/" aria-label="Volver a Inicio - R1"><span aria-hidden="true">‹</span><span>Inicio</span></a>
        <ThemeToggle />
      </nav>
      <main className="tateti-page">
        <div className="tateti-contenido">
          <section className="game" aria-labelledby="titulo-tateti">
            <p className="eyebrow">Juego local · React</p>
            <h1 id="titulo-tateti">Tatetí</h1>
            <EstadoPartida winner={lineaGanadora} tie={empate} turn={turno} board={tablero} />
            <Tablero board={tablero} winningLine={lineaGanadora} onPlay={jugar} ended={partidaTerminada} />
            <Controles onReset={reiniciar} />
            <p className="hint">Dos jugadores · X empieza</p>
          </section>
        </div>
      </main>
      <ScrollToTop />
    </>
  )
}
