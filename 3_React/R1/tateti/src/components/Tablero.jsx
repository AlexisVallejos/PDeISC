import Casilla from "./Casilla";

// Recorro el array del tablero y renderizo sus nueve casillas.
export default function Tablero({ board, winningLine, ended, onPlay }) {
  return (
    <div className="board" role="grid" aria-label="Tablero de tatetí">
      {board.map((value, index) => (
        <Casilla
          key={index}
          value={value}
          index={index}
          winning={winningLine?.includes(index)}
          disabled={!!value || ended}
          onPlay={onPlay}
        />
      ))}
    </div>
  );
}
