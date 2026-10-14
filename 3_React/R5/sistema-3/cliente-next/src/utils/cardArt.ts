// fondo de tarjeta en SVG: formas pastel en las esquinas, distintas para cada persona
const PALETTES = [
  ["#e3e7ff", "#ffe2d3"],
  ["#ffe2d3", "#e7e0ff"],
  ["#dceaff", "#ffe9df"],
  ["#ece3ff", "#dfe8ff"],
] as const;

export function cardArt(seed: number, dark: boolean): string {
  const [a, b] = PALETTES[seed % PALETTES.length];
  const base = dark ? "#1a2036" : "#ffffff";
  const tone = (color: string) => (dark ? `${color}22` : color);
  const flip = seed % 2 === 0;
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 240' preserveAspectRatio='none'>
<rect width='400' height='240' fill='${base}'/>
<circle cx='${flip ? 400 : 0}' cy='0' r='92' fill='${tone(a)}'/>
<circle cx='${flip ? 0 : 400}' cy='240' r='70' fill='${tone(b)}'/>
</svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}
