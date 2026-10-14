// isotipo + palabra NEXO; la X toma el color de acento
export function NexoMark({ className = "" }: { className?: string }) {
  return (
    <svg className={`nexo-mark ${className}`} viewBox="0 0 180 44" role="img" aria-label="NEXO">
      <g fill="currentColor">
        <rect x="0" y="0" width="8" height="44" rx="1.5" />
        <rect x="26" y="0" width="8" height="44" rx="1.5" />
        <polygon points="0,0 9.5,0 34,44 24.5,44" />
        <path d="M56 0h22l-6 8H56a4 4 0 0 0-4 4v4h22v8H52v8a4 4 0 0 0 4 4h16l6 8H56a12 12 0 0 1-12-12V12A12 12 0 0 1 56 0z" />
        <path d="M148 0h18a14 14 0 0 1 14 14v16a14 14 0 0 1-14 14h-18a14 14 0 0 1-14-14V14A14 14 0 0 1 148 0zm0 8a6 6 0 0 0-6 6v16a6 6 0 0 0 6 6h18a6 6 0 0 0 6-6V14a6 6 0 0 0-6-6z" />
      </g>
      <g className="nexo-x">
        <polygon points="84,0 95,0 109,17.5 103,20.5" />
        <polygon points="128,0 117,0 103,17.5 109,20.5" />
        <polygon points="84,44 95,44 109,26.5 103,23.5" />
        <polygon points="128,44 117,44 103,26.5 109,23.5" />
      </g>
    </svg>
  );
}
