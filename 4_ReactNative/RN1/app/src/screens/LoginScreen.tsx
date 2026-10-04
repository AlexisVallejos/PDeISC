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
  FadeIn,
  FadeInDown,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Field } from '../components/Field';
import { GridBackground } from '../components/GridBackground';
import { Logo3D } from '../components/Logo3D';
import { PressableScale } from '../components/PressableScale';
import { login } from '../services/api';
import { colors, font, springs } from '../theme';
import type { LoginScreenProps } from '../types/navigation';

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
  const shakeStyle = useAnimatedStyle(() => ({ transform: [{ translateX: shake.value }] }));

  const fallar = (mensaje: string) => {
    setError(mensaje);
    haptic(Haptics.NotificationFeedbackType.Error);
    if (reduceMotion) return;
    shake.value = withSequence(
      withTiming(-10, { duration: 50 }),
      withTiming(10, { duration: 70 }),
      withTiming(-6, { duration: 60 }),
      withSpring(0, springs.momentum),
    );
  };

  const ingresar = async () => {
    if (cargando) return;
    if (!usuario.trim() || !clave) {
      fallar('Completá usuario y contraseña');
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

  const entrada = (ms: number) => (reduceMotion ? FadeIn.duration(200) : FadeInDown.delay(ms).springify().duration(550).dampingRatio(1));

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" bounces={false}>
        {/* Panel de marca */}
        <View style={[styles.brand, { paddingTop: insets.top + 32 }]}>
          <GridBackground color="rgba(255,255,255,0.05)" />
          <View style={styles.topBar} />
          <Logo3D size={68} variant="dark" delay={250} />
          <Animated.Text entering={entrada(1900)} style={styles.tagline}>
            Industrial · Técnico · Moderno
          </Animated.Text>
          <Animated.Text entering={entrada(2000)} style={styles.hint}>
            Arrastrá o tocá el logo
          </Animated.Text>
        </View>

        {/* Hoja de acceso */}
        <Animated.View entering={entrada(1200)} style={[styles.sheet, { paddingBottom: insets.bottom + 28 }]}>
          <Animated.View style={shakeStyle}>
            <Text style={styles.kicker}>Acceso</Text>
            <Text style={styles.title}>Ingresá al sistema</Text>
            <View style={styles.rule} />

            <Field
              label="Usuario"
              value={usuario}
              onChangeText={(t) => {
                setUsuario(t);
                if (error) setError('');
              }}
              placeholder="usuario"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="username"
              textContentType="username"
              returnKeyType="next"
              onSubmitEditing={() => claveRef.current?.focus()}
              invalid={!!error}
              editable={!cargando}
            />
            <Field
              ref={claveRef}
              label="Contraseña"
              password
              value={clave}
              onChangeText={(t) => {
                setClave(t);
                if (error) setError('');
              }}
              placeholder="••••••"
              autoComplete="password"
              textContentType="password"
              returnKeyType="go"
              onSubmitEditing={ingresar}
              invalid={!!error}
              editable={!cargando}
            />

            {!!error && (
              <Animated.View entering={FadeIn.duration(150)} style={styles.error} accessibilityLiveRegion="polite">
                <View style={styles.errorDot} />
                <Text style={styles.errorText}>{error}</Text>
              </Animated.View>
            )}

            <PressableScale
              onPress={ingresar}
              disabled={cargando}
              style={styles.button}
              accessibilityRole="button"
              accessibilityLabel="Ingresar"
            >
              {cargando ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <Text style={styles.buttonText}>Ingresar</Text>
              )}
            </PressableScale>

            <Text style={styles.footer}>© DAMAC · Industrial Solutions</Text>
          </Animated.View>
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
    minHeight: 320,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 56,
    backgroundColor: colors.carbonDeep,
    overflow: 'hidden',
  },
  topBar: { position: 'absolute', top: 0, left: 0, right: 0, height: 5, backgroundColor: colors.primary },
  tagline: {
    fontFamily: font,
    marginTop: 18,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 3.6,
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.55)',
  },
  hint: { fontFamily: font, marginTop: 8, fontSize: 12, color: 'rgba(255,255,255,0.3)' },
  sheet: {
    marginTop: -28,
    backgroundColor: colors.card,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 28,
    paddingTop: 32,
    boxShadow: '0 -12px 40px rgba(0,0,0,0.35)',
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
  },
  kicker: {
    fontFamily: font,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 3.3,
    textTransform: 'uppercase',
    color: colors.primary,
  },
  title: {
    fontFamily: font,
    marginTop: 4,
    fontSize: 28,
    lineHeight: 32,
    fontWeight: '800',
    letterSpacing: -0.6,
    color: colors.carbon,
  },
  rule: { width: 40, height: 3, borderRadius: 2, backgroundColor: colors.primary, marginTop: 10, marginBottom: 24 },
  error: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(227, 6, 20, 0.07)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 4,
  },
  errorDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.primary },
  errorText: { fontFamily: font, flex: 1, fontSize: 14, fontWeight: '600', color: colors.primaryDark },
  button: {
    marginTop: 16,
    height: 54,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 8px 20px rgba(227, 6, 20, 0.35)',
  },
  buttonText: {
    fontFamily: font,
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 2.8,
    textTransform: 'uppercase',
    color: colors.white,
  },
  footer: { fontFamily: font, marginTop: 24, textAlign: 'center', fontSize: 11, color: '#A3A3A3' },
});
