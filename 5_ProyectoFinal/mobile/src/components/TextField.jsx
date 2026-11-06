import { Ionicons } from '@expo/vector-icons';
import { forwardRef, useState } from 'react';
import { DeviceEventEmitter, Keyboard, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors, continuous, createStyles, font, radius, spacing, useTheme } from '../theme';
import { INPUT_FOCUS_EVENT } from './KeyboardAvoider';

/**
 * Input con etiqueta y mensaje de error debajo. Al enfocarse se marca con el color de acento.
 * Los de contraseña (secureTextEntry) traen un ojito para mostrar u ocultar lo escrito.
 */
export const TextField = forwardRef(function TextField(
  { label, error, hint, style, onFocus, onBlur, secureTextEntry, ...props },
  ref,
) {
  useTheme();
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(true);
  const isPassword = Boolean(secureTextEntry);
  return (
    <View style={[styles.wrap, style]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View>
      <TextInput
        ref={ref}
        placeholderTextColor={colors.muted}
        selectionColor={colors.primary}
        cursorColor={colors.primary}
        style={[
          styles.input,
          continuous,
          focused && styles.inputFocused,
          error && styles.inputError,
          props.multiline && styles.multiline,
          isPassword && styles.withEye,
        ]}
        secureTextEntry={isPassword && hidden}
        accessibilityLabel={label}
        onFocus={(e) => {
          setFocused(true);
          // Con el teclado ya abierto, la pantalla desplaza este campo a la vista (ver KeyboardAvoider).
          if (Platform.OS !== 'web' && Keyboard.isVisible()) DeviceEventEmitter.emit(INPUT_FOCUS_EVENT);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        {...props}
      />
      {isPassword ? (
        <Pressable
          onPress={() => setHidden((h) => !h)}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={hidden ? 'Mostrar contraseña' : 'Ocultar contraseña'}
          style={styles.eye}
        >
          <Ionicons name={hidden ? 'eye-outline' : 'eye-off-outline'} size={22} color={colors.muted} />
        </Pressable>
      ) : null}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
});

const styles = createStyles(() => StyleSheet.create({
  wrap: { gap: 6 },
  label: { color: colors.muted, fontSize: font.sm, fontWeight: '500', marginLeft: spacing.xs },
  input: {
    minHeight: 50,
    backgroundColor: colors.fill,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: 'transparent',
    color: colors.text,
    paddingHorizontal: spacing.lg,
    // 17 px (body de iOS): con menos de 16 px Safari hace zoom al enfocar el campo
    fontSize: font.body,
    // en web el borde verde de foco reemplaza al contorno del navegador
    ...(Platform.OS === 'web' ? { outlineStyle: 'none' } : null),
  },
  inputFocused: { borderColor: colors.primary },
  withEye: { paddingRight: 52 },
  eye: { position: 'absolute', right: 4, top: 0, bottom: 0, width: 44, alignItems: 'center', justifyContent: 'center' },
  multiline: { minHeight: 96, paddingTop: spacing.md, textAlignVertical: 'top' },
  inputError: { borderColor: colors.danger },
  error: { color: colors.danger, fontSize: font.xs, marginLeft: spacing.xs },
  hint: { color: colors.muted, fontSize: font.xs, marginLeft: spacing.xs },
}));
