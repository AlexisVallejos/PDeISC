import { Redirect, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Platform, View } from 'react-native';
import { relayPopupResult } from '../api/socialLogin';
import { ErrorState, Loading } from '../components';
import { useAuth } from '../context/AuthContext';
import { colors, useTheme } from '../theme';

/**
 * Vuelta del login social.
 * - Web con ventana emergente (?popup=<id del intento>): le pasa el resultado a la pestaña de la app y se cierra.
 * - Web sin ventana emergente: la pestaña llega con ?code=... y acá se canjea por la sesión.
 * - App: el código lo procesa WebBrowser.openAuthSessionAsync; esta ruta solo evita "ruta no encontrada".
 */
export default function OAuthCallback() {
  useTheme();
  const params = useLocalSearchParams();
  const router = useRouter();
  const { finishWebSocialLogin } = useAuth();
  const [error, setError] = useState(null);
  const [relayed, setRelayed] = useState(false);
  const started = useRef(false);
  const isPopup = Platform.OS === 'web' && Boolean(params.popup);

  useEffect(() => {
    if (Platform.OS !== 'web' || started.current) return;
    started.current = true;
    if (isPopup) {
      relayPopupResult(params);
      // Si el navegador no deja cerrarla sola, se muestra el aviso para cerrarla a mano.
      setTimeout(() => setRelayed(true), 400);
      return;
    }
    finishWebSocialLogin(params)
      .then(() => router.replace('/'))
      .catch((err) => {
        // Cuenta nueva: se activa con el código que llegó al email.
        if (err.code === 'EMAIL_NOT_VERIFIED') router.replace({ pathname: '/verify-email', params: { email: err.details[0].message } });
        else setError(err);
      });
  }, [finishWebSocialLogin, isPopup, params, router]);

  if (Platform.OS !== 'web') return <Redirect href="/" />;
  if (isPopup) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <Loading label={relayed ? 'Listo. Ya podés cerrar esta ventana y volver a MacroEntreno.' : 'Iniciando sesión…'} />
      </View>
    );
  }
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {error ? <ErrorState error={error} onRetry={() => router.replace('/login')} /> : <Loading label="Iniciando sesión…" />}
    </View>
  );
}
