import { Platform, type TextStyle } from 'react-native';

/**
 * Sistema visual: "Apple × industrial".
 * Colores semánticos, escala tipográfica con tracking por tamaño (como SF),
 * springs de dos parámetros (dampingRatio + duration) y curvas fuertes.
 */

export const colors = {
  // Marca
  primary: '#E30614',
  primaryDark: '#991C14',
  primaryDeep: '#4A0508',
  primaryHighlight: '#FF6B5E',
  primaryTint: 'rgba(227, 6, 20, 0.10)',

  // Superficies claras (estilo "grouped" de iOS)
  groupedBackground: '#F2F2F7',
  elevated: '#FFFFFF',
  fill: 'rgba(120, 120, 128, 0.12)',
  separator: 'rgba(60, 60, 67, 0.18)',

  // Texto claro
  label: '#111113',
  secondaryLabel: 'rgba(60, 60, 67, 0.62)',
  tertiaryLabel: 'rgba(60, 60, 67, 0.36)',
  placeholder: 'rgba(60, 60, 67, 0.30)',

  // Superficies oscuras (panel de marca)
  carbon: '#1A1A1A',
  carbonDeep: '#0E0F11',
  onCarbon: '#FFFFFF',
  onCarbonSecondary: 'rgba(255, 255, 255, 0.60)',
  onCarbonTertiary: 'rgba(255, 255, 255, 0.34)',

  success: '#34C759',
  white: '#FFFFFF',

  // Compatibilidad con componentes anteriores
  card: '#FFFFFF',
  border: 'rgba(60, 60, 67, 0.18)',
  muted: 'rgba(60, 60, 67, 0.62)',
  background: '#F2F2F7',
  input: '#FFFFFF',
};

export const font = Platform.select({
  ios: 'System',
  android: 'sans-serif',
  default: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
});

/** Tracking por tamaño: negativo en títulos, ~0 en cuerpo, positivo en texto chico. */
export const type = {
  largeTitle: { fontFamily: font, fontSize: 34, lineHeight: 40, fontWeight: '700', letterSpacing: -0.7 },
  title1: { fontFamily: font, fontSize: 28, lineHeight: 34, fontWeight: '700', letterSpacing: -0.5 },
  title2: { fontFamily: font, fontSize: 22, lineHeight: 28, fontWeight: '700', letterSpacing: -0.3 },
  headline: { fontFamily: font, fontSize: 17, lineHeight: 22, fontWeight: '600', letterSpacing: -0.2 },
  body: { fontFamily: font, fontSize: 17, lineHeight: 22, fontWeight: '400', letterSpacing: -0.2 },
  callout: { fontFamily: font, fontSize: 16, lineHeight: 21, fontWeight: '400', letterSpacing: -0.1 },
  subhead: { fontFamily: font, fontSize: 15, lineHeight: 20, fontWeight: '400', letterSpacing: 0 },
  footnote: { fontFamily: font, fontSize: 13, lineHeight: 18, fontWeight: '400', letterSpacing: 0 },
  caption: { fontFamily: font, fontSize: 12, lineHeight: 16, fontWeight: '400', letterSpacing: 0.1 },
  /** Etiqueta industrial: chica, pesada, en mayúsculas con tracking amplio. */
  eyebrow: { fontFamily: font, fontSize: 11, lineHeight: 14, fontWeight: '700', letterSpacing: 2.2, textTransform: 'uppercase' },
} satisfies Record<string, TextStyle>;

export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 28, xxxl: 40 } as const;
export const radius = { sm: 10, md: 14, lg: 20, sheet: 30, pill: 999 } as const;

/** Springs estilo Apple: dampingRatio 1 por defecto; 0.8 solo si hubo momentum. */
export const springs = {
  ui: { duration: 400, dampingRatio: 1 },
  momentum: { duration: 450, dampingRatio: 0.8 },
  press: { duration: 150, dampingRatio: 1 },
} as const;

/** Curvas fuertes: las nativas son demasiado suaves. */
export const bezier = {
  out: [0.23, 1, 0.32, 1],
  inOut: [0.77, 0, 0.175, 1],
  sheet: [0.32, 0.72, 0, 1],
} as const;

/** Altura mínima de un control táctil (44 pt iOS / 48 dp Android). */
export const tapTarget = Platform.OS === 'android' ? 48 : 44;
