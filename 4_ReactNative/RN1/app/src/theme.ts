import { Platform } from 'react-native';

export const colors = {
  primary: '#E30614',
  primaryDark: '#991C14',
  primaryDeep: '#4A0508',
  primaryHighlight: '#FF6B5E',
  carbon: '#1A1A1A',
  carbonDeep: '#0E0F11',
  background: '#F5F5F5',
  card: '#FFFFFF',
  muted: '#666666',
  border: '#E5E5E5',
  input: '#F7F7F8',
  white: '#FFFFFF',
};

// Springs al estilo Apple: damping 1.0 por defecto, 0.8 solo cuando hubo momentum.
export const springs = {
  ui: { duration: 400, dampingRatio: 1 },
  momentum: { duration: 450, dampingRatio: 0.8 },
  press: { duration: 150, dampingRatio: 1 },
} as const;

export const font = Platform.select({
  ios: 'System',
  android: 'sans-serif',
  default: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
});
