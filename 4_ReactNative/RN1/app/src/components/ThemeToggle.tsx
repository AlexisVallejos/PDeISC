import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../ThemeContext';
import { radius, space, type as t } from '../theme';
import { PressableScale } from './PressableScale';

export function ThemeToggle() {
  const { mode, palette, toggleTheme } = useTheme();
  const nextMode = mode === 'dark' ? 'claro' : 'oscuro';

  return (
    <PressableScale
      onPress={toggleTheme}
      pressedScale={0.95}
      accessibilityRole="button"
      accessibilityLabel={`Activar modo ${nextMode}`}
      style={[styles.button, { backgroundColor: palette.control, borderColor: palette.controlBorder }]}
    >
      <View style={styles.content}>
        <Text style={[styles.icon, { color: palette.label }]} accessibilityElementsHidden>
          {mode === 'dark' ? '☀' : '☾'}
        </Text>
        <Text style={[styles.label, { color: palette.label }]}>Modo {nextMode}</Text>
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 44,
    paddingHorizontal: space.md,
    borderWidth: 1,
    borderRadius: radius.pill,
    justifyContent: 'center',
  },
  content: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  icon: { fontSize: 20, lineHeight: 22 },
  label: { ...t.footnote, fontWeight: '600' },
});
