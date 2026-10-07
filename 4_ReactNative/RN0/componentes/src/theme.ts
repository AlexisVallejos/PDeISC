import { useMemo } from 'react';
import { Platform, useColorScheme, type TextStyle } from 'react-native';
import { useApariencia } from './context/AparienciaContext';
import { conAlfa } from './paletas';

/**
 * Sistema visual "Apple": neutros semánticos de iOS (claro y oscuro) + un color de acento elegible.
 * El acento sale de paletas.ts, donde cada tono está verificado por contraste (AA):
 * en claro se usa el tono "claro" con texto blanco; en oscuro, el "brillante" con texto negro.
 */

const light = {
  scheme: 'light' as 'light' | 'dark',
  background: '#F2F2F7',
  card: '#FFFFFF',
  cardPressed: '#E5E5EA',
  label: '#111113',
  secondaryLabel: 'rgba(60, 60, 67, 0.66)',
  tertiaryLabel: 'rgba(60, 60, 67, 0.40)',
  separator: 'rgba(60, 60, 67, 0.20)',
  fill: 'rgba(120, 120, 128, 0.12)',
  tint: '#1F7A36',
  onTint: '#FFFFFF',
  tintSoft: 'rgba(52, 199, 89, 0.14)',
  danger: '#D70015',
  codeBackground: '#0B1F14',
  codeText: '#C9F7D5',
  codeMuted: 'rgba(201, 247, 213, 0.55)',
  overlay: 'rgba(0, 0, 0, 0.32)',
};

const dark: typeof light = {
  scheme: 'dark',
  background: '#000000',
  card: '#1C1C1E',
  cardPressed: '#2C2C2E',
  label: '#FFFFFF',
  secondaryLabel: 'rgba(235, 235, 245, 0.64)',
  tertiaryLabel: 'rgba(235, 235, 245, 0.34)',
  separator: 'rgba(84, 84, 88, 0.65)',
  fill: 'rgba(118, 118, 128, 0.24)',
  tint: '#30D158',
  onTint: '#000000',
  tintSoft: 'rgba(48, 209, 88, 0.18)',
  danger: '#FF453A',
  codeBackground: '#0B1F14',
  codeText: '#C9F7D5',
  codeMuted: 'rgba(201, 247, 213, 0.55)',
  overlay: 'rgba(0, 0, 0, 0.55)',
};

export type Theme = typeof light & { acentoBrillante: string };

/**
 * Colores actuales: modo (del sistema o elegido en Apariencia) + acento elegido.
 * Los valores verdes de arriba son solo la base; el acento real los reemplaza.
 */
export function useTheme(): Theme {
  const sistema = useColorScheme();
  const { paleta, modo } = useApariencia();
  const oscuro = modo === 'sistema' ? sistema === 'dark' : modo === 'oscuro';

  return useMemo(() => {
    const base = oscuro ? dark : light;
    return {
      ...base,
      tint: oscuro ? paleta.brillante : paleta.claro,
      onTint: oscuro ? '#000000' : '#FFFFFF',
      tintSoft: conAlfa(paleta.brillante, oscuro ? 0.2 : 0.14),
      acentoBrillante: paleta.brillante,
      codeBackground: paleta.noche,
      codeText: paleta.pastel,
      codeMuted: conAlfa(paleta.pastel, 0.55),
    };
  }, [oscuro, paleta]);
}

export const font = Platform.select({
  ios: 'System',
  android: 'sans-serif',
  default: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
});

export const mono = Platform.select({
  ios: 'Menlo',
  android: 'monospace',
  default: 'ui-monospace, SFMono-Regular, Menlo, monospace',
});

/** Escala tipográfica de iOS con tracking por tamaño. */
export const type = {
  largeTitle: { fontFamily: font, fontSize: 34, lineHeight: 41, fontWeight: '700', letterSpacing: -0.7 },
  title1: { fontFamily: font, fontSize: 28, lineHeight: 34, fontWeight: '700', letterSpacing: -0.5 },
  title3: { fontFamily: font, fontSize: 20, lineHeight: 25, fontWeight: '600', letterSpacing: -0.3 },
  headline: { fontFamily: font, fontSize: 17, lineHeight: 22, fontWeight: '600', letterSpacing: -0.2 },
  body: { fontFamily: font, fontSize: 17, lineHeight: 23, fontWeight: '400', letterSpacing: -0.2 },
  callout: { fontFamily: font, fontSize: 16, lineHeight: 21, fontWeight: '400', letterSpacing: -0.1 },
  subhead: { fontFamily: font, fontSize: 15, lineHeight: 20, fontWeight: '400', letterSpacing: 0 },
  footnote: { fontFamily: font, fontSize: 13, lineHeight: 18, fontWeight: '400', letterSpacing: 0 },
  caption: { fontFamily: font, fontSize: 12, lineHeight: 16, fontWeight: '400', letterSpacing: 0.1 },
  eyebrow: { fontFamily: font, fontSize: 12, lineHeight: 16, fontWeight: '700', letterSpacing: 1.4, textTransform: 'uppercase' },
  code: { fontFamily: mono, fontSize: 13, lineHeight: 20 },
} satisfies Record<string, TextStyle>;

export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 28, xxxl: 40 } as const;
export const radius = { sm: 8, md: 12, lg: 16, xl: 22, pill: 999 } as const;

/** Springs estilo Apple: dampingRatio 1 (sin rebote) para la interfaz. */
export const springs = {
  ui: { duration: 400, dampingRatio: 1 },
  press: { duration: 150, dampingRatio: 1 },
} as const;

/** Altura mínima de un control táctil (44 pt iOS / 48 dp Android). */
export const tapTarget = Platform.OS === 'android' ? 48 : 44;
