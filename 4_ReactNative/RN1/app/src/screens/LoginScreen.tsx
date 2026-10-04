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
  type TextInput,
} from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
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
import { GridBackground } from '../components/GridBackground';
import { Logo3D } from '../components/Logo3D';
import { PressableScale } from '../components/PressableScale';
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
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        bounces={false}
        overScrollMode="never"
        contentInsetAdjustmentBehavior="never"
      >
        {/* Panel de marca: edge to edge, el contenido se separa del notch con los insets */}
        <View style={[styles.brand, { paddingTop: insets.top + space.xl }]}>
          <GridBackground color="rgba(255,255,255,0.045)" />
          <View style={styles.topBar} />
          <Logo3D size={68} variant="dark" delay={200} />
          <Animated.Text entering={entrada(900)} style={styles.brandLine}>
            Accesorios de aluminio
          </Animated.Text>
          <Animated.Text entering={entrada(1000)} style={styles.brandHint}>
            Tocá o arrastrá el logo
          </Animated.Text>
        </View>

        {/* Hoja de acceso */}
        <Animated.View
          entering={entrada(120)}
          style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, space.lg) + space.md }]}
        >
          <View style={styles.grabber} accessibilityElementsHidden importantForAccessibility="no" />

          <Text style={styles.title} accessibilityRole="header">
            Ingresar
          </Text>
          <Text style={styles.subtitle}>Sistema de acceso para el equipo DAMAC.</Text>

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

          <Text style={styles.legal} selectable>
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
  brand: {
    flex: 1,
    minHeight: 300,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: space.xxxl + radius.sheet,
    backgroundColor: colors.carbonDeep,
    overflow: 'hidden',
  },
  topBar: { position: 'absolute', top: 0, left: 0, right: 0, height: 4, backgroundColor: colors.primary },
  brandLine: { ...t.eyebrow, marginTop: space.lg, color: colors.onCarbonSecondary, textAlign: 'center' },
  brandHint: { ...t.caption, marginTop: space.sm, color: colors.onCarbonTertiary, textAlign: 'center' },
  sheet: {
    marginTop: -radius.sheet,
    backgroundColor: colors.groupedBackground,
    borderTopLeftRadius: radius.sheet,
    borderTopRightRadius: radius.sheet,
    borderCurve: 'continuous',
    paddingHorizontal: space.xl,
    paddingTop: space.sm,
    boxShadow: '0 -16px 48px rgba(0,0,0,0.45)',
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
  },
  grabber: {
    alignSelf: 'center',
    width: 36,
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(60, 60, 67, 0.22)',
    marginBottom: space.xl,
  },
  title: { ...t.largeTitle, color: colors.label },
  subtitle: { ...t.subhead, marginTop: space.xs, marginBottom: space.xl, color: colors.secondaryLabel },
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
  legal: { ...t.caption, marginTop: space.xxl, textAlign: 'center', color: colors.tertiaryLabel },
});
