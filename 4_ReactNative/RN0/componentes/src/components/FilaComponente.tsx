import Ionicons from '@expo/vector-icons/Ionicons';
import { memo } from 'react';
import { Platform, Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { radius, space, type as t, useTheme } from '../theme';
import type { Componente } from '../types/componente';
import { Etiquetas } from './Etiqueta';
import { IconoFicha } from './IconoFicha';

interface FilaComponenteProps {
  componente: Componente;
  primera: boolean;
  ultima: boolean;
  onPress: (id: string) => void;
}

/**
 * Fila de lista "inset grouped" de iOS: el fondo se resalta al presionar (como en Ajustes),
 * sin escala ni vibración, porque se toca decenas de veces.
 * Memorizada: la lista no la redibuja si sus datos no cambiaron.
 */
export const FilaComponente = memo(function FilaComponente({ componente, primera, ultima, onPress }: FilaComponenteProps) {
  const c = useTheme();
  return (
    <Pressable
      onPress={() => onPress(componente.id)}
      accessibilityRole="button"
      accessibilityLabel={`${componente.nombre}. ${componente.resumen}`}
      accessibilityHint="Abre la ficha con la demo"
      style={({ pressed }) => [
        styles.fila,
        webControl,
        { backgroundColor: pressed ? c.cardPressed : c.card },
        primera && styles.primera,
        ultima && styles.ultima,
      ]}
    >
      <IconoFicha nombre={componente.icono} />
      <View style={[styles.cuerpo, !ultima && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: c.separator }]}>
        <View style={styles.textos}>
          <View style={styles.titulo}>
            <Text style={[styles.nombre, { color: c.label }]}>{componente.nombre}</Text>
            <Etiquetas componente={componente} />
          </View>
          <Text style={[styles.resumen, { color: c.secondaryLabel }]} numberOfLines={2}>
            {componente.resumen}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={c.tertiaryLabel} />
      </View>
    </Pressable>
  );
});

const webControl = Platform.OS === 'web' ? ({ userSelect: 'none', touchAction: 'manipulation', cursor: 'pointer' } as ViewStyle) : undefined;

const styles = StyleSheet.create({
  fila: { flexDirection: 'row', alignItems: 'center', gap: space.md, paddingLeft: space.lg, minHeight: 64 },
  primera: { borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg },
  ultima: { borderBottomLeftRadius: radius.lg, borderBottomRightRadius: radius.lg },
  cuerpo: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: space.sm, alignSelf: 'stretch', paddingVertical: space.md, paddingRight: space.md },
  textos: { flex: 1, gap: 2 },
  titulo: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: space.sm },
  nombre: { ...t.headline },
  resumen: { ...t.subhead },
});
