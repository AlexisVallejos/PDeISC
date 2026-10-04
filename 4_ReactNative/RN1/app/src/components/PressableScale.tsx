import * as Haptics from 'expo-haptics';
import type { ReactNode } from 'react';
import { Platform, Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { springs } from '../theme';

interface PressableScaleProps extends Omit<PressableProps, 'style' | 'children'> {
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
}

/** Botón con respuesta inmediata al presionar (no al soltar), como en iOS. */
export function PressableScale({ style, children, onPressIn, onPressOut, disabled, ...rest }: PressableScaleProps) {
  const scale = useSharedValue(1);
  const animated = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Pressable
      {...rest}
      disabled={disabled}
      hitSlop={10}
      onPressIn={(e) => {
        scale.value = withSpring(0.97, springs.press);
        if (Platform.OS !== 'web') Haptics.selectionAsync();
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        scale.value = withSpring(1, springs.ui);
        onPressOut?.(e);
      }}
    >
      <Animated.View style={[style, animated, disabled && { opacity: 0.7 }]}>{children}</Animated.View>
    </Pressable>
  );
}
