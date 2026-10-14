import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import Animated, { Easing, FadeIn, FadeInDown, useReducedMotion } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GridBackground } from '../components/GridBackground';
import { Logo3D } from '../components/Logo3D';
import { PressableScale } from '../components/PressableScale';
import { ThemeToggle } from '../components/ThemeToggle';
import { useTheme } from '../ThemeContext';
import { colors, radius, space, type as t } from '../theme';
import type { BienvenidaScreenProps } from '../types/navigation';

const EASE_OUT = Easing.bezier(0.23, 1, 0.32, 1);

/** Pantalla de navegación: toma los datos de la ruta y se los pasa por props a <Bienvenida />. */
export function BienvenidaScreen({ route, navigation }: BienvenidaScreenProps) {
  const { usuario } = route.params;

  return (
    <Bienvenida
      nombre={usuario.nombre}
      usuario={usuario.usuario}
      email={usuario.email}
      rol={usuario.rol}
      ultimoAcceso={usuario.ultimoAcceso}
      onCerrarSesion={() => navigation.popToTop()}
    />
  );
}

export interface BienvenidaProps {
  nombre: string;
  usuario: string;
  email: string;
  rol: string;
  ultimoAcceso: string | null;
  onCerrarSesion: () => void;
}

function saludo(hora = new Date().getHours()) {
  if (hora < 6) return 'Buenas noches';
  if (hora < 13) return 'Buenos días';
  if (hora < 20) return 'Buenas tardes';
  return 'Buenas noches';
}

/** Iniciales (máx. 2). Si el nombre viene vacío usa el usuario; si tampoco hay, "?". */
function iniciales(nombre: string, usuario: string) {
  const partes = nombre.trim().split(/\s+/).filter(Boolean);
  const letras = partes.slice(0, 2).map((p) => Array.from(p)[0]!.toUpperCase());
  if (letras.length) return letras.join('');
  const u = Array.from(usuario.trim())[0];
  return u ? u.toUpperCase() : '?';
}

function formatearAcceso(iso: string | null) {
  if (!iso) return 'Primer ingreso';
  const fecha = new Date(iso);
  if (Number.isNaN(fecha.getTime())) return 'Sin registro';
  return fecha.toLocaleString('es-AR', { dateStyle: 'medium', timeStyle: 'short' });
}

export function Bienvenida({ nombre, usuario, email, rol, ultimoAcceso, onCerrarSesion }: BienvenidaProps) {
  const insets = useSafeAreaInsets();
  const reduceMotion = useReducedMotion();
  const { width } = useWindowDimensions();
  const { mode, palette } = useTheme();
  const wide = width >= 850;

  const nombreVisible = nombre.trim() || usuario.trim() || 'Usuario';
  const rolVisible = rol.trim() ? rol.trim() : '—';

  const entrada = (ms: number) =>
    reduceMotion ? FadeIn.duration(200) : FadeInDown.delay(ms).duration(420).easing(EASE_OUT);

  return (
    <View style={[styles.root, { backgroundColor: palette.background }]}>
      <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />
      <GridBackground color={palette.grid} />
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + space.lg, paddingBottom: Math.max(insets.bottom, space.lg) + space.lg },
        ]}
        contentInsetAdjustmentBehavior="never"
      >
        <View style={[styles.header, wide && styles.headerWide]}>
          <Logo3D size={wide ? 34 : 26} variant={mode === 'dark' ? 'dark' : 'light'} />
          <ThemeToggle />
        </View>

        <View style={[styles.main, wide && styles.mainWide]}>
          <View style={[styles.identity, wide && styles.identityWide]}>
            <Animated.View entering={entrada(60)} style={styles.avatar}>
              <Text style={styles.avatarText} allowFontScaling={false}>
                {iniciales(nombre, usuario)}
              </Text>
            </Animated.View>

            <Animated.Text entering={entrada(110)} style={[styles.kicker, { color: palette.secondaryLabel }]}>
              {saludo()}
            </Animated.Text>
            <Animated.Text
              entering={entrada(150)}
              style={[styles.name, nombreVisible.length > 22 && styles.nameLong, wide && styles.nameWide, { color: palette.label }]}
              numberOfLines={3}
              accessibilityRole="header"
            >
              {nombreVisible}
            </Animated.Text>

            <Animated.View entering={entrada(220)} style={[styles.statusPill, { backgroundColor: palette.successBackground }]}>
              <View style={styles.statusDot} />
              <Text style={[styles.statusText, { color: palette.successLabel }]}>Sesión iniciada</Text>
            </Animated.View>
          </View>

          <View style={styles.account}>
            <Animated.View entering={entrada(300)} style={[styles.groupWrap, wide && styles.groupWrapWide]}>
              <Text style={[styles.groupHeader, { color: palette.secondaryLabel }]}>Cuenta</Text>
              <View style={[styles.group, { backgroundColor: palette.surface, boxShadow: palette.shadow }]}>
                <Row label="Usuario" value={`@${usuario}`} mono />
                <Row label="Email" value={email || '—'} />
                <Row label="Rol" value={rolVisible} />
                <Row label="Último acceso" value={formatearAcceso(ultimoAcceso)} last />
              </View>
            </Animated.View>

            <Animated.View entering={entrada(380)} style={styles.groupWrap}>
              <PressableScale
                onPress={onCerrarSesion}
                style={[styles.logout, { backgroundColor: palette.destructiveBackground }]}
                accessibilityRole="button"
              >
                <Text style={styles.logoutText}>Cerrar sesión</Text>
              </PressableScale>
            </Animated.View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

