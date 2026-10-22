import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, ZoomIn, useReducedMotion } from 'react-native-reanimated';
import { useTheme } from '../ThemeContext';
import { colors } from '../theme';
import { PressableScale } from './PressableScale';

const SIZE = 44;
const RAYS = 8;

/** Sol: disco con 8 rayos. */
function SunIcon({ color }: { color: string }) {
  return (
    <View style={styles.icon}>
      {Array.from({ length: RAYS }, (_, i) => (
        <View key={i} style={[styles.rayHolder, { transform: [{ rotate: `${(360 / RAYS) * i}deg` }] }]}>
          <View style={[styles.ray, { backgroundColor: color }]} />
        </View>
      ))}
      <View style={[styles.sun, { backgroundColor: color }]} />
    </View>
  );
}

/** Luna creciente: disco al que se le "muerde" otro del color del botón. */
function MoonIcon({ color, bite }: { color: string; bite: string }) {
  return (
    <View style={styles.icon}>
      <View style={[styles.moon, { backgroundColor: color }]} />
      <View style={[styles.moonBite, { backgroundColor: bite }]} />
    </View>
  );
}

/**
 * Botón circular de tema, solo ícono (el sol aparece en modo oscuro y la luna en modo claro).
 * `overBrand`: sobre el panel oscuro del video, con vidrio oscuro y trazo claro en ambos modos.
 */
export function ThemeToggle({ overBrand }: { overBrand?: boolean }) {
  const { mode, palette, toggleTheme } = useTheme();
  const reduceMotion = useReducedMotion();
  const nextMode = mode === 'dark' ? 'claro' : 'oscuro';

  const fondo = overBrand ? '#26272A' : palette.control;
  const borde = overBrand ? 'rgba(255, 255, 255, 0.22)' : palette.controlBorder;
  const trazo = overBrand ? colors.white : palette.label;

  return (
    <PressableScale
      onPress={toggleTheme}
      pressedScale={0.92}
      accessibilityRole="button"
      accessibilityLabel={`Activar modo ${nextMode}`}
      style={[styles.button, { backgroundColor: fondo, borderColor: borde }]}
    >
      <Animated.View
        key={mode}
        entering={reduceMotion ? FadeIn.duration(150) : ZoomIn.duration(220)}
        style={styles.center}
      >
        {mode === 'dark' ? <SunIcon color={trazo} /> : <MoonIcon color={trazo} bite={fondo} />}
      </Animated.View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  button: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  center: { alignItems: 'center', justifyContent: 'center' },
  icon: { width: 22, height: 22, alignItems: 'center', justifyContent: 'center' },
  sun: { width: 10, height: 10, borderRadius: 5 },
  rayHolder: { position: 'absolute', width: 22, height: 22, alignItems: 'center' },
  ray: { width: 2, height: 4, borderRadius: 1, marginTop: 0 },
  moon: { width: 17, height: 17, borderRadius: 9 },
  moonBite: { position: 'absolute', width: 14, height: 14, borderRadius: 7, top: 1, right: 1 },
});
