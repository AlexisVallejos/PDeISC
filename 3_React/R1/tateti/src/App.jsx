import { useState } from 'react'
import Controles from './components/Controles.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'
import EstadoPartida from './components/EstadoPartida.jsx'
import Tablero from './components/Tablero.jsx'
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
      <ThemeToggle />
      <main className="tateti-page">
        <div className="tateti-contenido">
          <a className="volver-inicio" href="/" aria-label="Volver a Inicio - R1" title="Volver a Inicio - R1"><span aria-hidden="true">⌂</span><span>Inicio - R1</span></a>
          <section className="game" aria-labelledby="titulo-tateti">
            <p className="eyebrow">JUEGO LOCAL · REACT</p>
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
