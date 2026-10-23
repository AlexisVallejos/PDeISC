import * as Haptics from 'expo-haptics';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type TextInputInstance,
} from 'react-native';
import Animated, { Easing, FadeIn, FadeInDown, FadeOut, useReducedMotion } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FormFooter, FormGroup, FormRow } from '../components/Form';
import { GridBackground } from '../components/GridBackground';
import { PressableScale } from '../components/PressableScale';
import { ThemeToggle } from '../components/ThemeToggle';
import { useTheme } from '../ThemeContext';
import { pedirCodigo, restablecerClave } from '../services/api';
import { colors, radius, space, type as t } from '../theme';
import type { RecuperarScreenProps } from '../types/navigation';

const EASE_OUT = Easing.bezier(0.23, 1, 0.32, 1);
const REENVIO_SEGUNDOS = 60;
const CLAVE_MINIMA = 6;

function haptic(type: Haptics.NotificationFeedbackType) {
  if (Platform.OS !== 'web') Haptics.notificationAsync(type);
}

/**
 * Recuperar contraseña en dos pasos:
 * 1. Usuario o email → la API manda un código de 6 dígitos al Gmail de la cuenta.
 * 2. Código + contraseña nueva → la API valida el código y cambia la contraseña.
 */
export function RecuperarScreen({ navigation, route }: RecuperarScreenProps) {
  const insets = useSafeAreaInsets();
  const reduceMotion = useReducedMotion();
  const { mode, palette } = useTheme();
  const codigoRef = useRef<TextInputInstance>(null);
  const claveRef = useRef<TextInputInstance>(null);
  const repetirRef = useRef<TextInputInstance>(null);

  const [paso, setPaso] = useState<1 | 2>(1);
  const [identificador, setIdentificador] = useState(route.params?.identificador ?? '');
  const [codigo, setCodigo] = useState('');
  const [clave, setClave] = useState('');
  const [repetir, setRepetir] = useState('');
  const [error, setError] = useState('');
  const [aviso, setAviso] = useState('');
  const [cargando, setCargando] = useState(false);
  const [espera, setEspera] = useState(0);

  useEffect(() => {
    if (espera <= 0) return;
    const id = setTimeout(() => setEspera((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [espera]);

  const entrada = (ms: number) =>
    reduceMotion ? FadeIn.duration(200) : FadeInDown.delay(ms).duration(420).easing(EASE_OUT);

  const fallar = (mensaje: string) => {
    setError(mensaje);
    setAviso('');
    haptic(Haptics.NotificationFeedbackType.Error);
  };

  const enviarCodigo = async () => {
    if (cargando) return;
    if (!identificador.trim()) return fallar('Ingresá tu usuario o tu email.');

    setError('');
    setCargando(true);
    const res = await pedirCodigo(identificador.trim());
    setCargando(false);

    if (!res.ok) return fallar(res.mensaje);
    haptic(Haptics.NotificationFeedbackType.Success);
    setAviso('');
    setCodigo('');
    setEspera(REENVIO_SEGUNDOS);
    setPaso(2);
  };

  const reenviar = async () => {
    if (cargando || espera > 0) return;
    setError('');
    setCargando(true);
    const res = await pedirCodigo(identificador.trim());
    setCargando(false);
    if (!res.ok) return fallar(res.mensaje);
    setEspera(REENVIO_SEGUNDOS);
    setAviso('Te enviamos un código nuevo.');
  };

  const cambiarClave = async () => {
    if (cargando) return;
    if (!/^\d{6}$/.test(codigo.trim())) return fallar('El código tiene 6 dígitos.');
    if (clave.length < CLAVE_MINIMA) return fallar(`La contraseña debe tener al menos ${CLAVE_MINIMA} caracteres.`);
    if (clave !== repetir) return fallar('Las contraseñas no coinciden.');

    setError('');
    setCargando(true);
    const res = await restablecerClave(identificador.trim(), codigo.trim(), clave);
    setCargando(false);

    if (!res.ok) return fallar(res.mensaje);
    haptic(Haptics.NotificationFeedbackType.Success);
    setPaso(1);
    setCodigo('');
    setClave('');
    setRepetir('');
    navigation.goBack();
  };

  const listoPaso1 = identificador.trim().length > 0 && !cargando;
  const listoPaso2 = codigo.trim().length === 6 && clave.length > 0 && repetir.length > 0 && !cargando;

  return (
    <KeyboardAvoidingView style={[styles.root, { backgroundColor: palette.background }]} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />
      <GridBackground color={palette.grid} />
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: Math.max(insets.top, 8) + space.sm, paddingBottom: Math.max(insets.bottom, space.lg) + space.xl },
        ]}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
      >
        <View style={styles.column}>
          <View style={styles.topRow}>
            <PressableScale
              onPress={() => (paso === 2 ? (setPaso(1), setError(''), setAviso('')) : navigation.goBack())}
              haptic={false}
              style={[styles.back, { backgroundColor: palette.control, borderColor: palette.controlBorder }]}
              accessibilityRole="button"
              accessibilityLabel={paso === 2 ? 'Volver al paso anterior' : 'Volver al ingreso'}
            >
              <Text style={[styles.backIcon, { color: palette.label }]} accessibilityElementsHidden>‹</Text>
            </PressableScale>
            <ThemeToggle />
          </View>

          <Animated.View key={paso} entering={entrada(40)}>
            <Text style={[styles.step, { color: colors.primary }]}>PASO {paso} DE 2</Text>
            <Text style={[styles.title, { color: palette.label }]} accessibilityRole="header">
              {paso === 1 ? 'Recuperar contraseña' : 'Ingresá el código'}
            </Text>
            <Text style={[styles.subtitle, { color: palette.secondaryLabel }]}>
              {paso === 1
                ? 'Escribí tu usuario o tu email y te mandamos un código de 6 dígitos por Gmail.'
                : 'Te lo enviamos por email. Vence en 10 minutos. Revisá también spam.'}
            </Text>
          </Animated.View>

          {paso === 1 ? (
            <Animated.View entering={entrada(120)} key="p1">
              <FormGroup invalid={!!error} style={{ backgroundColor: palette.surface, boxShadow: palette.shadow }}>
                <FormRow
                  label="Usuario o email"
                  value={identificador}
                  onChangeText={(v) => {
                    setIdentificador(v);
                    if (error) setError('');
                  }}
                  placeholder="requerido"
                  autoCapitalize="none"
                  autoCorrect={false}
                  spellCheck={false}
                  autoComplete="email"
                  textContentType="username"
                  inputMode="email"
                  returnKeyType="send"
                  enterKeyHint="send"
                  onSubmitEditing={enviarCodigo}
                  editable={!cargando}
                  last
                />
              </FormGroup>
            </Animated.View>
          ) : (
            <Animated.View entering={entrada(120)} key="p2">
              <FormGroup invalid={!!error} style={{ backgroundColor: palette.surface, boxShadow: palette.shadow }}>
                <FormRow
                  ref={codigoRef}
                  label="Código de 6 dígitos"
                  value={codigo}
                  onChangeText={(v) => {
                    setCodigo(v.replace(/\D/g, '').slice(0, 6));
                    if (error) setError('');
                  }}
                  placeholder="000000"
                  autoComplete="one-time-code"
                  textContentType="oneTimeCode"
                  inputMode="numeric"
                  maxLength={6}
                  returnKeyType="next"
                  enterKeyHint="next"
                  blurOnSubmit={false}
                  onSubmitEditing={() => claveRef.current?.focus()}
                  editable={!cargando}
                  autoFocus
                />
                <FormRow
                  ref={claveRef}
                  label="Contraseña nueva"
                  password
                  value={clave}
                  onChangeText={(v) => {
                    setClave(v);
                    if (error) setError('');
                  }}
                  placeholder={`mínimo ${CLAVE_MINIMA} caracteres`}
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="new-password"
                  textContentType="newPassword"
                  returnKeyType="next"
                  enterKeyHint="next"
                  blurOnSubmit={false}
                  onSubmitEditing={() => repetirRef.current?.focus()}
                  editable={!cargando}
                />
                <FormRow
                  ref={repetirRef}
                  label="Repetir contraseña"
                  password
                  last
                  value={repetir}
                  onChangeText={(v) => {
                    setRepetir(v);
                    if (error) setError('');
                  }}
                  placeholder="igual a la anterior"
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="new-password"
                  textContentType="newPassword"
                  returnKeyType="go"
                  enterKeyHint="go"
                  onSubmitEditing={cambiarClave}
                  editable={!cargando}
                />
              </FormGroup>
            </Animated.View>
          )}

          {!!error && (
            <Animated.View entering={FadeIn.duration(150)} exiting={FadeOut.duration(120)}>
              <FormFooter error>{error}</FormFooter>
            </Animated.View>
          )}
          {!!aviso && !error && (
            <Animated.View entering={FadeIn.duration(150)}>
              <FormFooter>{aviso}</FormFooter>
            </Animated.View>
          )}

          <PressableScale
            onPress={paso === 1 ? enviarCodigo : cambiarClave}
            disabled={paso === 1 ? !listoPaso1 : !listoPaso2}
            style={styles.button}
            accessibilityRole="button"
            accessibilityState={{ disabled: paso === 1 ? !listoPaso1 : !listoPaso2, busy: cargando }}
          >
            <Text style={[styles.buttonText, cargando && styles.invisible]}>
              {paso === 1 ? 'Enviar código' : 'Cambiar contraseña'}
            </Text>
            {cargando && (
              <View style={[StyleSheet.absoluteFill, styles.center]}>
                <ActivityIndicator color={colors.white} />
              </View>
            )}
          </PressableScale>

          {paso === 2 && (
            <PressableScale
              onPress={reenviar}
              haptic={false}
              disabled={espera > 0 || cargando}
              style={styles.resend}
              accessibilityRole="button"
            >
              <Text style={[styles.resendText, espera > 0 && { color: palette.tertiaryLabel }]}>
                {espera > 0 ? `Reenviar código en ${espera} s` : 'Reenviar código'}
              </Text>
            </PressableScale>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { flexGrow: 1, alignItems: 'center', paddingHorizontal: space.xl },
  column: { width: '100%', maxWidth: 440 },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: space.xxl },
  back: { width: 44, height: 44, borderRadius: 22, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  backIcon: { fontSize: 30, lineHeight: 32, marginTop: -3, marginLeft: -2 },
  step: { ...t.eyebrow },
  title: { ...t.largeTitle, marginTop: space.sm },
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
  center: { alignItems: 'center', justifyContent: 'center' },
  resend: { alignSelf: 'center', minHeight: 44, justifyContent: 'center', marginTop: space.sm, paddingHorizontal: space.md },
  resendText: { ...t.subhead, fontWeight: '600', color: colors.primary },
});
