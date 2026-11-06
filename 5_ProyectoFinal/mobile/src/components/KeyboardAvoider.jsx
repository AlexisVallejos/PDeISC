import { useCallback, useEffect, useRef, useState } from 'react';
import { DeviceEventEmitter, Keyboard, KeyboardAvoidingView, Platform, TextInput, View } from 'react-native';

/** Aviso interno: un campo se enfocó con el teclado ya abierto (lo emite TextField). */
export const INPUT_FOCUS_EVENT = 'macroentreno.inputFocus';

/**
 * Achica su contenido cuando aparece el teclado, en iOS y en Android, para que nunca tape lo
 * que se escribe. En Android (SDK 58, pantalla de borde a borde) el sistema ya no achica la
 * ventana solo: hace falta en las dos plataformas.
 * Mide su posición en la pantalla para calcular bien cuánto tapa el teclado, haya encabezado o no.
 */
export function KeyboardAvoider({ style, children }) {
  const ref = useRef(null);
  const [offset, setOffset] = useState(0);
  const measure = useCallback(() => {
    ref.current?.measureInWindow?.((_x, y) => {
      if (Number.isFinite(y)) setOffset(y);
    });
  }, []);

  if (Platform.OS === 'web') return <View style={style}>{children}</View>;
  return (
    <View ref={ref} style={style} onLayout={measure} collapsable={false}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" keyboardVerticalOffset={offset}>
        {children}
      </KeyboardAvoidingView>
    </View>
  );
}

/** Margen entre el campo y el teclado. */
const GAP = 24;

/**
 * Para un ScrollView con campos: cuando se abre el teclado (o se pasa a otro campo con el teclado
 * abierto) desplaza la lista hasta que el campo enfocado quede a la vista.
 * Devuelve el onScroll que hay que pasarle al ScrollView (para saber dónde está parado).
 */
export function useScrollToFocusedInput(scrollRef) {
  const offsetY = useRef(0);

  useEffect(() => {
    if (Platform.OS === 'web') return undefined;
    let timer;
    const reveal = (keyboardTop) => {
      clearTimeout(timer);
      // Se espera a que el KeyboardAvoider termine de achicar la vista.
      timer = setTimeout(() => {
        const input = TextInput.State.currentlyFocusedInput?.();
        if (!input?.measureInWindow || !Number.isFinite(keyboardTop)) return;
        input.measureInWindow((_x, y, _w, h) => {
          const overflow = y + h + GAP - keyboardTop;
          if (overflow > 0) scrollRef.current?.scrollTo({ y: offsetY.current + overflow, animated: true });
        });
      }, 80);
    };
    const subs = [
      Keyboard.addListener('keyboardDidShow', (e) => reveal(e.endCoordinates.screenY)),
      DeviceEventEmitter.addListener(INPUT_FOCUS_EVENT, () => {
        const metrics = Keyboard.metrics();
        if (metrics) reveal(metrics.screenY);
      }),
    ];
    return () => {
      clearTimeout(timer);
      subs.forEach((s) => s.remove());
    };
  }, [scrollRef]);

  return useCallback((e) => {
    offsetY.current = e.nativeEvent.contentOffset.y;
  }, []);
}
