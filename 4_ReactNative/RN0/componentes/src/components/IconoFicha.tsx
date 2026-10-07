import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '../theme';
import type { IconName } from '../types/componente';

/** Ícono en un cuadrado redondeado verde, como los íconos de Ajustes de iOS. */
export function IconoFicha({ nombre, tamaño = 36, suave = false }: { nombre: IconName; tamaño?: number; suave?: boolean }) {
  const c = useTheme();
  return (
    <View
      style={[styles.tile, { width: tamaño, height: tamaño, borderRadius: tamaño * 0.27, backgroundColor: suave ? c.tintSoft : c.tint }]}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <Ionicons name={nombre} size={tamaño * 0.56} color={suave ? c.tint : c.onTint} />
    </View>
  );
}

const styles = StyleSheet.create({
  tile: { alignItems: 'center', justifyContent: 'center' },
});
