import { Ionicons } from '@expo/vector-icons';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { Button } from '../../components';
import { colors, continuous, createStyles, font, radius, spacing, useTheme } from '../../theme';

/** Errores que se arreglan configurando el servidor (no reintentando): se muestra este panel. */
export const SETUP_CODES = ['AI_NOT_CONFIGURED', 'AI_INVALID_KEY'];

/**
 * Estado vacío cuando el asistente no puede funcionar por falta de clave (o clave inválida).
 * Muestra un mensaje para el usuario; cómo configurar la clave está en el README del backend.
 */
export function AssistantSetup({ reason = 'AI_NOT_CONFIGURED', isAdmin, onRecheck, checking }) {
  useTheme();
  const invalid = reason === 'AI_INVALID_KEY';
  return (
    <View style={styles.root} accessibilityRole="summary">
      <View style={[styles.icon, continuous]}>
        <Ionicons name={invalid ? 'alert-circle-outline' : 'key-outline'} size={30} color={colors.warning} />
      </View>
      {/* Mensaje para quien usa la app: los pasos de configuración están en el README, no en pantalla. */}
      <Text style={styles.title}>El asistente no está disponible</Text>
      <Text style={styles.text}>
        {invalid
          ? 'Hay un problema con la conexión del asistente. Ya está avisado; probá de nuevo más tarde.'
          : 'El asistente con IA todavía no está activo en este servidor. Probá de nuevo más tarde.'}
      </Text>

      {onRecheck ? <Button title="Volver a probar" icon="refresh" variant="tinted" onPress={onRecheck} loading={checking} /> : null}
    </View>
  );
}

const mono = Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' });

const styles = createStyles(() => StyleSheet.create({
  root: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md, paddingVertical: spacing.xl },
  icon: { width: 64, height: 64, borderRadius: 18, backgroundColor: colors.cardAlt, alignItems: 'center', justifyContent: 'center' },
  title: { color: colors.text, fontSize: font.xl, fontWeight: '700', textAlign: 'center' },
  text: { color: colors.muted, fontSize: font.md, textAlign: 'center', maxWidth: 440, lineHeight: 21 },
  card: { alignSelf: 'stretch', gap: spacing.md, padding: spacing.lg, borderRadius: radius.lg, backgroundColor: colors.card },
  step: { flexDirection: 'row', gap: spacing.md, alignItems: 'flex-start' },
  stepNumber: { width: 24, height: 24, borderRadius: 12, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
  stepNumberText: { color: colors.primary, fontSize: font.sm, fontWeight: '700' },
  stepText: { color: colors.text, fontSize: font.md },
  code: { fontFamily: mono, color: colors.text, fontSize: font.sm, backgroundColor: colors.fill, borderRadius: radius.sm, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, overflow: 'hidden' },
  hint: { color: colors.muted, fontSize: font.sm, lineHeight: 19 },
}));
