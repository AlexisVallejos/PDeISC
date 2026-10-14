import { useId } from "react";

// composición editorial en SVG (reemplaza al PNG): formas planas en coral y tinta,
// nítidas en cualquier pantalla y con los colores del tema claro/oscuro
export function EditorialArt({ className = "" }: { className?: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg className={`editorial-art ${className}`} viewBox="0 0 560 420" preserveAspectRatio="xMinYMax meet" aria-hidden="true" focusable="false">
      <defs>
        <pattern id={`${id}-stripes`} width="11" height="10" patternUnits="userSpaceOnUse">
          <rect width="3.2" height="10" fill="var(--ed-coral)" />
        </pattern>
        <clipPath id={`${id}-arch`}>
          <path d="M210 420V250a130 130 0 0 1 260 0v170z" />
        </clipPath>
        <linearGradient id={`${id}-sun`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--ed-coral)" />
          <stop offset="1" stopColor="var(--ed-coral-deep)" />
        </linearGradient>
      </defs>

      {/* arco rayado al fondo */}
      <rect x="210" y="120" width="260" height="300" fill={`url(#${id}-stripes)`} clipPath={`url(#${id}-arch)`} />

      {/* medio sol grande */}
      <path d="M0 420a190 190 0 0 1 380 0z" fill={`url(#${id}-sun)`} />

      {/* círculo chico y anillo de tinta */}
      <circle cx="96" cy="150" r="58" fill="var(--ed-coral)" />
      <circle cx="470" cy="96" r="54" fill="none" stroke="var(--ed-text)" strokeWidth="1.5" />
      <circle cx="470" cy="96" r="5" fill="var(--ed-text)" />

      {/* media luna lateral */}
      <path d="M560 210a90 90 0 0 0 0 180z" fill="var(--ed-coral-soft)" />

      {/* línea de base, como el pie de una página */}
      <line x1="0" y1="419.5" x2="560" y2="419.5" stroke="var(--ed-text)" strokeWidth="1" />
    </svg>
  );
}
