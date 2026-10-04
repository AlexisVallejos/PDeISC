export default function Casilla({ value, index, winning, disabled, onPlay }) {
  const state = value ? `ocupada por ${value}` : "vacía";
  return (
    <button
      className={winning ? "cell winning" : "cell"}
      type="button"
      role="gridcell"
      disabled={disabled}
      aria-label={`Casilla ${index + 1}, ${state}`}
      onClick={() => onPlay(index)}
    >
      {value}
    </button>
  );
}
