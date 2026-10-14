// cabecera tipográfica: ESTUDIO / USUARIOS
export function Masthead({ className = "" }: { className?: string }) {
  return (
    <span className={`masthead ${className}`}>
      <strong>ESTUDIO</strong>
      <em aria-hidden="true">/</em>
      <span>USUARIOS</span>
    </span>
  );
}
