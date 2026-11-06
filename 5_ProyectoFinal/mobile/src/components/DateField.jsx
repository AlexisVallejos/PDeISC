import { Ionicons } from '@expo/vector-icons';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Modal, Platform, Pressable, Text, View } from 'react-native';
import { colors, continuous, useTheme } from '../theme';
import { dateFieldStyles as styles } from './DateField.styles';
import { formatLongDate, parseIsoDate, toIsoDate } from '../utils/dates';

/**
 * Campo de fecha que abre un calendario para elegirla (no hay que escribir AAAA-MM-DD).
 * - Android: el calendario del sistema (tocando el año arriba se elige el año).
 * - iOS: calendario en una hoja que sube desde abajo.
 * - Web: DateField.web.jsx usa el selector de fecha del navegador.
 * `value` y `onChange` usan texto AAAA-MM-DD ('' si no hay fecha).
 */
/**
 * Abre el calendario de fecha desde cualquier botón. Devuelve { open, picker }: `picker` es la hoja
 * del calendario en iOS (hay que renderizarlo); en Android es null porque se usa el diálogo del sistema.
 */
export function useDatePicker({ value, onChange, minimumDate, maximumDate, initialDate }) {
  useTheme();
  const [iosOpen, setIosOpen] = useState(false);
  const [draft, setDraft] = useState(null);
  const current = value ? parseIsoDate(value) : initialDate ? parseIsoDate(initialDate) : new Date();
  const min = minimumDate ? parseIsoDate(minimumDate) : undefined;
  const max = maximumDate ? parseIsoDate(maximumDate) : undefined;

  const open = () => {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: current,
        mode: 'date',
        minimumDate: min,
        maximumDate: max,
        positiveButton: { label: 'Listo' },
        negativeButton: { label: 'Cancelar' },
        onChange: (event, date) => {
          if (event.type === 'set' && date) onChange(toIsoDate(date));
        },
      });
    } else {
      setDraft(current);
      setIosOpen(true);
    }
  };

  const picker =
    Platform.OS === 'ios' ? (
      <Modal visible={iosOpen} transparent animationType="slide" onRequestClose={() => setIosOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setIosOpen(false)} accessibilityLabel="Cerrar calendario" />
        <View style={styles.sheet}>
          <View style={styles.sheetHeader}>
            <Pressable onPress={() => setIosOpen(false)} hitSlop={10}>
              <Text style={styles.cancel}>Cancelar</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                if (draft) onChange(toIsoDate(draft));
                setIosOpen(false);
              }}
              hitSlop={10}
            >
              <Text style={styles.done}>Listo</Text>
            </Pressable>
          </View>
          <DateTimePicker
            value={draft ?? current}
            mode="date"
            display="inline"
            locale="es-AR"
            minimumDate={min}
            maximumDate={max}
            accentColor={colors.primary}
            onChange={(_e, date) => date && setDraft(date)}
          />
        </View>
      </Modal>
    ) : null;

  return { open, picker };
}

export function DateField({ label, value, onChange, error, hint, placeholder = 'Elegí una fecha', minimumDate, maximumDate, initialDate, style }) {
  useTheme();
  const { open, picker } = useDatePicker({ value, onChange, minimumDate, maximumDate, initialDate });

  return (
    <View style={[styles.wrap, style]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <Pressable
        onPress={open}
        accessibilityRole="button"
        accessibilityLabel={`${label ?? 'Fecha'}: ${value ? formatLongDate(value) : 'sin elegir'}. Tocá para abrir el calendario`}
        style={({ pressed }) => [styles.input, continuous, error && styles.inputError, pressed && { opacity: 0.7 }]}
      >
        <Text style={[styles.value, !value && styles.placeholder]} numberOfLines={1}>
          {value ? formatLongDate(value) : placeholder}
        </Text>
        <Ionicons name="calendar-outline" size={20} color={colors.primary} />
      </Pressable>
      {error ? <Text style={styles.error}>{error}</Text> : hint ? <Text style={styles.hint}>{hint}</Text> : null}
      {picker}
    </View>
  );
}
