import { useId } from "react";

// logo NEXO dibujado en SVG: toma el color del texto y la X usa el acento, así se ve en claro y en oscuro
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

// ---------- orbe ----------
// Esfera grande que se sale por la izquierda y por abajo. Los puntos se calculan sobre la superficie
// de una esfera 3D (latitud/longitud rotadas y proyectadas), así siguen la curvatura como un halftone real;
// su tamaño y opacidad dependen de la luz, que llega desde arriba a la derecha.
const W = 520;
const H = 560;
const SPHERE = { cx: -100, cy: 520, r: 520 };
// anillo: elipse inclinada que pasa por delante de la esfera y se esconde detrás de su borde
const RING = { cx: -40, cy: 330, rx: 508, ry: 145, tilt: (-28.8 * Math.PI) / 180 };

type Dot = { x: number; y: number; r: number; o: number };

const DOTS: Dot[] = (() => {
  const dots: Dot[] = [];
  const step = (1.15 * Math.PI) / 180;
  const light = normalize([0.62, 0.62, 0.48]);
  const rx = (-22 * Math.PI) / 180;
  const rz = (18 * Math.PI) / 180;
  for (let lat = -Math.PI / 2 + step; lat < Math.PI / 2; lat += step) {
    const ring = Math.max(1, Math.round((2 * Math.PI * Math.cos(lat)) / step));
    for (let k = 0; k < ring; k++) {
      const lon = (k / ring) * 2 * Math.PI;
      let x = Math.cos(lat) * Math.cos(lon);
      let y = Math.sin(lat);
      let z = Math.cos(lat) * Math.sin(lon);
      // inclina el globo para que las líneas de puntos se curven en diagonal
      [y, z] = [y * Math.cos(rx) - z * Math.sin(rx), y * Math.sin(rx) + z * Math.cos(rx)];
      [x, y] = [x * Math.cos(rz) - y * Math.sin(rz), x * Math.sin(rz) + y * Math.cos(rz)];
      if (z <= 0) continue;
      const px = SPHERE.cx + x * SPHERE.r;
      const py = SPHERE.cy - y * SPHERE.r;
      if (px < -4 || px > W + 4 || py < -4 || py > H + 4) continue;
      const lit = Math.max(0, x * light[0] + y * light[1] + z * light[2]);
      const rim = Math.pow(1 - z, 1.6); // más presencia cerca del borde
      const v = Math.min(1, Math.pow(lit, 3) * 0.45 + Math.pow(rim, 1.2) * lit * 1.05);
      if (v < 0.07) continue;
      dots.push({ x: round(px), y: round(py), r: round(0.5 + v * 1.45), o: round(0.06 + v * 0.8) });
    }
  }
  return dots;
})();

const RING_FRONT = ringPath(112, -56);
const RING_BACK = ringPath(-56, -250);

function normalize(v: number[]) {
  const l = Math.hypot(...v);
  return v.map((n) => n / l);
}

function round(n: number) {
  return Math.round(n * 10) / 10;
}

// recorre la elipse del anillo entre dos ángulos (en grados) y la devuelve como path
function ringPath(from: number, to: number) {
  const pts: string[] = [];
  const dir = from > to ? -1 : 1;
  for (let d = from; dir < 0 ? d >= to : d <= to; d += dir * 2) {
    const t = (d * Math.PI) / 180;
    const ex = RING.rx * Math.cos(t);
    const ey = RING.ry * Math.sin(t);
    const x = RING.cx + ex * Math.cos(RING.tilt) - ey * Math.sin(RING.tilt);
    const y = RING.cy + ex * Math.sin(RING.tilt) + ey * Math.cos(RING.tilt);
    pts.push(`${round(x)} ${round(y)}`);
  }
  return `M${pts.join("L")}`;
}

