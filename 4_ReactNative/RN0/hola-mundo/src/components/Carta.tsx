import type { ReactNode } from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { useApariencia } from '../context/AparienciaContext';
import type { Tema } from '../tema';
import { space, type as t } from '../theme';

/** Sombra según la elevación (0–40). `fuerza` la intensifica para la capa del frente de la demo. */
export function sombra(elevacion: number, fuerza = 1) {
  'worklet';
  const e = Math.min(40, Math.max(0, elevacion)) * fuerza;
  return {
    shadowColor: '#000000',
    shadowOpacity: e === 0 ? 0 : Math.min(0.5, 0.08 + (e / 40) * 0.24),
    shadowRadius: e * 0.8,
    shadowOffset: { width: 0, height: e * 0.35 },
    elevation: e * 0.4,
  };
}

/**
 * Forma y profundidad de las cartas, tomadas de los valores compartidos (radio, borde, elevación).
 * Corren en el hilo de UI: al arrastrar un deslizador, todas las cartas cambian a la vez sin re-render.
 */
export function useEstiloCarta() {
  const { valores } = useApariencia();
  return useAnimatedStyle(() => ({
    borderRadius: valores.radioCartas.get(),
    borderWidth: valores.bordeCartas.get(),
    ...sombra(valores.elevacion.get()),
  }));
}

/** Carta de la pestaña Estilos: vidrio, con la forma y la elevación elegidas. */
export function Carta({ titulo, tema, children }: { titulo: string; tema: Tema; children: ReactNode }) {
  const estilo = useEstiloCarta();
  return (
    <Animated.View style={[styles.carta, { backgroundColor: tema.tarjeta, borderColor: tema.tarjetaBorde }, estilo]}>
      <Text style={[styles.titulo, { color: tema.texto3 }]}>{titulo}</Text>
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  carta: { gap: space.md, padding: space.xl },
  titulo: { ...t.eyebrow },
});