/**
 * Fila de lista agrupada. Etiqueta arriba y valor abajo: los valores largos
 * (emails, nombres) envuelven en vez de truncarse. El valor es seleccionable.
 */
function Row({ label, value, last, mono }: { label: string; value: string; last?: boolean; mono?: boolean }) {
  const { palette } = useTheme();
  return (
    <View style={[styles.row, !last && styles.rowDivider, !last && { borderBottomColor: palette.separator }]}>
      <Text style={[styles.rowLabel, { color: palette.secondaryLabel }]}>{label}</Text>
      <Text style={[styles.rowValue, mono && styles.rowMono, { color: palette.label }]} selectable>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: space.xl },
  header: { width: '100%', maxWidth: 980, alignItems: 'center', gap: space.sm, marginBottom: space.xl },
  headerWide: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: space.xxxl },
  main: { width: '100%', alignItems: 'center' },
  mainWide: { maxWidth: 980, flexDirection: 'row', alignItems: 'center', gap: space.xxxl },
  identity: { width: '100%', alignItems: 'center' },
  identityWide: { flex: 1, alignItems: 'flex-start' },
  account: { width: '100%', maxWidth: 440 },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 12px 28px rgba(227, 6, 20, 0.30), inset 0 1px 0 rgba(255,255,255,0.35)',
  },
  avatarText: { ...t.title1, fontSize: 32, lineHeight: 38, fontWeight: '700', letterSpacing: -0.5, color: colors.white },
  kicker: { ...t.subhead, marginTop: space.xl },
  name: { ...t.largeTitle, marginTop: 2, textAlign: 'center', maxWidth: 440 },
  nameWide: { textAlign: 'left' },
  // Nombres largos bajan un escalón tipográfico en vez de truncarse antes.
  nameLong: { ...t.title1, textAlign: 'center' },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: space.md,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.pill,
  },
  statusDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.success },
  statusText: { ...t.footnote, fontWeight: '600' },
  groupWrap: { width: '100%', maxWidth: 440, marginTop: space.xxl },
  groupWrapWide: { marginTop: 0 },
  groupHeader: { ...t.footnote, textTransform: 'uppercase', letterSpacing: 0.4, paddingHorizontal: 16, marginBottom: 7 },
  group: {
    borderRadius: radius.md,
    borderCurve: 'continuous',
    overflow: 'hidden',
  },
  row: { paddingLeft: 16, paddingRight: 16, paddingVertical: 11, gap: 2 },
  rowDivider: { borderBottomWidth: StyleSheet.hairlineWidth, marginLeft: 0 },
  rowLabel: { ...t.footnote },
  rowValue: { ...t.body },
  rowMono: { fontVariant: ['tabular-nums'] },
  logout: {
    height: 50,
    borderRadius: radius.md,
    borderCurve: 'continuous',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutText: { ...t.headline, color: colors.primary },
});
