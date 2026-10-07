import { useEffect } from 'react';
import { Easing, useAnimatedStyle, useReducedMotion, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';

const EASE_OUT = Easing.bezier(0.23, 1, 0.32, 1);

/**
 * Entrada al montar: sube 16 px y aparece (520 ms, ease-out fuerte), una sola vez.
 * Se hace con un valor compartido y no con `entering`: en la web, `entering` deja el elemento
 * en position: absolute cuando la pestaña se oculta y vuelve a mostrarse.
 * Con "reducir movimiento" solo cambia la opacidad.
 */
export function useEntrada(delay = 0) {
  const reducir = useReducedMotion();
  const progreso = useSharedValue(0);

  useEffect(() => {
    progreso.set(withDelay(delay, withTiming(1, { duration: reducir ? 200 : 520, easing: EASE_OUT })));
  }, [delay, progreso, reducir]);

  return useAnimatedStyle(() => ({
    opacity: progreso.get(),
    transform: [{ translateY: reducir ? 0 : (1 - progreso.get()) * 16 }],
  }));
}
