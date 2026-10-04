import * as Haptics from 'expo-haptics';
import { useEffect } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  interpolateColor,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { colors, font, springs } from '../theme';

/**
 * Logo DAMAC en 3D.
 * - Extrusión real: N capas apiladas cuyo desplazamiento depende de la rotación,
 *   así la profundidad "gira" con la letra en vez de ser una sombra fija.
 * - Bisel iluminado arriba-izquierda + reflejo (sheen) que barre las letras.
 * - Interactivo: arrastrar inclina el logo 1:1 con resistencia elástica y,
 *   al soltar, vuelve con un spring que hereda la velocidad del dedo.
 *   Tocar repite el giro de la "D".
 */

type Variant = 'dark' | 'light';

interface Logo3DProps {
  size?: number;
  variant?: Variant;
  interactive?: boolean;
  /** Retraso de la animación de entrada en ms. */
  delay?: number;
}

const DEPTH = 14;
const MAX_TILT = 24;
const DEG = Math.PI / 180;
const INTRO = Easing.bezier(0.16, 1, 0.3, 1);

interface Palette {
  face: string;
  highlight: string;
  bevel: string;
  sideNear: string;
  sideFar: string;
}

const RED: Palette = {
  face: colors.primary,
  highlight: colors.primaryHighlight,
  bevel: '#FF4A3D',
  sideNear: '#B0121B',
  sideFar: colors.primaryDeep,
};

const WHITE: Palette = {
  face: '#FFFFFF',
  highlight: '#FFFFFF',
  bevel: '#FFFFFF',
  sideNear: '#BFC3C9',
  sideFar: '#2E3136',
};

function mixHex(a: string, b: string, t: number): string {
  const pa = parseInt(a.slice(1), 16);
  const pb = parseInt(b.slice(1), 16);
  const ch = (shift: number) =>
    Math.round(((pa >> shift) & 255) * (1 - t) + ((pb >> shift) & 255) * t);
  return `rgb(${ch(16)}, ${ch(8)}, ${ch(0)})`;
}

// Resistencia elástica estilo iOS: cuanto más lejos, menos sigue al dedo.
function rubberband(value: number, limit: number) {
  'worklet';
  const c = 0.55;
  const sign = value < 0 ? -1 : 1;
  const abs = Math.abs(value);
  return (sign * (abs * limit * c)) / (limit + c * abs);
}

function tapHaptic() {
  if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
}

interface LetterProps {
  char: string;
  size: number;
  palette: Palette;
  tiltX: SharedValue<number>;
  tiltY: SharedValue<number>;
  spin: SharedValue<number>;
  sheen: SharedValue<number>;
  /** Posición horizontal 0..1 dentro del logo (para el reflejo). */
  pos: number;
}

function ExtrusionLayer({
  index,
  char,
  size,
  color,
  tiltX,
  tiltY,
  spin,
}: {
  index: number;
  char: string;
  size: number;
  color: string;
  tiltX: SharedValue<number>;
  tiltY: SharedValue<number>;
  spin: SharedValue<number>;
}) {
  const unit = size / 96;
  const style = useAnimatedStyle(() => {
    const ry = (tiltY.value + spin.value) * DEG;
    const rx = tiltX.value * DEG;
    // Luz arriba-izquierda: la profundidad cae abajo-derecha y se mueve con la rotación.
    const dx = (0.55 - Math.sin(ry) * 1.25) * index * unit;
    const dy = (0.6 + Math.sin(rx) * 1.25) * index * unit;
    return { transform: [{ translateX: dx }, { translateY: dy }] };
  });

  return (
    <Animated.Text style={[styles.glyph, glyphSize(size), styles.layer, { color }, style]}>
      {char}
    </Animated.Text>
  );
}

