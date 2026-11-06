import { createElement, useRef } from 'react';
import { Text, View } from 'react-native';
import { colors, font, radius, spacing, useTheme } from '../theme';
import { dateFieldStyles as styles } from './DateField.styles';

/**
 * Web: el selector de fecha del navegador (<input type="date">), que abre un calendario.
 * Misma API que DateField.jsx: `value`/`onChange` con texto AAAA-MM-DD.
 */
export function DateField({ label, value, onChange, error, hint, minimumDate, maximumDate, style }) {
  const { scheme } = useTheme();
  return (
    <View style={[styles.wrap, style]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      {createElement('input', {
        type: 'date',
        value: value || '',
        min: minimumDate,
        max: maximumDate,
        'aria-label': label,
        onChange: (e) => onChange(e.target.value),
        // En la mayoría de los navegadores, tocar en cualquier parte abre el calendario.
        onClick: (e) => e.currentTarget.showPicker?.(),
        style: {
          minHeight: 50,
          boxSizing: 'border-box',
          width: '100%',
          padding: `0 ${spacing.lg}px`,
          borderRadius: radius.md,
          border: `1.5px solid ${error ? colors.danger : 'transparent'}`,
          background: colors.fill,
          color: colors.text,
          fontSize: font.body,
          fontFamily: 'inherit',
          outline: 'none',
          colorScheme: scheme,
          cursor: 'pointer',
        },
      })}
      {error ? <Text style={styles.error}>{error}</Text> : hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
}

/**
 * Web: abre el selector del navegador desde cualquier botón con un <input type="date"> invisible.
 * Devuelve { open, picker } igual que la versión nativa (`picker` hay que renderizarlo).
 */
export function useDatePicker({ value, onChange, minimumDate, maximumDate }) {
  const ref = useRef(null);
  const open = () => {
    const input = ref.current;
    if (!input) return;
    if (input.showPicker) input.showPicker();
    else input.click();
  };
  const picker = (
    <input
      ref={ref}
      type="date"
      value={value || ''}
      min={minimumDate}
      max={maximumDate}
      tabIndex={-1}
      aria-hidden
      onChange={(e) => e.target.value && onChange(e.target.value)}
      style={{ position: 'absolute', opacity: 0, width: 1, height: 1, pointerEvents: 'none', bottom: 0, left: '50%' }}
    />
  );
  return { open, picker };
}
