import * as Haptics from 'expo-haptics';
import { useEffect, useState } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedReaction, useAnimatedStyle, useSharedValue, withSpring, type SharedValue } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { font } from '../theme';

const PERILLA = 28;

interface DeslizadorProps {
  etiqueta: string;
  /** Valor compartido: la vista previa lo lee cuadro a cuadro, sin re-render de React. */
  valor: SharedValue<number>;
  min: number;
  max: number;
  paso: number;
  unidad?: string;
  /** Valor inicial para la etiqueta (no se lee el valor compartido durante el render). */
  inicial: number;
  /** Se llama una vez al soltar (o al tocar la pista) con el valor final: ahí se guarda. */
  onSoltar?: (valor: number) => void;
  colores: { pista: string; relleno: string; texto: string; texto2: string };
}

/**
 * Deslizador estilo iOS hecho con Gesture Handler + Reanimated:
 * - arrastrar sigue al dedo 1:1 en el hilo de UI; tocar la pista salta al punto
 * - al soltar se asienta en el paso más cercano con un resorte sin rebote
 * - el número de la etiqueta cambia solo cuando cruza un paso (no en cada cuadro)
 * - accesible: se ajusta con los gestos de VoiceOver / TalkBack (subir/bajar)
 */
export function Deslizador({ etiqueta, valor, min, max, paso, unidad = '', inicial, onSoltar, colores }: DeslizadorProps) {
  const ancho = useSharedValue(0);
  const [mostrado, setMostrado] = useState(inicial);

  // Si el valor guardado llega después de montar (se lee de AsyncStorage), la etiqueta lo sigue.
  useEffect(() => setMostrado(inicial), [inicial]);

  const redondear = (v: number) => {
    'worklet';
    return Math.min(max, Math.max(min, Math.round(v / paso) * paso));
  };
  const desdeX = (x: number) => {
    'worklet';
    const frac = ancho.get() > 0 ? Math.min(1, Math.max(0, x / ancho.get())) : 0;
    return min + frac * (max - min);
  };
  const terminar = (final: number) => {
    if (Platform.OS !== 'web') Haptics.selectionAsync();
    onSoltar?.(final);
  };

  // El número visible cambia solo al cruzar un paso.
  useAnimatedReaction(
    () => redondear(valor.get()),
    (actual, previo) => {
      if (actual !== previo) scheduleOnRN(setMostrado, actual);
    },
  );

  const arrastre = Gesture.Pan()
    .activeOffsetX([-6, 6])
    .failOffsetY([-12, 12])
    .onStart((e) => valor.set(desdeX(e.x)))
    .onUpdate((e) => valor.set(desdeX(e.x)))
    .onEnd(() => {
      const final = redondear(valor.get());
      valor.set(withSpring(final, { duration: 300, dampingRatio: 1 }));
      scheduleOnRN(terminar, final);
    });

  const toque = Gesture.Tap().onEnd((e) => {
    const final = redondear(desdeX(e.x));
    valor.set(withSpring(final, { duration: 300, dampingRatio: 1 }));
    scheduleOnRN(terminar, final);
  });

  const fraccion = () => {
    'worklet';
    return (valor.get() - min) / (max - min);
  };
  // Relleno absoluto y sin hijos: animar su ancho no mueve a nadie más.
  const relleno = useAnimatedStyle(() => ({ width: PERILLA / 2 + fraccion() * (ancho.get() - PERILLA) }));
  const perilla = useAnimatedStyle(() => ({ transform: [{ translateX: fraccion() * (ancho.get() - PERILLA) }] }));

  const ajustar = (delta: number) => {
    const nuevo = Math.min(max, Math.max(min, mostrado + delta));
    valor.set(withSpring(nuevo, { duration: 300, dampingRatio: 1 }));
    onSoltar?.(nuevo);
  };

  return (
    <View style={styles.contenedor}>
      <View style={styles.cabecera}>
        <Text style={[styles.etiqueta, { color: colores.texto }]}>{etiqueta}</Text>
        <Text style={[styles.valor, { color: colores.texto2 }]}>
          {mostrado}
          {unidad}
        </Text>
      </View>
      <GestureDetector gesture={Gesture.Race(arrastre, toque)}>
        <View
          style={styles.area}
          onLayout={(e) => ancho.set(e.nativeEvent.layout.width)}
          accessible
          accessibilityRole="adjustable"
          accessibilityLabel={etiqueta}
          accessibilityValue={{ min, max, now: mostrado, text: `${mostrado}${unidad}` }}
          accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
          onAccessibilityAction={(e) => ajustar(e.nativeEvent.actionName === 'increment' ? paso : -paso)}
        >
          <View style={[styles.pista, { backgroundColor: colores.pista }]} />
          <Animated.View style={[styles.relleno, { backgroundColor: colores.relleno }, relleno]} />
          <Animated.View style={[styles.perilla, perilla]} />
        </View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { gap: 2 },
  cabecera: { flexDirection: 'row', justifyContent: 'space-between' },
  etiqueta: { fontFamily: font, fontSize: 15, lineHeight: 20, fontWeight: '500' },
  valor: { fontFamily: font, fontSize: 15, lineHeight: 20, fontVariant: ['tabular-nums'] },
  // Área táctil de 44 pt aunque la pista mida 6.
  area: { height: 44, justifyContent: 'center' },
  pista: { height: 6, borderRadius: 3 },
  relleno: { position: 'absolute', left: 0, height: 6, borderRadius: 3 },
  perilla: {
    position: 'absolute',
    left: 0,
    width: PERILLA,
    height: PERILLA,
    borderRadius: PERILLA / 2,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOpacity: 0.22,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
});