function Letter3D({ char, size, palette, tiltX, tiltY, spin, sheen, pos }: LetterProps) {
  const unit = size / 96;

  const faceStyle = useAnimatedStyle(() => {
    const distance = Math.abs(sheen.value - pos);
    const glow = Math.max(0, 1 - distance / 0.16);
    return { color: interpolateColor(glow, [0, 1], [palette.face, palette.highlight]) };
  });

  const layers = [];
  for (let i = DEPTH; i >= 1; i--) {
    layers.push(
      <ExtrusionLayer
        key={i}
        index={i}
        char={char}
        size={size}
        color={mixHex(palette.sideNear, palette.sideFar, i / DEPTH)}
        tiltX={tiltX}
        tiltY={tiltY}
        spin={spin}
      />,
    );
  }

  return (
    <View>
      {layers}
      {/* Bisel: filo de luz arriba-izquierda */}
      <Animated.Text
        style={[
          styles.glyph,
          glyphSize(size),
          styles.layer,
          { color: palette.bevel, transform: [{ translateX: -0.9 * unit }, { translateY: -0.9 * unit }] },
        ]}
      >
        {char}
      </Animated.Text>
      <Animated.Text style={[styles.glyph, glyphSize(size), faceStyle]}>{char}</Animated.Text>
    </View>
  );
}

export function Logo3D({ size = 72, variant = 'dark', interactive = true, delay = 0 }: Logo3DProps) {
  const reduceMotion = useReducedMotion();

  const tiltX = useSharedValue(0);
  const tiltY = useSharedValue(0);
  const startX = useSharedValue(0);
  const startY = useSharedValue(0);
  const spin = useSharedValue(reduceMotion ? 0 : -720);
  const dIn = useSharedValue(reduceMotion ? 1 : 0);
  const amacIn = useSharedValue(reduceMotion ? 1 : 0);
  const sheen = useSharedValue(-0.4);
  const zero = useSharedValue(0);

  const amacPalette = variant === 'dark' ? WHITE : RED;
  const shadowStrength = variant === 'dark' ? 0.6 : 0.3;

  useEffect(() => {
    if (reduceMotion) return;
    dIn.value = withDelay(delay, withTiming(1, { duration: 1300, easing: INTRO }));
    spin.value = withDelay(delay, withTiming(0, { duration: 1700, easing: INTRO }));
    amacIn.value = withDelay(delay + 750, withTiming(1, { duration: 900, easing: INTRO }));
    sheen.value = withDelay(delay + 1650, withTiming(1.4, { duration: 1100, easing: Easing.inOut(Easing.quad) }));
  }, [reduceMotion, delay, dIn, spin, amacIn, sheen]);

  const replay = () => {
    'worklet';
    scheduleOnRN(tapHaptic);
    // Parte del valor actual en pantalla: interrumpible en cualquier momento.
    spin.value = withTiming(spin.value - 360 - (spin.value % 360), { duration: 1100, easing: INTRO });
    sheen.value = -0.4;
    sheen.value = withDelay(500, withTiming(1.4, { duration: 1000, easing: Easing.inOut(Easing.quad) }));
  };

  const pan = Gesture.Pan()
    .minDistance(4)
    .onBegin(() => {
      startX.value = tiltX.value;
      startY.value = tiltY.value;
    })
    .onUpdate((e) => {
      tiltY.value = rubberband(startY.value + e.translationX * 0.35, MAX_TILT);
      tiltX.value = rubberband(startX.value - e.translationY * 0.35, MAX_TILT);
    })
    .onFinalize((e) => {
      // Hereda la velocidad del dedo: sin "costura" entre arrastre y animación.
      tiltY.value = withSpring(0, { ...springs.momentum, velocity: e.velocityX * 0.2 });
      tiltX.value = withSpring(0, { ...springs.momentum, velocity: -e.velocityY * 0.2 });
    });

  const tap = Gesture.Tap().maxDuration(250).enabled(interactive).onEnd(replay);
  const gesture = Gesture.Race(pan.enabled(interactive), tap);

  const stageStyle = useAnimatedStyle(() => ({
    transform: [{ perspective: 900 }, { rotateX: `${tiltX.value}deg` }, { rotateY: `${tiltY.value}deg` }],
  }));

  const dStyle = useAnimatedStyle(() => {
    const p = dIn.value;
    return {
      opacity: Math.min(1, p * 2.5),
      transform: [
        { perspective: 900 },
        { translateX: (1 - p) * -size * 2.4 },
        { scale: 0.45 + 0.55 * p },
        { rotateY: `${spin.value}deg` },
        { rotateX: `${(1 - p) * 35}deg` },
      ],
    };
  });

  const shadowStyle = useAnimatedStyle(() => ({
    opacity: (shadowStrength - Math.abs(tiltX.value) / 90) * Math.max(dIn.value, amacIn.value),
    transform: [
      { translateX: tiltY.value * -1.6 },
      { scaleX: 1 - Math.abs(tiltY.value) / 120 },
      { scaleY: 1 + tiltX.value / 60 },
    ],
  }));

  return (
    <GestureDetector gesture={gesture}>
      <View style={styles.wrap} accessible accessibilityRole="image" accessibilityLabel="DAMAC">
        {variant === 'dark' && <View pointerEvents="none" style={[styles.glow, glowSize(size)]} />}
        <Animated.View style={[styles.row, stageStyle]}>
          <Animated.View style={dStyle}>
            <Letter3D char="D" size={size} palette={RED} tiltX={tiltX} tiltY={tiltY} spin={spin} sheen={sheen} pos={0.05} />
          </Animated.View>
          {['A', 'M', 'A', 'C'].map((char, i) => (
            <AmacLetter
              key={i}
              index={i}
              char={char}
              size={size}
              palette={amacPalette}
              tiltX={tiltX}
              tiltY={tiltY}
              spin={zero}
              sheen={sheen}
              progress={amacIn}
              pos={0.28 + i * 0.2}
            />
          ))}
        </Animated.View>
        <Animated.View pointerEvents="none" style={[styles.floorShadow, floorSize(size), shadowStyle]} />
      </View>
    </GestureDetector>
  );
}

