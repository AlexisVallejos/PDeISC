import { forwardRef, useEffect, useState, type ReactNode } from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useTheme } from '../ThemeContext';
import { colors, radius, type as t, tapTarget } from '../theme';

/**
 * Formulario "inset grouped" al estilo iOS: un contenedor blanco con filas
 * separadas por una línea fina que arranca donde arranca el texto.
 */

const EASE_OUT = Easing.bezier(0.23, 1, 0.32, 1);

interface FormGroupProps {
  children: ReactNode;
  /** Resalta todo el grupo (error de validación). */
  invalid?: boolean;
  style?: ViewStyle;
}

export function FormGroup({ children, invalid, style }: FormGroupProps) {
  const { palette } = useTheme();
  const alert = useSharedValue(invalid ? 1 : 0);
  useEffect(() => {
    alert.set(withTiming(invalid ? 1 : 0, { duration: 180, easing: EASE_OUT }));
  }, [invalid, alert]);

  const frame = useAnimatedStyle(() => ({
    borderColor: interpolateColor(alert.get(), [0, 1], ['rgba(60, 60, 67, 0.0)', colors.primary]),
  }));

  return (
    <Animated.View style={[styles.group, { backgroundColor: palette.surface, boxShadow: palette.shadow }, style, frame]}>
      {children}
    </Animated.View>
  );
}

interface FormRowProps extends TextInputProps {
  label: string;
  /** Muestra "Mostrar / Ocultar" y oculta el texto. */
  password?: boolean;
  /** Última fila: sin separador inferior. */
  last?: boolean;
}

export const FormRow = forwardRef<TextInput, FormRowProps>(function FormRow(
  { label, password, last, onFocus, onBlur, editable = true, ...input },
  ref,
) {
  const { palette } = useTheme();
  const focus = useSharedValue(0);
  const [hidden, setHidden] = useState(true);

  const labelStyle = useAnimatedStyle(() => ({
    color: interpolateColor(focus.get(), [0, 1], [palette.secondaryLabel, colors.primary]),
  }));

  return (
    <View style={[styles.row, !last && styles.divider, !last && { borderBottomColor: palette.separator }, !editable && styles.rowDisabled]}>
      <View style={styles.field}>
        <Animated.Text style={[styles.label, labelStyle]} numberOfLines={1}>
          {label}
        </Animated.Text>
        <TextInput
          ref={ref}
          {...input}
          editable={editable}
          secureTextEntry={password && hidden}
          placeholderTextColor={palette.placeholder}
          selectionColor={colors.primary}
          cursorColor={colors.primary}
          style={[styles.input, { color: palette.label }]}
          allowFontScaling
          onFocus={(e) => {
            focus.set(withTiming(1, { duration: 150, easing: EASE_OUT }));
            onFocus?.(e);
          }}
          onBlur={(e) => {
            focus.set(withTiming(0, { duration: 200, easing: EASE_OUT }));
            onBlur?.(e);
          }}
        />
      </View>
      {password && (
        <Pressable
          onPress={() => setHidden((h) => !h)}
          hitSlop={12}
          style={({ pressed }) => [styles.toggle, pressed && { opacity: 0.4 }]}
          accessibilityRole="button"
          accessibilityLabel={hidden ? 'Mostrar contraseña' : 'Ocultar contraseña'}
        >
          <Text style={styles.toggleText}>{hidden ? 'Mostrar' : 'Ocultar'}</Text>
        </Pressable>
      )}
    </View>
  );
});

/** Pie de grupo: ayuda o error, en footnote con margen izquierdo igual al del texto. */
export function FormFooter({ children, error }: { children: ReactNode; error?: boolean }) {
  const { palette } = useTheme();
  return (
    <Text style={[styles.footer, { color: palette.secondaryLabel }, error && styles.footerError]} accessibilityLiveRegion="polite">
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  group: {
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: 'transparent',
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: tapTarget + 12,
    paddingLeft: 16,
    paddingRight: 8,
  },
  field: { flex: 1, paddingVertical: 8 },
  rowDisabled: { opacity: 0.6 },
  divider: { borderBottomWidth: StyleSheet.hairlineWidth },
  label: { ...t.footnote, fontWeight: '500', paddingRight: 8 },
  input: {
    ...t.body,
    // 17 pt nunca dispara el zoom de iOS Safari (mínimo 16).
    paddingVertical: Platform.OS === 'web' ? 4 : 2,
    paddingRight: 8,
    textAlign: 'left',
    outlineWidth: 0,
  } as TextStyle,
  toggle: { minHeight: tapTarget, paddingHorizontal: 8, justifyContent: 'center' },
  toggleText: { ...t.subhead, fontWeight: '600', color: colors.primary },
  footer: { ...t.footnote, paddingHorizontal: 16, marginTop: 8 },
  footerError: { color: colors.primary, fontWeight: '500' },
});
