import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Platform, Pressable, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { colors, createStyles, MAX_CONTENT_WIDTH, spacing, useTheme } from '../theme';
import { KeyboardAvoider, useScrollToFocusedInput } from './KeyboardAvoider';

/** A partir de cuánto scroll aparece el botón para volver arriba. */
const SHOW_TOP_AFTER = 400;

/**
 * Contenedor base de cada pantalla: scroll, pull-to-refresh y ancho máximo
 * centrado para que en tablets u horizontal el contenido no se estire.
 * Al bajar bastante aparece un botón que vuelve arriba con una animación suave.
 * Con el teclado abierto la pantalla se achica y el campo que se está escribiendo queda a la vista.
 */
export function Screen({ children, onRefresh, refreshing = false, scroll = true, style, footer }) {
  useTheme();
  const scrollRef = useRef(null);
  const [showTop, setShowTop] = useState(false);
  const [fade] = useState(() => new Animated.Value(0));
  const trackScroll = useScrollToFocusedInput(scrollRef);

  // El botón entra y sale con un fundido y un leve desplazamiento hacia arriba.
  useEffect(() => {
    Animated.timing(fade, { toValue: showTop ? 1 : 0, duration: 220, useNativeDriver: Platform.OS !== 'web' }).start();
  }, [showTop, fade]);

  const toTop = async () => {
    const reduce = await AccessibilityInfo.isReduceMotionEnabled().catch(() => false);
    scrollRef.current?.scrollTo({ y: 0, animated: !reduce });
  };

  const content = <View style={[styles.inner, style]}>{children}</View>;
  return (
    <KeyboardAvoider style={styles.root}>
      {scroll ? (
        <View style={styles.body}>
          <ScrollView
            ref={scrollRef}
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
            contentInsetAdjustmentBehavior="automatic"
            scrollEventThrottle={32}
            onScroll={(e) => {
              trackScroll(e);
              const down = e.nativeEvent.contentOffset.y > SHOW_TOP_AFTER;
              if (down !== showTop) setShowTop(down);
            }}
            refreshControl={
              onRefresh ? (
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} colors={[colors.primary]} />
              ) : undefined
            }
          >
            {content}
          </ScrollView>
          <Animated.View
            pointerEvents={showTop ? 'auto' : 'none'}
            style={[styles.topWrap, { opacity: fade, transform: [{ translateY: fade.interpolate({ inputRange: [0, 1], outputRange: [16, 0] }) }] }]}
          >
            <Pressable
              onPress={toTop}
              accessibilityRole="button"
              accessibilityLabel="Volver arriba"
              style={({ pressed }) => [styles.topButton, pressed && { transform: [{ scale: 0.92 }] }]}
            >
              <Ionicons name="arrow-up" size={22} color={colors.onPrimary} />
            </Pressable>
          </Animated.View>
        </View>
      ) : (
        content
      )}
      {footer ? <View style={styles.footer}>{footer}</View> : null}
    </KeyboardAvoider>
  );
}

const styles = createStyles(() => StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  body: { flex: 1 },
  scroll: { flexGrow: 1, paddingBottom: spacing.xxl },
  inner: { width: '100%', maxWidth: MAX_CONTENT_WIDTH, alignSelf: 'center', padding: spacing.lg, gap: spacing.lg, flexGrow: 1 },
  topWrap: { position: 'absolute', right: spacing.lg, bottom: spacing.lg },
  topButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  footer: {
    width: '100%',
    maxWidth: MAX_CONTENT_WIDTH,
    alignSelf: 'center',
    padding: spacing.lg,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
}));