function AmacLetter({
  index,
  progress,
  ...letter
}: LetterProps & { index: number; progress: SharedValue<number> }) {
  const style = useAnimatedStyle(() => {
    // Escalonado por letra a partir de un único progreso.
    const local = Math.min(1, Math.max(0, progress.value * 1.6 - index * 0.2));
    return {
      opacity: local,
      transform: [
        { perspective: 700 },
        { translateX: (1 - local) * -letter.size * 0.35 },
        { rotateY: `${(1 - local) * -75}deg` },
      ],
    };
  });

  return (
    <Animated.View style={style}>
      <Letter3D {...letter} />
    </Animated.View>
  );
}

const glyphSize = (size: number) => ({
  fontSize: size,
  lineHeight: Math.round(size * 1.08),
  letterSpacing: -size * 0.02,
});

const glowSize = (size: number) => ({
  width: size * 2.6,
  height: size * 0.7,
  borderRadius: size,
  boxShadow: `0 0 ${size * 1.6}px ${size * 0.5}px rgba(227, 6, 20, 0.2)`,
});

const floorSize = (size: number) => ({
  width: size * 3.6,
  height: size * 0.08,
  borderRadius: size,
  marginTop: size * 0.22,
  boxShadow: `0 0 ${size * 0.5}px ${size * 0.1}px rgba(0, 0, 0, 0.45)`,
});

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center', paddingVertical: 12, paddingHorizontal: 24 },
  row: { flexDirection: 'row', alignItems: 'flex-end' },
  glyph: {
    fontFamily: font,
    fontWeight: '900',
    includeFontPadding: false,
  },
  layer: { position: 'absolute', left: 0, top: 0 },
  glow: { position: 'absolute', backgroundColor: 'rgba(227, 6, 20, 0.2)' },
  floorShadow: { backgroundColor: 'rgba(0, 0, 0, 0.3)' },
});
