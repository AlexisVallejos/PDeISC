import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { Button, FormError, TextField } from '../../components';
import { useAuth } from '../../context/AuthContext';
import { loadLoginPrefs, saveLoginPrefs } from '../../storage/tokenStorage';
import { colors, createStyles, font, spacing, useTheme } from '../../theme';
import { validateLogin } from '../../utils/validation';
import { AuthLayout } from './AuthLayout';
import { SocialButtons } from './SocialButtons';

export default function LoginScreen() {
  useTheme();
  const { login } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(true);
  // Cuenta creada con Google/Facebook/GitHub sin contraseña: se ofrece crearle una.
  const [socialOnly, setSocialOnly] = useState(false);
  const passwordRef = useRef(null);
  const rememberTouched = useRef(false);

  // "Recordarme": se recupera la preferencia y el último email usado.
  useEffect(() => {
    let alive = true;
    loadLoginPrefs().then((prefs) => {
      if (!alive) return;
      if (!rememberTouched.current) setRemember(prefs.remember);
      if (prefs.email) setForm((f) => (f.email ? f : { ...f, email: prefs.email }));
    });
    return () => {
      alive = false;
    };
  }, []);

  const set = (key) => (value) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
    if (key === 'email') setSocialOnly(false);
  };

  // Se guarda al tocarla: también vale para Google/Facebook y para "¿Olvidaste tu contraseña?".
  const toggleRemember = () => {
    rememberTouched.current = true;
    const next = !remember;
    setRemember(next);
    saveLoginPrefs({ remember: next, email: form.email.trim().toLowerCase() });
  };

  const submit = async () => {
    const found = validateLogin(form);
    setErrors(found);
    setFormError(null);
    setSocialOnly(false);
    if (Object.keys(found).length) return;
    setLoading(true);
    const email = form.email.trim().toLowerCase();
    try {
      await saveLoginPrefs({ remember, email });
      await login(email, form.password, { remember });
    } catch (err) {
      // Cuenta sin confirmar: el servidor ya mandó otro código al email.
      if (err.code === 'EMAIL_NOT_VERIFIED') {
        router.push({ pathname: '/verify-email', params: { email: form.email.trim().toLowerCase() } });
        return;
      }
      setSocialOnly(err.code === 'SOCIAL_ACCOUNT');
      setErrors(err.fieldErrors ?? {});
      setFormError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Iniciá sesión" subtitle="Registrá tus comidas y entrenamientos.">
      <FormError message={formError} />
      <TextField
        label="Email"
        value={form.email}
        onChangeText={set('email')}
        error={errors.email}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete={Platform.OS === 'web' ? 'username' : 'email'}
        textContentType="username"
        returnKeyType="next"
        onSubmitEditing={() => passwordRef.current?.focus()}
        placeholder="tu@email.com"
      />
      <TextField
        ref={passwordRef}
        label="Contraseña"
        value={form.password}
        onChangeText={set('password')}
        error={errors.password}
        secureTextEntry
        autoComplete={Platform.OS === 'web' ? 'current-password' : 'password'}
        textContentType="password"
        returnKeyType="go"
        onSubmitEditing={submit}
        placeholder="••••••••"
      />
      <View style={styles.optionsRow}>
        <Pressable
          onPress={toggleRemember}
          disabled={loading}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: remember }}
          hitSlop={8}
          style={styles.remember}
        >
          <Ionicons name={remember ? 'checkbox' : 'square-outline'} size={22} color={remember ? colors.primary : colors.muted} />
          <Text style={styles.rememberText}>Recordarme</Text>
        </Pressable>
        <Link href={{ pathname: '/forgot-password', params: { email: form.email.trim() } }} style={styles.forgot} hitSlop={8}>
          ¿Olvidaste tu contraseña?
        </Link>
      </View>
      {socialOnly ? (
        <Button
          title="Crear una contraseña para esta cuenta"
          block
          variant="secondary"
          onPress={() => router.push({ pathname: '/forgot-password', params: { email: form.email.trim(), create: '1' } })}
        />
      ) : null}
      <Button title="Ingresar" block onPress={submit} loading={loading} />
      <SocialButtons onError={setFormError} disabled={loading} remember={remember} />
      <View style={styles.footer}>
        <Text style={styles.muted}>¿No tenés cuenta?</Text>
        <Link href="/register" style={styles.link}>
          Registrate
        </Link>
      </View>
    </AuthLayout>
  );
}

const styles = createStyles(() => StyleSheet.create({
  footer: { flexDirection: 'row', justifyContent: 'center', gap: spacing.xs },
  muted: { color: colors.muted, fontSize: font.md },
  link: { color: colors.primary, fontSize: font.md, fontWeight: '600' },
  optionsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: spacing.sm },
  remember: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  rememberText: { color: colors.text, fontSize: font.sm },
  forgot: { color: colors.primary, fontSize: font.sm, fontWeight: '600', marginLeft: 'auto', paddingVertical: spacing.xs },
}));
