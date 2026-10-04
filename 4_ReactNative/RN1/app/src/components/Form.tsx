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
  const alert = useSharedValue(invalid ? 1 : 0);
  useEffect(() => {
    alert.set(withTiming(invalid ? 1 : 0, { duration: 180, easing: EASE_OUT }));
  }, [invalid, alert]);

  const frame = useAnimatedStyle(() => ({
    borderColor: interpolateColor(alert.get(), [0, 1], ['rgba(60, 60, 67, 0.0)', colors.primary]),
  }));

  return <Animated.View style={[styles.group, style, frame]}>{children}</Animated.View>;
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
  const focus = useSharedValue(0);
  const [hidden, setHidden] = useState(true);

  const labelStyle = useAnimatedStyle(() => ({
    color: interpolateColor(focus.get(), [0, 1], [colors.secondaryLabel, colors.primary]),
  }));

  return (
    <View style={[styles.row, !last && styles.divider, !editable && styles.rowDisabled]}>
      <View style={styles.field}>
        <Animated.Text style={[styles.label, labelStyle]} numberOfLines={1}>
          {label}
        </Animated.Text>
        <TextInput
          ref={ref}
          {...input}
          editable={editable}
          secureTextEntry={password && hidden}
          placeholderTextColor={colors.placeholder}
          selectionColor={colors.primary}
          cursorColor={colors.primary}
          style={styles.input}
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
  return (
    <Text style={[styles.footer, error && styles.footerError]} accessibilityLiveRegion="polite">
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  group: {
    backgroundColor: colors.elevated,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: 'transparent',
    overflow: 'hidden',
    // Sombra muy leve: separa del fondo agrupado sin leerse como "tarjeta".
    boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
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
  divider: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.separator },
  label: { ...t.footnote, fontWeight: '500', paddingRight: 8 },
  input: {
    ...t.body,
    // 17 pt nunca dispara el zoom de iOS Safari (mínimo 16).
    color: colors.label,
    paddingVertical: Platform.OS === 'web' ? 4 : 2,
    paddingRight: 8,
    textAlign: 'left',
    outlineWidth: 0,
  } as TextStyle,
  toggle: { minHeight: tapTarget, paddingHorizontal: 8, justifyContent: 'center' },
  toggleText: { ...t.subhead, fontWeight: '600', color: colors.primary },
  footer: { ...t.footnote, color: colors.secondaryLabel, paddingHorizontal: 16, marginTop: 8 },
  footerError: { color: colors.primary, fontWeight: '500' },
});
