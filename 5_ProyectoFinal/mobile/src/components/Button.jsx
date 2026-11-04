import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, Platform, Pressable, StyleSheet, Text, useWindowDimensions } from 'react-native';
import { colors, continuous, createStyles, font, radius, spacing, useTheme } from '../theme';

const variants = () => ({
  primary: { bg: colors.primary, fg: colors.onPrimary, border: colors.primary },
  secondary: { bg: colors.cardAlt, fg: colors.text, border: colors.cardAlt },
  tinted: { bg: colors.primarySoft, fg: colors.primary, border: 'transparent' },
  outline: { bg: 'transparent', fg: colors.text, border: colors.border },
  danger: { bg: colors.dangerSoft, fg: colors.danger, border: 'transparent' },
  ghost: { bg: 'transparent', fg: colors.primary, border: 'transparent' },
});

/**
 * Botón en forma de cápsula. Responde al tocar (no al soltar) achicándose levemente.
 * En el celular ocupa todo el ancho (blanco fácil para el dedo). En la web de escritorio toma el
 * ancho de su texto y es más bajo, como un botón de PC; `block` lo fuerza a ocupar todo el ancho.
 */
export function Button({ title, onPress, variant = 'primary', icon, loading = false, disabled = false, style, small, block }) {
  useTheme();
  const { width } = useWindowDimensions();
  const desktop = Platform.OS === 'web' && width >= 700 && !block;
  const v = variants()[variant];
  const isDisabled = disabled || loading;
  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      style={({ pressed }) => [
        styles.base,
        continuous,
        desktop && styles.desktop,
        small && styles.small,
        { backgroundColor: v.bg, borderColor: v.border, opacity: isDisabled ? 0.4 : pressed ? 0.85 : 1 },
        pressed && !isDisabled && styles.pressed,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={v.fg} />
      ) : (
        <>
          {icon ? <Ionicons name={icon} size={small ? 16 : 19} color={v.fg} /> : null}
          {title ? (
            <Text style={[styles.text, small && styles.smallText, { color: v.fg }]} numberOfLines={1}>
              {title}
            </Text>
          ) : null}
        </>
      )}
    </Pressable>
  );
}

const styles = createStyles(() => StyleSheet.create({
  base: {
    minHeight: 50,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.pill,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  pressed: { transform: [{ scale: 0.97 }] },
  desktop: { alignSelf: 'flex-start', minHeight: 40, paddingHorizontal: spacing.lg },
  small: { minHeight: 34, paddingHorizontal: spacing.md },
  text: { fontSize: font.body, fontWeight: '600', letterSpacing: -0.2 },
  smallText: { fontSize: font.md },
}));
