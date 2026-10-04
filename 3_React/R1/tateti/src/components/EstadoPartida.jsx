export default function EstadoPartida({ winner, tie, turn, board }) {
  const message = winner
    ? `Ganó ${board[winner[0]]}`
    : tie
      ? "Empate"
      : `Turno de ${turn}`;
  return (
    <p className="status" aria-live="polite">
      {message}
    </p>
  );
}
