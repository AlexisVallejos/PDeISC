import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { Platform, useColorScheme } from 'react-native';
import { themeColors, type ThemeMode, type ThemePalette } from './theme';

interface ThemeValue {
  mode: ThemeMode;
  palette: ThemePalette;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemMode = useColorScheme();
  const [choice, setChoice] = useState<ThemeMode | null>(null);
  const mode: ThemeMode = choice ?? (systemMode === 'dark' ? 'dark' : 'light');
  const palette = themeColors[mode];

  useEffect(() => {
    if (Platform.OS !== 'web') return;
    document.documentElement.style.colorScheme = mode;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', palette.background);
  }, [mode, palette.background]);

  const value = useMemo<ThemeValue>(
    () => ({ mode, palette, toggleTheme: () => setChoice(mode === 'dark' ? 'light' : 'dark') }),
    [mode, palette],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme requiere ThemeProvider');
  return context;
}
