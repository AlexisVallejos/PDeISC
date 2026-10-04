import { useEffect, useState } from "react";
import Tablero from "./components/Tablero";
import EstadoPartida from "./components/EstadoPartida";
import Controles from "./components/Controles";
import ThemeToggle from "./components/ThemeToggle";
import { verificarGanador } from "./utils/verificarGanador";
import "./global.css";

const emptyBoard = () => Array(9).fill(null);

export default function App() {
  const [dark, setDark] = useState(false);
  const [board, setBoard] = useState(emptyBoard);
  const [turn, setTurn] = useState("X");
  const winningLine = verificarGanador(board);
  const tie = !winningLine && board.every(Boolean);
  const ended = Boolean(winningLine) || tie;
  useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
  }, [dark]);
  const play = (index) => {
    if (board[index] || ended) return;
    const nextBoard = [...board];
    nextBoard[index] = turn;
    setBoard(nextBoard);
    setTurn(turn === "X" ? "O" : "X");
  };
  const reset = () => {
    setBoard(emptyBoard());
    setTurn("X");
  };
  // El tablero y el turno vuelven a sus valores iniciales al reiniciar.
  return (
    <main>
      <ThemeToggle dark={dark} onToggle={() => setDark((value) => !value)} />
      <section className="game">
        <p className="eyebrow">Juego local · React</p>
        <h1>Tatetí</h1>
        <EstadoPartida
          winner={winningLine}
          tie={tie}
          turn={turn}
          board={board}
        />
        <Tablero
          board={board}
          winningLine={winningLine}
          onPlay={play}
          ended={ended}
        />
        <Controles onReset={reset} />
        <p className="hint">Dos jugadores · X comienza</p>
      </section>
    </main>
  );
}
