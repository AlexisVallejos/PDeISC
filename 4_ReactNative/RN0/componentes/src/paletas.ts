/**
 * Paletas de acento al estilo de los colores de sistema de Apple.
 * Cada una tiene 5 tonos, y los dos que se usan con texto están verificados (WCAG AA):
 * - claro: con texto blanco encima y sobre fondo blanco ≥ 4,5:1 (modo claro)
 * - brillante: con texto negro encima y sobre #1C1C1E ≥ 4,5:1 (modo oscuro)
 *
 * | paleta  | claro / blanco | brillante / negro |
 * | verde   | 5,39           | 10,39             |
 * | azul    | 5,80           | 5,76              |
 * | índigo  | 7,18           | 6,10              |
 * | naranja | 5,42           | 10,22             |
 * | rosa    | 5,83           | 6,64              |
 * | grafito | 11,35          | 9,50              |
 */

export type PaletaId = 'verde' | 'azul' | 'indigo' | 'naranja' | 'rosa' | 'grafito';

export interface Paleta {
  id: PaletaId;
  nombre: string;
  /** Fondo casi negro teñido (pantallas oscuras, bloques de código). */
  noche: string;
  /** Tono oscuro intermedio (degradados). */
  profundo: string;
  /** Acento en modo claro: texto y botones con texto blanco. */
  claro: string;
  /** Acento en modo oscuro: texto y botones con texto negro. */
  brillante: string;
  /** Tono muy suave (texto sobre "noche", fondos de chips). */
  pastel: string;
}

export const PALETAS: Paleta[] = [
  { id: 'verde', nombre: 'Verde', noche: '#04120A', profundo: '#0B3D1F', claro: '#1F7A36', brillante: '#30D158', pastel: '#B8F5C8' },
  { id: 'azul', nombre: 'Azul', noche: '#030B18', profundo: '#0A2A55', claro: '#0062CC', brillante: '#0A84FF', pastel: '#B9D9FF' },
  { id: 'indigo', nombre: 'Índigo', noche: '#08061A', profundo: '#221C5C', claro: '#4A3FD1', brillante: '#7D7AFF', pastel: '#D3D1FF' },
  { id: 'naranja', nombre: 'Naranja', noche: '#140A02', profundo: '#4A2400', claro: '#A85200', brillante: '#FF9F0A', pastel: '#FFE0B2' },
  { id: 'rosa', nombre: 'Rosa', noche: '#16040A', profundo: '#4F0C22', claro: '#C21F4F', brillante: '#FF4F78', pastel: '#FFC9D6' },
  { id: 'grafito', nombre: 'Grafito', noche: '#0A0A0B', profundo: '#2C2C2E', claro: '#3A3A3C', brillante: '#AEAEB2', pastel: '#E5E5EA' },
];

export const PALETA_INICIAL: PaletaId = 'verde';

export function buscarPaleta(id: string | null | undefined): Paleta {
  return PALETAS.find((p) => p.id === id) ?? PALETAS[0]!;
}

/** "#RRGGBB" + opacidad → "rgba(r, g, b, a)". */
export function conAlfa(hex: string, alfa: number) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alfa})`;
}
