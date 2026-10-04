import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, useReducedMotion } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GridBackground } from '../components/GridBackground';
import { Logo3D } from '../components/Logo3D';
import { PressableScale } from '../components/PressableScale';
import { colors, font } from '../theme';
import type { BienvenidaScreenProps } from '../types/navigation';

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

export function Bienvenida({ nombre, usuario, email, rol, ultimoAcceso, onCerrarSesion }: BienvenidaProps) {
  const insets = useSafeAreaInsets();
  const reduceMotion = useReducedMotion();

  const iniciales = nombre
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join('');

  const acceso = ultimoAcceso
    ? new Date(ultimoAcceso).toLocaleString('es-AR', { dateStyle: 'medium', timeStyle: 'short' })
    : 'Primer ingreso';

  const entrada = (ms: number) =>
    reduceMotion ? FadeIn.duration(200) : FadeInDown.delay(ms).springify().duration(500).dampingRatio(1);

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <GridBackground color={colors.border} />
      <ScrollView contentContainerStyle={[styles.content, { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 32 }]}>
        <Logo3D size={40} variant="light" />

        <Animated.View entering={entrada(500)} style={styles.avatar}>
          <Text style={styles.avatarText}>{iniciales}</Text>
        </Animated.View>

        <Animated.Text entering={entrada(600)} style={styles.kicker}>
          Bienvenido
        </Animated.Text>
        <Animated.Text entering={entrada(660)} style={styles.name}>
          {nombre}
        </Animated.Text>
        <Animated.Text entering={entrada(720)} style={styles.subtitle}>
          Ingresaste correctamente al sistema.
        </Animated.Text>

        <Animated.View entering={entrada(820)} style={styles.card}>
          <Row label="Usuario" value={`@${usuario}`} />
          <Row label="Email" value={email} />
          <Row label="Rol" value={rol} />
          <Row label="Último acceso" value={acceso} last />
        </Animated.View>

        <Animated.View entering={entrada(920)} style={styles.full}>
          <PressableScale onPress={onCerrarSesion} style={styles.logout} accessibilityRole="button">
            <Text style={styles.logoutText}>Cerrar sesión</Text>
          </PressableScale>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

function Row({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <View style={[styles.row, !last && styles.rowDivider]}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  content: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  avatar: {
    marginTop: 28,
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: colors.white,
    boxShadow: '0 10px 24px rgba(227, 6, 20, 0.35)',
  },
  avatarText: { fontFamily: font, fontSize: 30, fontWeight: '900', letterSpacing: -0.5, color: colors.white },
  kicker: {
    fontFamily: font,
    marginTop: 20,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 3.3,
    textTransform: 'uppercase',
    color: colors.primary,
  },
  name: {
    fontFamily: font,
    marginTop: 6,
    fontSize: 34,
    lineHeight: 38,
    fontWeight: '900',
    letterSpacing: -0.9,
    color: colors.carbon,
    textAlign: 'center',
  },
  subtitle: { fontFamily: font, marginTop: 8, fontSize: 15, color: colors.muted, textAlign: 'center' },
  card: {
    marginTop: 28,
    width: '100%',
    maxWidth: 440,
    backgroundColor: colors.card,
    borderRadius: 20,
    paddingHorizontal: 20,
    boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15, gap: 16 },
  rowDivider: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
  rowLabel: {
    fontFamily: font,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: colors.muted,
  },
  rowValue: { fontFamily: font, flexShrink: 1, fontSize: 15, fontWeight: '600', color: colors.carbon },
  full: { width: '100%', maxWidth: 440 },
  logout: {
    marginTop: 24,
    height: 52,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: colors.carbon,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutText: {
    fontFamily: font,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 2.6,
    textTransform: 'uppercase',
    color: colors.carbon,
  },
});
