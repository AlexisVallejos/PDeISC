import { Alert, Platform } from 'react-native';
import { showDialog } from '../components/DialogHost';
import { colors } from '../theme';

/**
 * Pregunta de confirmación con el diálogo de la app (ver components/DialogHost.jsx).
 * Resuelve true si se confirma. Si el diálogo no está montado, usa el del sistema.
 */
export function confirm(title, message, { confirmText = 'Eliminar', destructive = true, icon } = {}) {
  const shown = showDialog({
    title,
    message,
    icon: icon ?? (destructive ? 'trash-outline' : 'help-circle-outline'),
    iconColor: destructive ? colors.danger : colors.primary,
    buttons: [
      { text: confirmText, value: true, variant: destructive ? 'danger' : 'primary' },
      { text: 'Cancelar', value: false, variant: 'secondary', cancel: true },
    ],
  });
  if (shown) return shown;
  if (Platform.OS === 'web') return Promise.resolve(globalThis.confirm?.(`${title}\n\n${message}`) ?? false);
  return new Promise((resolve) => {
    Alert.alert(title, message, [
      { text: 'Cancelar', style: 'cancel', onPress: () => resolve(false) },
      { text: confirmText, style: destructive ? 'destructive' : 'default', onPress: () => resolve(true) },
    ]);
  });
}

/** Aviso con un solo botón ("Entendido"). `options.icon`/`options.error` cambian el ícono. */
export function notify(title, message, { icon, error = false } = {}) {
  const shown = showDialog({
    title,
    message,
    icon: icon ?? (error ? 'alert-circle-outline' : 'checkmark-circle-outline'),
    iconColor: error ? colors.danger : colors.primary,
    buttons: [{ text: 'Entendido', value: true, variant: 'primary', cancel: true }],
  });
  if (shown) return shown;
  if (Platform.OS === 'web') globalThis.alert?.(`${title}\n\n${message ?? ''}`);
  else Alert.alert(title, message);
  return Promise.resolve(true);
}
