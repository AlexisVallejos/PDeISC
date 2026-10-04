export const winningLines = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export function verificarGanador(board) {
  // Devuelve la línea ganadora para poder resaltarla en el tablero.
  return (
    winningLines.find(
      ([a, b, c]) => board[a] && board[a] === board[b] && board[a] === board[c],
    ) || null
  );
}
