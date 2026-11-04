import { Link, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { authApi } from '../../api/endpoints';
import { Button, FormError, TextField } from '../../components';
import { useAuth } from '../../context/AuthContext';
import { colors, createStyles, font, spacing, useTheme } from '../../theme';
import { validateCode } from '../../utils/validation';
import { AuthLayout } from './AuthLayout';

/** Segundo paso del registro: el código de 6 números que llegó al email. */
export default function VerifyEmailScreen() {
  useTheme();
  const { email = '' } = useLocalSearchParams();
  const { verifyEmail } = useAuth();
  const [code, setCode] = useState('');
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState(null);
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const submit = async () => {
    const found = validateCode(code);
    setError(found);
    setFormError(null);
    if (found) return;
    setLoading(true);
    try {
      await verifyEmail(String(email), code.trim()); // al abrir la sesión, la navegación pasa a la app
    } catch (err) {
      setFormError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    setResending(true);
    setFormError(null);
    try {
      await authApi.resendCode({ email: String(email), purpose: 'verify' });
      setNotice('Te mandamos un código nuevo.');
    } catch (err) {
      setFormError(err.message);
    } finally {
      setResending(false);
    }
  };

  return (
    <AuthLayout title="Confirmá tu email" subtitle={`Te mandamos un código de 6 números a ${email}. Vence en 10 minutos.`}>
      <FormError message={formError} />
      {notice ? <Text style={styles.notice}>{notice}</Text> : null}
      <TextField
        label="Código"
        value={code}
        onChangeText={(value) => {
          setCode(value.replace(/\D/g, '').slice(0, 6));
          setError(null);
        }}
        error={error}
        keyboardType="number-pad"
        autoComplete="one-time-code"
        textContentType="oneTimeCode"
        maxLength={6}
        onSubmitEditing={submit}
        placeholder="123456"
      />
      <Button title="Confirmar y entrar" block onPress={submit} loading={loading} />
      <Button title="Reenviar código" block variant="secondary" onPress={resend} loading={resending} />
      <View style={styles.footer}>
        <Link href="/register" style={styles.link}>
          Cambiar email
        </Link>
      </View>
    </AuthLayout>
  );
}

const styles = createStyles(() => StyleSheet.create({
  notice: { color: colors.primary, fontSize: font.sm, textAlign: 'center' },
  footer: { flexDirection: 'row', justifyContent: 'center', gap: spacing.xs },
  link: { color: colors.primary, fontSize: font.md, fontWeight: '600' },
}));
