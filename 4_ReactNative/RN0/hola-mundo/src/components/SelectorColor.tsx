import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Text, View } from 'react-native';
import { PALETAS, type PaletaId } from '../paletas';
import { font } from '../theme';
import { PressableScale } from './PressableScale';

interface SelectorColorProps {
  valor: PaletaId;
  onCambiar: (id: PaletaId) => void;
  /** Sobre fondo oscuro se muestra el tono brillante; sobre claro, el tono claro. */
  fondo: 'oscuro' | 'claro';
  /** Color del anillo y de los nombres. */
  tinta: string;
}

/**
 * Fila de círculos de color, como el selector de acento de Ajustes de macOS.
 * Cada círculo mide 44 pt (área táctil mínima); el elegido lleva anillo y tilde.
 */
export function SelectorColor({ valor, onCambiar, fondo, tinta }: SelectorColorProps) {
  return (
    <View style={styles.fila} accessibilityRole="radiogroup" accessibilityLabel="Color de acento">
      {PALETAS.map((p) => {
        const elegido = p.id === valor;
        const color = fondo === 'oscuro' ? p.brillante : p.claro;
        return (
          <View key={p.id} style={styles.opcion}>
            <PressableScale
              onPress={() => onCambiar(p.id)}
              pressedScale={0.9}
              accessibilityRole="radio"
              accessibilityState={{ selected: elegido }}
              accessibilityLabel={p.nombre}
              style={[styles.anillo, { borderColor: elegido ? tinta : 'transparent' }]}
            >
              <View style={[styles.circulo, { backgroundColor: color }]}>
                {elegido && <Ionicons name="checkmark" size={18} color={fondo === 'oscuro' ? '#000000' : '#FFFFFF'} />}
              </View>
            </PressableScale>
            <Text style={[styles.nombre, { color: tinta, opacity: elegido ? 1 : 0.6 }]} numberOfLines={1}>
              {p.nombre}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  fila: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  opcion: { alignItems: 'center', gap: 6, width: 52 },
  anillo: { width: 46, height: 46, borderRadius: 23, borderWidth: 2.5, alignItems: 'center', justifyContent: 'center' },
  circulo: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  nombre: { fontFamily: font, fontSize: 11, lineHeight: 14, fontWeight: '600' },
});
