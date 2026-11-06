import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, continuous, createStyles, font, radius, spacing, useTheme } from '../theme';
import { Button } from './Button';

/**
 * Diálogos con el estilo de la app (en lugar del Alert del sistema o el confirm del navegador).
 * Se montan una sola vez en el layout raíz (<DialogHost />) y se abren con showDialog(),
 * que usan confirm() y notify() de utils/confirm.js.
 */
let present = null; // lo registra el DialogHost montado

/**
 * Abre un diálogo y resuelve con el `value` del botón tocado (o el del botón de cancelar si se
 * toca afuera o el botón "atrás"). Devuelve null si no hay un DialogHost montado.
 * buttons: [{ text, value, variant: 'primary' | 'secondary' | 'danger', cancel?: true }]
 */
export function showDialog(dialog) {
  if (!present) return null;
  return new Promise((resolve) => present({ ...dialog, resolve }));
}

export function DialogHost() {
  useTheme();
  const [queue, setQueue] = useState([]);
  const current = queue[0];

  useEffect(() => {
    present = (dialog) => setQueue((q) => [...q, dialog]);
    return () => {
      present = null;
    };
  }, []);

  const close = (value) => {
    current?.resolve(value);
    setQueue((q) => q.slice(1));
  };
  const cancelValue = current?.buttons.find((b) => b.cancel)?.value ?? current?.buttons.at(-1)?.value;

  return (
    <Modal visible={Boolean(current)} transparent animationType="fade" statusBarTranslucent onRequestClose={() => close(cancelValue)}>
      <View style={styles.root}>
        <Pressable style={StyleSheet.absoluteFill} onPress={() => close(cancelValue)} accessibilityLabel="Cerrar" />
        {current ? (
          <View style={[styles.card, continuous]} accessibilityRole="alert" accessibilityViewIsModal>
            {current.icon ? (
              <View style={[styles.iconWrap, { backgroundColor: `${current.iconColor ?? colors.primary}22` }]}>
                <Ionicons name={current.icon} size={28} color={current.iconColor ?? colors.primary} />
              </View>
            ) : null}
            <Text style={styles.title}>{current.title}</Text>
            {current.message ? <Text style={styles.message}>{current.message}</Text> : null}
            <View style={[styles.buttons, current.buttons.length > 1 && styles.buttonsRow]}>
              {current.buttons.map((b) => (
                <Button
                  key={b.text}
                  title={b.text}
                  variant={b.variant ?? 'primary'}
                  block
                  onPress={() => close(b.value)}
                  style={current.buttons.length > 1 ? styles.rowButton : undefined}
                />
              ))}
            </View>
          </View>
        ) : null}
      </View>
    </Modal>
  );
}

const styles = createStyles(() => StyleSheet.create({
  root: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  card: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.xl,
    gap: spacing.md,
    alignItems: 'center',
  },
  iconWrap: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  title: { color: colors.text, fontSize: font.lg, fontWeight: '700', textAlign: 'center' },
  message: { color: colors.muted, fontSize: font.md, textAlign: 'center', lineHeight: font.md * 1.4 },
  buttons: { alignSelf: 'stretch', gap: spacing.sm, marginTop: spacing.sm },
  buttonsRow: { flexDirection: 'row-reverse' },
  rowButton: { flex: 1 },
}));
