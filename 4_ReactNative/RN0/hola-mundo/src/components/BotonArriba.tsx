import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  Easing,
  useAnimatedReaction,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { PressableScale } from './PressableScale';

const EASE_OUT = Easing.bezier(0.23, 1, 0.32, 1);

interface BotonArribaProps {
  /** Desplazamiento actual de la lista (valor compartido, se lee en el hilo de UI). */
  scrollY: SharedValue<number>;
  onPress: () => void;
  /** Distancia desde abajo (por ejemplo, el alto de la barra de pestañas). */
  abajo: number;
  color: string;
  colorIcono: string;
  /** A partir de cuántos puntos de desplazamiento aparece. */
  umbral?: number;
}

/**
 * Flecha flotante para volver arriba. Aparece al bajar (escala 0.9 → 1 + opacidad, 220 ms ease-out)
 * y se va al subir. React solo se entera al cruzar el umbral, nunca en cada cuadro.
 */
export function BotonArriba({ scrollY, onPress, abajo, color, colorIcono, umbral = 360 }: BotonArribaProps) {
  const reducir = useReducedMotion();
  const visible = useSharedValue(0);
  const [tocable, setTocable] = useState(false);

  useAnimatedReaction(
    () => scrollY.get() > umbral,
    (mostrar, antes) => {
      if (mostrar === antes) return;
      visible.set(withTiming(mostrar ? 1 : 0, { duration: mostrar ? 220 : 160, easing: EASE_OUT }));
      scheduleOnRN(setTocable, mostrar);
    },
  );

  const estilo = useAnimatedStyle(() => ({
    opacity: visible.get(),
    transform: [{ scale: reducir ? 1 : 0.9 + visible.get() * 0.1 }],
  }));

  return (
    <Animated.View style={[styles.flotante, { bottom: abajo }, estilo]} pointerEvents={tocable ? 'auto' : 'none'}>
      <PressableScale
        onPress={onPress}
        pressedScale={0.92}
        accessibilityRole="button"
        accessibilityLabel="Volver arriba"
        style={[styles.boton, { backgroundColor: color }]}
      >
        <Ionicons name="arrow-up" size={22} color={colorIcono} />
      </PressableScale>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  flotante: { position: 'absolute', right: 12 },
  boton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
});
