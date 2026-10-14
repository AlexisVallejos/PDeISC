import * as Haptics from 'expo-haptics';
import { StatusBar } from 'expo-status-bar';
import { useRef, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  type TextInput,
} from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  FadeInRight,
  FadeOut,
  LinearTransition,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FormFooter, FormGroup, FormRow } from '../components/Form';
import { PressableScale } from '../components/PressableScale';
import { ThemeToggle } from '../components/ThemeToggle';
import { VideoMarca } from '../components/VideoMarca';
import { useTheme } from '../ThemeContext';
import { login } from '../services/api';
import { colors, radius, space, springs, type as t } from '../theme';
import type { LoginScreenProps } from '../types/navigation';

const EASE_OUT = Easing.bezier(0.23, 1, 0.32, 1);

function haptic(type: Haptics.NotificationFeedbackType) {
  if (Platform.OS !== 'web') Haptics.notificationAsync(type);
}

export function LoginScreen({ navigation }: LoginScreenProps) {
  const insets = useSafeAreaInsets();
  const reduceMotion = useReducedMotion();
  const { width, height } = useWindowDimensions();
  const { palette } = useTheme();
  // Una pantalla apaisada baja mantiene el diseño apilado para que el formulario respire.
  const wide = width >= 900 && height >= 620;
  const compact = width < 360;
  const brandHeight = Math.max(250, Math.min(390, height * 0.4, width * 0.92));
  const claveRef = useRef<TextInput>(null);

  const [usuario, setUsuario] = useState('');
  const [clave, setClave] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const shake = useSharedValue(0);
  const shakeStyle = useAnimatedStyle(() => ({ transform: [{ translateX: shake.get() }] }));

  const fallar = (mensaje: string) => {
    setError(mensaje);
    haptic(Haptics.NotificationFeedbackType.Error);
    if (reduceMotion) return;
    // Sacudida corta que decae: 3 golpes y un spring que absorbe la energía.
    shake.set(
      withSequence(
        withTiming(-8, { duration: 50 }),
        withTiming(8, { duration: 70 }),
        withTiming(-5, { duration: 60 }),
        withSpring(0, springs.momentum),
      ),
    );
  };

  const ingresar = async () => {
    if (cargando) return;
    if (!usuario.trim() || !clave) {
      fallar('Completá usuario y contraseña.');
      return;
    }

    setError('');
    setCargando(true);
    const res = await login(usuario.trim(), clave);
    setCargando(false);

    if (res.ok && res.usuario) {
      haptic(Haptics.NotificationFeedbackType.Success);
      setClave('');
      navigation.navigate('Bienvenida', { usuario: res.usuario });
    } else {
      fallar(res.mensaje);
    }
  };

  const puedeIngresar = usuario.trim().length > 0 && clave.length > 0 && !cargando;

  // Entradas: ease-out fuerte, cortas. El formulario no espera al logo.
  const entrada = (ms: number) =>
    reduceMotion ? FadeIn.duration(200) : FadeInDown.delay(ms).duration(420).easing(EASE_OUT);
  const layout = reduceMotion ? undefined : LinearTransition.duration(220).easing(EASE_OUT);

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={[styles.scroll, wide && styles.scrollWide]}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        bounces={false}
        overScrollMode="never"
        contentInsetAdjustmentBehavior="never"
      >
        {/* Panel de marca: video edge to edge (el logo y la bajada ya están dentro del video) */}
        <View style={[styles.brand, wide ? styles.brandWide : { height: brandHeight }]}>
          <VideoMarca style={StyleSheet.absoluteFill} />
          <View style={styles.topBar} />
          <View pointerEvents="none" style={[styles.brandMark, { top: Math.max(insets.top, 12) + 14 }]}>
            <Text style={styles.brandWord}><Text style={styles.brandD}>D</Text>AMAC</Text>
            <Text style={styles.brandCaption}>ACCESORIOS PARA ABERTURAS</Text>
          </View>
        </View>

        {/* Hoja de acceso */}
        <Animated.View
          entering={wide ? (reduceMotion ? FadeIn.duration(200) : FadeInRight.delay(120).duration(420).easing(EASE_OUT)) : entrada(120)}
          style={[
            styles.sheet,
            wide && styles.sheetWide,
            { backgroundColor: palette.background, boxShadow: palette.sheetShadow },
            wide
              ? { paddingTop: insets.top + space.xxxl, paddingBottom: Math.max(insets.bottom, space.lg) + space.xxl }
              : { paddingBottom: Math.max(insets.bottom, space.lg) + space.md },
          ]}
        >
          {!wide && <View style={[styles.grabber, { backgroundColor: palette.separator }]} accessibilityElementsHidden importantForAccessibility="no" />}

          <View style={styles.headingRow}>
            <Text style={[styles.title, compact && styles.titleCompact, { color: palette.label }]} accessibilityRole="header">
              Ingresar
            </Text>
            <ThemeToggle />
          </View>
          <Text style={[styles.subtitle, { color: palette.secondaryLabel }]}>Sistema de acceso para el equipo DAMAC.</Text>

          <Animated.View style={shakeStyle} layout={layout}>
            <FormGroup invalid={!!error}>
              <FormRow
                label="Usuario"
                value={usuario}
                onChangeText={(v) => {
                  setUsuario(v);
                  if (error) setError('');
                }}
                placeholder="requerido"
                autoCapitalize="none"
                autoCorrect={false}
                spellCheck={false}
                autoComplete="username"
                textContentType="username"
                inputMode="text"
                returnKeyType="next"
                enterKeyHint="next"
                blurOnSubmit={false}
                onSubmitEditing={() => claveRef.current?.focus()}
                editable={!cargando}
              />
              <FormRow
                ref={claveRef}
                label="Contraseña"
                password
                last
                value={clave}
                onChangeText={(v) => {
                  setClave(v);
                  if (error) setError('');
                }}
                placeholder="requerida"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="current-password"
                textContentType="password"
                returnKeyType="go"
                enterKeyHint="go"
                onSubmitEditing={ingresar}
                editable={!cargando}
              />
            </FormGroup>

            {!!error && (
              <Animated.View entering={FadeIn.duration(150)} exiting={FadeOut.duration(120)}>
                <FormFooter error>{error}</FormFooter>
              </Animated.View>
            )}
          </Animated.View>

          <Animated.View layout={layout}>
            <PressableScale
              onPress={ingresar}
              disabled={!puedeIngresar}
              style={styles.button}
              accessibilityRole="button"
              accessibilityLabel="Ingresar"
              accessibilityState={{ disabled: !puedeIngresar, busy: cargando }}
            >
              {/* El texto queda invisible (no desmontado): el ancho no salta al cargar. */}
              <Text style={[styles.buttonText, cargando && styles.invisible]}>Ingresar</Text>
              {cargando && (
                <Animated.View entering={FadeIn.duration(120)} style={StyleSheet.absoluteFill}>
                  <View style={styles.center}>
                    <ActivityIndicator color={colors.white} />
                  </View>
                </Animated.View>
              )}
            </PressableScale>
          </Animated.View>

          <Text style={[styles.legal, { color: palette.tertiaryLabel }]} selectable>
            © {new Date().getFullYear()} DAMAC · Aluminio y herrajes
          </Text>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.carbonDeep },
  scroll: { flexGrow: 1 },
  scrollWide: { flexDirection: 'row', alignItems: 'stretch' },
  brand: {
    flexShrink: 0,
    backgroundColor: colors.carbonDeep,
    overflow: 'hidden',
  },
  brandWide: { flex: 1.15, minHeight: '100%', paddingBottom: 0 },
  topBar: { position: 'absolute', top: 0, left: 0, right: 0, height: 4, backgroundColor: colors.primary },
  brandMark: {
    position: 'absolute', left: 20, paddingHorizontal: 12, paddingVertical: 9,
    borderRadius: 12, backgroundColor: 'rgba(14, 15, 17, 0.76)',
    borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.14)',
  },
  brandWord: { ...t.title2, fontWeight: '900', letterSpacing: 1.3, color: colors.white },
  brandD: { color: colors.primary },
  brandCaption: { ...t.caption, fontSize: 9, letterSpacing: 1.25, color: colors.onCarbonSecondary },
  sheet: {
    marginTop: -radius.sheet,
    borderTopLeftRadius: radius.sheet,
    borderTopRightRadius: radius.sheet,
    borderCurve: 'continuous',
    paddingHorizontal: space.xl,
    paddingTop: space.sm,
    width: '100%',
    maxWidth: 640,
    alignSelf: 'center',
  },
  sheetWide: {
    flex: 1,
    marginTop: 0,
    maxWidth: 560,
    minWidth: 400,
    alignSelf: 'stretch',
    justifyContent: 'center',
    borderTopLeftRadius: radius.sheet,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: radius.sheet,
    paddingHorizontal: space.xxxl + space.md,
  },
  grabber: {
    alignSelf: 'center',
    width: 36,
    height: 5,
    borderRadius: 3,
    marginBottom: space.xl,
  },
  headingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: space.sm },
  title: { ...t.largeTitle, flexShrink: 1 },
  titleCompact: { ...t.title1 },
  subtitle: { ...t.subhead, marginTop: space.xs, marginBottom: space.xl },
  button: {
    marginTop: space.xl,
    height: 50,
    borderRadius: radius.md,
    borderCurve: 'continuous',
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 6px 18px rgba(227, 6, 20, 0.28)',
  },
  buttonText: { ...t.headline, color: colors.white },
  invisible: { opacity: 0 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  legal: { ...t.caption, marginTop: space.xxl, textAlign: 'center' },
});