export function OrbitArt({ className = "" }: { className?: string }) {
  const id = useId().replace(/:/g, "");
  const { cx, cy, r } = SPHERE;
  return (
    <svg className={`orbit-art ${className}`} viewBox={`0 -40 ${W} ${H + 40}`} preserveAspectRatio="xMinYMax meet" aria-hidden="true" focusable="false">
      <defs>
        {/* cuerpo: oscuro, con la luz entrando por arriba a la derecha */}
        <radialGradient id={`${id}-body`} gradientUnits="userSpaceOnUse" cx="250" cy="180" r="620">
          <stop offset="0" stopColor="var(--orbit-sphere-hi)" />
          <stop offset="0.45" stopColor="var(--orbit-sphere)" />
          <stop offset="1" stopColor="var(--orbit-sphere-lo)" />
        </radialGradient>
        {/* borde iluminado: fuerte arriba/derecha, se apaga hacia abajo */}
        <linearGradient id={`${id}-rimfade`} gradientUnits="userSpaceOnUse" x1="420" y1="40" x2="40" y2="560">
          <stop offset="0" stopColor="var(--control-lime)" stopOpacity="1" />
          <stop offset="0.55" stopColor="var(--control-lime)" stopOpacity="0.45" />
          <stop offset="1" stopColor="var(--control-lime)" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={`${id}-limb`} gradientUnits="userSpaceOnUse" cx={cx} cy={cy} r={r}>
          <stop offset="0.82" stopColor="var(--control-lime)" stopOpacity="0" />
          <stop offset="0.97" stopColor="var(--control-lime)" stopOpacity="0.16" />
          <stop offset="1" stopColor="var(--control-lime)" stopOpacity="0.32" />
        </radialGradient>
        {/* anillo: transparente en la punta lejana, intenso en la curva */}
        <linearGradient id={`${id}-ring`} gradientUnits="userSpaceOnUse" x1="-60" y1="520" x2="410" y2="90">
          <stop offset="0" stopColor="var(--control-lime)" stopOpacity="0" />
          <stop offset="0.45" stopColor="var(--control-lime)" stopOpacity="0.55" />
          <stop offset="0.9" stopColor="var(--control-lime)" stopOpacity="1" />
        </linearGradient>
        <linearGradient id={`${id}-ringtail`} gradientUnits="userSpaceOnUse" x1="410" y1="0" x2="150" y2="0">
          <stop offset="0" stopColor="#fff" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <mask id={`${id}-tail`} maskUnits="userSpaceOnUse" x="-200" y="-200" width="900" height="900">
          <rect x="-200" y="-200" width="900" height="900" fill="#fff" />
          <rect x="-200" y="-200" width="610" height="330" fill={`url(#${id}-ringtail)`} />
        </mask>
        <mask id={`${id}-outside`} maskUnits="userSpaceOnUse" x="-200" y="-200" width="900" height="900">
          <rect x="-200" y="-200" width="900" height="900" fill="#fff" />
          <circle cx={cx} cy={cy} r={r} fill="#000" />
        </mask>
        <clipPath id={`${id}-sphere`}>
          <circle cx={cx} cy={cy} r={r} />
        </clipPath>
        <filter id={`${id}-blur-lg`} x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="14" /></filter>
        <filter id={`${id}-blur-sm`} x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="4" /></filter>
      </defs>

      {/* halo exterior del borde iluminado */}
      <circle cx={cx} cy={cy} r={r + 2} fill="none" stroke={`url(#${id}-rimfade)`} strokeWidth="22" filter={`url(#${id}-blur-lg)`} opacity="0.3" />

      {/* parte trasera del anillo: solo se ve por fuera de la esfera */}
      <path d={RING_BACK} fill="none" stroke="var(--orbit-line)" strokeWidth="1.2" mask={`url(#${id}-outside)`} />

      {/* esfera */}
      <circle cx={cx} cy={cy} r={r} fill={`url(#${id}-body)`} />
      <g clipPath={`url(#${id}-sphere)`}>
        <g fill="var(--orbit-dot)">
          {DOTS.map((d, i) => <circle key={i} cx={d.x} cy={d.y} r={d.r} opacity={d.o} />)}
        </g>
        <circle cx={cx} cy={cy} r={r} fill={`url(#${id}-limb)`} />
      </g>
      <circle cx={cx} cy={cy} r={r - 0.6} fill="none" stroke={`url(#${id}-rimfade)`} strokeWidth="1.6" />

      {/* anillo delantero: brillo ancho + cuerpo + núcleo claro */}
      <g mask={`url(#${id}-tail)`} fill="none" strokeLinecap="round">
        <path d={RING_FRONT} stroke={`url(#${id}-ring)`} strokeWidth="26" filter={`url(#${id}-blur-lg)`} opacity="0.55" />
        <path d={RING_FRONT} stroke={`url(#${id}-ring)`} strokeWidth="9" filter={`url(#${id}-blur-sm)`} opacity="0.8" />
        <path d={RING_FRONT} stroke={`url(#${id}-ring)`} strokeWidth="5" />
        <path d={RING_FRONT} stroke="var(--orbit-core)" strokeWidth="1.6" opacity="0.85" />
      </g>
    </svg>
  );
}
