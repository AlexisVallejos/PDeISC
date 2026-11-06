import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, continuous, createStyles, font, radius, useTheme } from '../theme';
import { addDays, formatDayLabel, today } from '../utils/dates';
import { useDatePicker } from './DateField';

/**
 * Navegación día por día (‹ Hoy ›). Tocar la fecha abre el calendario para saltar a cualquier día;
 * mantenerla apretada vuelve a hoy.
 */
export function DateSwitcher({ date, onChange }) {
  useTheme();
  const { open, picker } = useDatePicker({ value: date, onChange });
  return (
    <View style={[styles.row, continuous]}>
      <Pressable
        style={({ pressed }) => [styles.arrow, pressed && styles.pressed]}
        onPress={() => onChange(addDays(date, -1))}
        accessibilityLabel="Día anterior"
      >
        <Ionicons name="chevron-back" size={22} color={colors.primary} />
      </Pressable>
      <Pressable
        onPress={open}
        onLongPress={() => onChange(today())}
        style={({ pressed }) => [styles.center, pressed && styles.pressed]}
        accessibilityRole="button"
        accessibilityLabel={`${formatDayLabel(date)}. Tocá para elegir otro día en el calendario`}
      >
        <View style={styles.labelRow}>
          <Text style={styles.label}>{formatDayLabel(date)}</Text>
          <Ionicons name="calendar-outline" size={16} color={colors.primary} />
        </View>
        <Text style={styles.sub}>{date}</Text>
        {picker}
      </Pressable>
      <Pressable
        style={({ pressed }) => [styles.arrow, pressed && styles.pressed]}
        onPress={() => onChange(addDays(date, 1))}
        accessibilityLabel="Día siguiente"
      >
        <Ionicons name="chevron-forward" size={22} color={colors.primary} />
      </Pressable>
    </View>
  );
}

const styles = createStyles(() => StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.lg,
  },
  arrow: { width: 52, height: 54, alignItems: 'center', justifyContent: 'center' },
  pressed: { opacity: 0.5 },
  center: { flex: 1, alignItems: 'center' },
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  label: { color: colors.text, fontSize: font.lg, fontWeight: '600' },
  sub: { color: colors.muted, fontSize: font.xs },
}));
