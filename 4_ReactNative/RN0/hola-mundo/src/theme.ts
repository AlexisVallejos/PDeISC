import { Platform, type TextStyle } from 'react-native';

/**
 * Sistema visual "Apple": neutros de iOS + un color de acento elegible (ver paletas.ts).
 * Dos estilos conviven a propósito: Inicio es claro y mínimo; Estilos es oscuro y expresivo.
 */

export const colors = {
  // Superficies claras (estilo iOS)
  background: '#FFFFFF',
  groupedBackground: '#F2F2F7',
  separator: 'rgba(60, 60, 67, 0.18)',
  label: '#111113',
  secondaryLabel: 'rgba(60, 60, 67, 0.64)',
  tertiaryLabel: 'rgba(60, 60, 67, 0.36)',

  // Superficies oscuras (pestaña Estilos)
  onDark: '#FFFFFF',
  onDarkSecondary: 'rgba(255, 255, 255, 0.66)',
  onDarkTertiary: 'rgba(255, 255, 255, 0.38)',
  glass: 'rgba(255, 255, 255, 0.07)',
  glassBorder: 'rgba(255, 255, 255, 0.12)',

  white: '#FFFFFF',
  black: '#000000',
};

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

/** Tracking por tamaño, como SF: negativo en títulos, ~0 en cuerpo, positivo en texto chico. */
export const type = {
  display: { fontFamily: font, fontSize: 56, lineHeight: 60, fontWeight: '800', letterSpacing: -2 },
  largeTitle: { fontFamily: font, fontSize: 34, lineHeight: 40, fontWeight: '700', letterSpacing: -0.7 },
  title2: { fontFamily: font, fontSize: 22, lineHeight: 28, fontWeight: '700', letterSpacing: -0.3 },
  headline: { fontFamily: font, fontSize: 17, lineHeight: 22, fontWeight: '600', letterSpacing: -0.2 },
  body: { fontFamily: font, fontSize: 17, lineHeight: 24, fontWeight: '400', letterSpacing: -0.2 },
  subhead: { fontFamily: font, fontSize: 15, lineHeight: 20, fontWeight: '400', letterSpacing: 0 },
  footnote: { fontFamily: font, fontSize: 13, lineHeight: 18, fontWeight: '400', letterSpacing: 0 },
  eyebrow: { fontFamily: font, fontSize: 12, lineHeight: 16, fontWeight: '700', letterSpacing: 1.6, textTransform: 'uppercase' },
} satisfies Record<string, TextStyle>;

export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 28, xxxl: 40 } as const;
export const radius = { sm: 10, md: 14, lg: 22, pill: 999 } as const;

/** Springs estilo Apple (dampingRatio + duración), sin rebote salvo que haya momentum. */
export const springs = {
  ui: { duration: 400, dampingRatio: 1 },
  press: { duration: 150, dampingRatio: 1 },
} as const;

/** Familias que se pueden elegir en Estilos > Tipografía. Cada una usa una fuente que existe en el sistema. */
export type Fuente = 'sistema' | 'serif' | 'mono';

export const FUENTES: Record<Fuente, { titulo: string; familia: string | undefined }> = {
  sistema: { titulo: 'Sistema', familia: font },
  serif: {
    titulo: 'Serif',
    familia: Platform.select({ ios: 'Georgia', android: 'serif', default: 'Georgia, "Times New Roman", serif' }),
  },
  mono: { titulo: 'Mono', familia: mono },
};
