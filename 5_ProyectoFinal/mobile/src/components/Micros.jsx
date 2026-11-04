import { StyleSheet, Text, View } from 'react-native';
import { colors, createStyles, font, numeric, radius, spacing, useTheme } from '../theme';
import { fmt } from '../utils/format';

/** Color de la barra: las metas se ponen verdes al cumplirse; los límites, naranja cerca y rojo pasados. */
function barColor(n) {
  if (n.kind === 'limit') return n.percent > 100 ? colors.danger : n.percent >= 80 ? colors.warning : colors.secondary;
  return n.percent >= 100 ? colors.primary : colors.primaryMuted;
}

/**
 * Micronutrientes contra el valor diario de referencia, al estilo de la app Salud.
 * `nutrients` viene de la API (resumen del día o promedio del período).
 */
export function MicroList({ nutrients, note }) {
  useTheme();
  const withData = nutrients.filter((n) => n.value !== null);
  const partial = nutrients.some((n) => n.value !== null && n.known < n.entries);
  if (!withData.length) {
    return <Text style={styles.empty}>Ningún registro trae micronutrientes. Buscá en FatSecret al registrar una comida para sumarlos.</Text>;
  }
  return (
    <View style={styles.list}>
      {nutrients.map((n) => (
        <View key={n.key} style={styles.row} accessibilityLabel={`${n.label}: ${n.value === null ? 'sin datos' : `${fmt(n.value)} ${n.unit}, ${n.percent} % del valor diario`}`}>
          <View style={styles.head}>
            <Text style={styles.label}>
              {n.label}
              {n.kind === 'limit' ? <Text style={styles.kind}> · límite</Text> : null}
            </Text>
            <Text style={styles.value}>
              {n.value === null ? '—' : `${fmt(n.value)} ${n.unit}`}
              <Text style={styles.daily}> / {fmt(n.daily)} {n.unit}</Text>
            </Text>
          </View>
          <View style={styles.track}>
            {n.value !== null ? <View style={[styles.fill, { width: `${Math.min(n.percent, 100)}%`, backgroundColor: barColor(n) }]} /> : null}
          </View>
        </View>
      ))}
      <Text style={styles.note}>
        {note ?? 'Valores diarios de referencia para adultos (FDA).'}
        {partial ? ' Algunos alimentos no informan todos los micronutrientes: el total puede ser mayor.' : ''}
      </Text>
    </View>
  );
}


const styles = createStyles(() => StyleSheet.create({
  list: { gap: spacing.md },
  row: { gap: 6 },
  head: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.sm },
  label: { color: colors.text, fontSize: font.md, fontWeight: '500' },
  kind: { color: colors.muted, fontSize: font.xs, fontWeight: '400' },
  value: { ...numeric, color: colors.text, fontSize: font.sm, fontWeight: '600' },
  daily: { color: colors.muted, fontWeight: '400' },
  track: { height: 6, borderRadius: radius.pill, backgroundColor: colors.fill, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: radius.pill },
  note: { color: colors.muted, fontSize: font.xs },
  empty: { color: colors.muted, fontSize: font.sm },
}));
