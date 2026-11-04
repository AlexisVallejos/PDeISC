import { Redirect, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Platform, View } from 'react-native';
import { ErrorState, Loading } from '../components';
import { useAuth } from '../context/AuthContext';
import { colors, useTheme } from '../theme';

/**
 * Vuelta del login social.
 * - Web: la pestaña llega con ?code=... y acá se canjea por la sesión.
 * - App: el código lo procesa WebBrowser.openAuthSessionAsync; esta ruta solo evita "ruta no encontrada".
 */
export default function OAuthCallback() {
  useTheme();
  const params = useLocalSearchParams();
  const router = useRouter();
  const { finishWebSocialLogin } = useAuth();
  const [error, setError] = useState(null);
  const started = useRef(false);

  useEffect(() => {
    if (Platform.OS !== 'web' || started.current) return;
    started.current = true;
    finishWebSocialLogin(params)
      .then(() => router.replace('/'))
      .catch(setError);
  }, [finishWebSocialLogin, params, router]);

  if (Platform.OS !== 'web') return <Redirect href="/" />;
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {error ? <ErrorState error={error} onRetry={() => router.replace('/login')} /> : <Loading label="Iniciando sesión…" />}
    </View>
  );
}
