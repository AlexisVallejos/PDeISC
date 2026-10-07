import Ionicons from '@expo/vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';
import type { ComponentProps } from 'react';
import { Platform, Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { font } from '../theme';

export interface OpcionSegmento<T extends string> {
  valor: T;
  titulo: string;
  icono?: ComponentProps<typeof Ionicons>['name'];
}

interface SegmentadoProps<T extends string> {
  opciones: OpcionSegmento<T>[];
  valor: T;
  onCambiar: (valor: T) => void;
  etiqueta: string;
  /** Colores del tema actual. */
  colores: { pista: string; activo: string; texto: string; textoActivo: string };
}

/**
 * Control segmentado de iOS: pista gris y el segmento elegido "levantado".
 * El cambio es instantáneo (se toca muchas veces) y vibra una vez al elegir.
 */
export function Segmentado<T extends string>({ opciones, valor, onCambiar, etiqueta, colores }: SegmentadoProps<T>) {
  return (
    <View style={[styles.pista, { backgroundColor: colores.pista }]} accessibilityRole="radiogroup" accessibilityLabel={etiqueta}>
      {opciones.map((o) => {
        const activo = o.valor === valor;
        return (
          <Pressable
            key={o.valor}
            onPress={() => {
              if (activo) return;
              if (Platform.OS !== 'web') Haptics.selectionAsync();
              onCambiar(o.valor);
            }}
            accessibilityRole="radio"
            accessibilityState={{ selected: activo }}
            accessibilityLabel={o.titulo}
            style={[styles.segmento, webControl, activo && [styles.activo, { backgroundColor: colores.activo }]]}
          >
            {o.icono && <Ionicons name={o.icono} size={16} color={activo ? colores.textoActivo : colores.texto} />}
            <Text
              style={[styles.texto, { color: activo ? colores.textoActivo : colores.texto, fontWeight: activo ? '600' : '500' }]}
              numberOfLines={1}
            >
              {o.titulo}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const webControl = Platform.OS === 'web' ? ({ userSelect: 'none', cursor: 'pointer' } as ViewStyle) : undefined;

const styles = StyleSheet.create({
  pista: { flexDirection: 'row', padding: 3, borderRadius: 12 },
  segmento: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    minHeight: 38,
    paddingHorizontal: 6,
    borderRadius: 9,
  },
  activo: { shadowColor: '#000', shadowOpacity: 0.14, shadowRadius: 4, shadowOffset: { width: 0, height: 1 }, elevation: 2 },
  texto: { fontFamily: font, fontSize: 14, lineHeight: 18 },
});
