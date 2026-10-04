import { forwardRef, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { colors, font } from '../theme';

interface FieldProps extends TextInputProps {
  label: string;
  invalid?: boolean;
  /** Muestra el botón "Ver/Ocultar" para contraseñas. */
  password?: boolean;
}

export const Field = forwardRef<TextInput, FieldProps>(function Field(
  { label, invalid, password, onFocus, onBlur, ...input },
  ref,
) {
  const focus = useSharedValue(0);
  const [hidden, setHidden] = useState(true);

  const frame = useAnimatedStyle(() => ({
    borderColor: invalid
      ? colors.primary
      : interpolateColor(focus.value, [0, 1], [colors.border, colors.primary]),
    boxShadow: `0 0 0 ${focus.value * 4}px rgba(227, 6, 20, 0.12)`,
  }));

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <Animated.View style={[styles.frame, frame]}>
        <TextInput
          ref={ref}
          {...input}
          secureTextEntry={password && hidden}
          placeholderTextColor="#A3A3A3"
          style={styles.input}
          onFocus={(e) => {
            focus.value = withTiming(1, { duration: 150 });
            onFocus?.(e);
          }}
          onBlur={(e) => {
            focus.value = withTiming(0, { duration: 200 });
            onBlur?.(e);
          }}
        />
        {password && (
          <Pressable
            onPress={() => setHidden((h) => !h)}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel={hidden ? 'Mostrar contraseña' : 'Ocultar contraseña'}
          >
            <Text style={styles.toggle}>{hidden ? 'VER' : 'OCULTAR'}</Text>
          </Pressable>
        )}
      </Animated.View>
    </View>
  );
});

const styles = StyleSheet.create({
  wrap: { marginBottom: 16 },
  label: {
    fontFamily: font,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: colors.muted,
    marginBottom: 6,
  },
  frame: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 12,
    backgroundColor: colors.input,
    paddingHorizontal: 14,
  },
  input: {
    flex: 1,
    fontFamily: font,
    fontSize: 16,
    color: colors.carbon,
    paddingVertical: 13,
    outlineWidth: 0,
  },
  toggle: { fontFamily: font, fontSize: 11, fontWeight: '800', letterSpacing: 1, color: colors.primary },
});
