import { Link, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { authApi } from '../../api/endpoints';
import { Button, FormError, TextField } from '../../components';
import { useAuth } from '../../context/AuthContext';
import { colors, createStyles, font, spacing, useTheme } from '../../theme';
import { validateCode, validateEmail, validatePassword } from '../../utils/validation';
import { AuthLayout } from './AuthLayout';

/** "Olvidé mi contraseña": 1) pedir el código al email, 2) código + contraseña nueva. */
export default function ForgotPasswordScreen() {
  useTheme();
  const params = useLocalSearchParams();
  const { resetPassword } = useAuth();
  const [step, setStep] = useState('email');
  const [form, setForm] = useState({ email: String(params.email ?? ''), code: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [loading, setLoading] = useState(false);

  const set = (key) => (value) => {
    setForm((f) => ({ ...f, [key]: key === 'code' ? value.replace(/\D/g, '').slice(0, 6) : value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const run = async (work) => {
    setFormError(null);
    setLoading(true);
    try {
      await work();
    } catch (err) {
      setErrors(err.fieldErrors ?? {});
      setFormError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const sendCode = () => {
    const email = validateEmail(form.email);
    setErrors({ email });
    if (email) return;
    run(async () => {
      await authApi.forgotPassword({ email: form.email.trim() });
      setStep('code');
    });
  };

  const submit = () => {
    const found = {};
    const code = validateCode(form.code);
    if (code) found.code = code;
    const password = validatePassword(form.password);
    if (password) found.password = password;
    if (form.password !== form.confirm) found.confirm = 'Las contraseñas no coinciden';
    setErrors(found);
    if (Object.keys(found).length) return;
    // Al abrir la sesión, la navegación pasa sola a la app.
    run(() => resetPassword(form.email.trim(), form.code, form.password));
  };

  return (
    <AuthLayout
      title="Recuperá tu contraseña"
      subtitle={step === 'email' ? 'Te mandamos un código a tu email para elegir una contraseña nueva.' : `Si ${form.email.trim()} tiene cuenta, ya te llegó un código de 6 números.`}
    >
      <FormError message={formError} />
      {step === 'email' ? (
        <>
          <TextField
            label="Email"
            value={form.email}
            onChangeText={set('email')}
            error={errors.email}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            onSubmitEditing={sendCode}
            placeholder="tu@gmail.com"
          />
          <Button title="Enviar código" onPress={sendCode} loading={loading} />
        </>
      ) : (
        <>
          <TextField
            label="Código"
            value={form.code}
            onChangeText={set('code')}
            error={errors.code}
            keyboardType="number-pad"
            autoComplete="one-time-code"
            textContentType="oneTimeCode"
            maxLength={6}
            placeholder="123456"
          />
          <TextField
            label="Contraseña nueva"
            value={form.password}
            onChangeText={set('password')}
            error={errors.password ?? errors.newPassword}
            hint="Mínimo 8 caracteres, con letras y números"
            secureTextEntry
            autoComplete="new-password"
          />
          <TextField
            label="Repetir contraseña"
            value={form.confirm}
            onChangeText={set('confirm')}
            error={errors.confirm}
            secureTextEntry
            onSubmitEditing={submit}
          />
          <Button title="Cambiar contraseña y entrar" onPress={submit} loading={loading} />
          <Button title="Reenviar código" variant="secondary" onPress={sendCode} disabled={loading} />
        </>
      )}
      <View style={styles.footer}>
        <Text style={styles.muted}>¿La recordaste?</Text>
        <Link href="/login" style={styles.link}>
          Iniciá sesión
        </Link>
      </View>
    </AuthLayout>
  );
}

const styles = createStyles(() => StyleSheet.create({
  footer: { flexDirection: 'row', justifyContent: 'center', gap: spacing.xs },
  muted: { color: colors.muted, fontSize: font.md },
  link: { color: colors.primary, fontSize: font.md, fontWeight: '600' },
}));
