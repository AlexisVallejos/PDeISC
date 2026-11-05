import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import { usePathname } from 'expo-router';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Image, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { Button } from '../../components';
import { useAuth } from '../../context/AuthContext';
import { colors, continuous, createStyles, font, radius, spacing, useTheme } from '../../theme';
import { guideFor } from './guides';

/**
 * Ayuda de cada pantalla: la primera vez que el usuario entra a una pantalla se abre sola una ventana
 * con la captura y los pasos; después se vuelve a abrir con el botón "?" del encabezado.
 * Lo ya visto se recuerda por usuario en el dispositivo.
 */
const store =
  Platform.OS === 'web'
    ? {
        getItemAsync: async (k) => globalThis.localStorage?.getItem(k) ?? null,
        setItemAsync: async (k, v) => globalThis.localStorage?.setItem(k, v),
      }
    : SecureStore;

const HelpContext = createContext({ guide: null, open: () => {} });

export function HelpProvider({ children }) {
  const pathname = usePathname();
  const { user } = useAuth();
  const guide = guideFor(pathname, user?.role);
  const [shown, setShown] = useState(null);

  // Primera visita a la pantalla: se abre sola.
  useEffect(() => {
    if (!guide || !user) return undefined;
    let cancelled = false;
    const key = `macroentreno.help.${user.id}.${guide.key}`;
    (async () => {
      const off = await store.getItemAsync('macroentreno.help.off').catch(() => null);
      const seen = await store.getItemAsync(key).catch(() => null);
      if (cancelled || off || seen) return;
      setShown(guide);
      store.setItemAsync(key, '1').catch(() => {});
    })();
    return () => {
      cancelled = true;
    };
  }, [guide, user]);

  const open = useCallback(() => guide && setShown(guide), [guide]);
  const value = useMemo(() => ({ guide, open }), [guide, open]);

  return (
    <HelpContext.Provider value={value}>
      {children}
      <HelpModal guide={shown} onClose={() => setShown(null)} />
    </HelpContext.Provider>
  );
}

export const useHelp = () => useContext(HelpContext);

/** Botón "?" para el encabezado: abre la guía de la pantalla actual. */
export function HelpButton() {
  useTheme();
  const { guide, open } = useHelp();
  if (!guide) return null;
  return (
    <Pressable onPress={open} hitSlop={10} accessibilityRole="button" accessibilityLabel="Cómo usar esta pantalla" style={styles.headerButton}>
      <Ionicons name="help-circle-outline" size={25} color={colors.primary} />
    </Pressable>
  );
}

function HelpModal({ guide, onClose }) {
  useTheme();
  const { width, height } = useWindowDimensions();
  const wide = width >= 760;
  if (!guide) return null;
  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel="Cerrar ayuda">
        <Pressable style={[styles.sheet, continuous, wide && styles.sheetWide, { maxHeight: height - 48 }]} onPress={() => {}}>
          <ScrollView contentContainerStyle={[styles.content, wide && styles.contentWide]}>
            {guide.image ? (
              <Image source={guide.image} style={[styles.image, continuous, wide && styles.imageWide]} resizeMode="contain" accessibilityLabel={`Captura de ${guide.title}`} />
            ) : null}
            <View style={{ flex: 1, gap: spacing.md }}>
              <View style={styles.badge}>
                <Ionicons name="help-circle" size={16} color={colors.primary} />
                <Text style={styles.badgeText}>Cómo usar esta pantalla</Text>
              </View>
              <Text style={styles.title}>{guide.title}</Text>
              <Text style={styles.intro}>{guide.intro}</Text>
              {guide.steps.map((s, i) => (
                <View key={s.title} style={styles.step}>
                  <View style={[styles.stepIcon, continuous]}>
                    <Ionicons name={s.icon} size={20} color={colors.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.stepTitle}>
                      {i + 1}. {s.title}
                    </Text>
                    <Text style={styles.stepText}>{s.text}</Text>
                  </View>
                </View>
              ))}
              <Text style={styles.hint}>Podés volver a ver esta ayuda con el botón ? de arriba.</Text>
              <Button title="Entendido" icon="checkmark" block onPress={onClose} />
            </View>
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = createStyles(() => StyleSheet.create({
  headerButton: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', alignItems: 'center', justifyContent: 'center', padding: spacing.lg },
  sheet: { width: '100%', maxWidth: 460, backgroundColor: colors.card, borderRadius: radius.lg, overflow: 'hidden' },
  sheetWide: { maxWidth: 860 },
  content: { padding: spacing.xl, gap: spacing.lg },
  contentWide: { flexDirection: 'row', alignItems: 'flex-start' },
  image: { width: '100%', height: 260, borderRadius: radius.md, backgroundColor: colors.background },
  imageWide: { width: 260, height: 510 },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  badgeText: { color: colors.primary, fontSize: font.sm, fontWeight: '600' },
  title: { color: colors.text, fontSize: font.xl, fontWeight: '700' },
  intro: { color: colors.muted, fontSize: font.md },
  step: { flexDirection: 'row', gap: spacing.md, alignItems: 'flex-start' },
  stepIcon: { width: 38, height: 38, borderRadius: 11, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
  stepTitle: { color: colors.text, fontSize: font.md, fontWeight: '600' },
  stepText: { color: colors.muted, fontSize: font.sm, lineHeight: 19 },
  hint: { color: colors.muted, fontSize: font.xs },
}));
