import * as Haptics from 'expo-haptics';
import type { ReactNode } from 'react';
import { Platform, Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { springs } from '../theme';

interface PressableScaleProps extends Omit<PressableProps, 'style' | 'children'> {
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
  /** Escala al presionar. 0.97 para botones grandes, 0.94 para controles chicos. */
  pressedScale?: number;
  /** Vibración al presionar (una sola por acción, en el mismo frame que el visual). */
  haptic?: boolean;
}

/** Respuesta en el press-in (no al soltar), como en iOS. */
export function PressableScale({
  style,
  children,
  onPressIn,
  onPressOut,
  disabled,
  pressedScale = 0.97,
  haptic = true,
  ...rest
}: PressableScaleProps) {
  const scale = useSharedValue(1);
  const animated = useAnimatedStyle(() => ({ transform: [{ scale: scale.get() }] }));

  return (
    <Pressable
      {...rest}
      disabled={disabled}
      hitSlop={8}
      pressRetentionOffset={20}
      style={webControl}
      onPressIn={(e) => {
        scale.set(withSpring(pressedScale, springs.press));
        if (haptic && Platform.OS !== 'web') Haptics.selectionAsync();
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        scale.set(withSpring(1, springs.ui));
        onPressOut?.(e);
      }}
    >
      <Animated.View style={[style, animated, disabled && { opacity: 0.55 }]}>{children}</Animated.View>
    </Pressable>
  );
}

// Web: sin selección de texto en controles, sin demora de 300 ms al tocar.
const webControl = Platform.OS === 'web' ? ({ userSelect: 'none', touchAction: 'manipulation' } as ViewStyle) : undefined;
