import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { diaryApi, progressApi } from '../../api/endpoints';
import { Button, Card, ErrorState, Grid, KcalBarChart, Loading, MacroSummary, Screen } from '../../components';
import { useAuth } from '../../context/AuthContext';
import { useResource } from '../../hooks/useResource';
import { colors, continuous, createStyles, font, radius, spacing, tracking, useTheme } from '../../theme';
import { today } from '../../utils/dates';
import { AssistantBanner } from '../assistant/AssistantBanner';

export default function AthleteHome() {
  useTheme();
  const router = useRouter();
  const { user } = useAuth();
  const date = today();
  const { data, error, loading, refreshing, reload } = useResource(
    () => Promise.all([diaryApi.day(date), progressApi.get({ days: 7, to: date })]),
    [date],
  );
  const [day, progress] = data || [];

  return (
    <Screen onRefresh={reload} refreshing={refreshing}>
      <View>
        <Text style={styles.hello}>¡Hola, {user.name.split(' ')[0]}!</Text>
        <Text style={styles.sub}>
          {user.coachName ? `Tu entrenador: ${user.coachName}` : 'Todavía no tenés entrenador asignado'}
        </Text>
      </View>

      <View style={styles.actions}>
        <QuickAction
          primary
          icon="add"
          title="Registrar comida"
          onPress={() => router.push({ pathname: '/diary-entry', params: { date } })}
        />
        <QuickAction
          icon="barbell"
          title="Nueva sesión"
          onPress={() => router.push({ pathname: '/workout-form', params: { date } })}
        />
      </View>
      {!user.hasBodyProfile ? (
        <Pressable onPress={() => router.push('/body')} accessibilityRole="button" style={[styles.setup, continuous]}>
          <Ionicons name="body-outline" size={26} color={colors.primary} />
          <View style={{ flex: 1 }}>
            <Text style={styles.setupTitle}>Calculá tus calorías y macros</Text>
            <Text style={styles.sub}>Cargá peso, altura, actividad y objetivo (déficit, mantenimiento o volumen).</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.chevron} />
        </Pressable>
      ) : null}
      <AssistantBanner />

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
        <Button title="Mi plan de alimentación" icon="nutrition-outline" variant="tinted" onPress={() => router.push('/nutrition-plans')} />
        <Button title="Mis informes semanales" icon="document-text-outline" variant="tinted" onPress={() => router.push('/weekly-reports')} />
      </View>
      {error && !data ? (
        <ErrorState error={error} onRetry={reload} />
      ) : loading || !data ? (
        <Loading />
      ) : (
        <Grid>
          <Card title="Hoy">
            <MacroSummary totals={day.totals} goals={day.goals} />
          </Card>
          <Card title="Últimos 7 días">
            <KcalBarChart daily={progress.daily} goal={progress.goals.kcal} height={130} />
            <Text style={styles.sub}>
              {progress.summary.daysOnTarget} de {progress.summary.loggedDays} días en objetivo ·{' '}
              {progress.summary.totalWorkouts} {progress.summary.totalWorkouts === 1 ? 'sesión' : 'sesiones'}
            </Text>
          </Card>
        </Grid>
      )}
    </Screen>
  );
}

/** Acceso rápido en forma de tarjeta: ícono en un círculo y el texto debajo (puede ocupar dos líneas). */
function QuickAction({ icon, title, onPress, primary }) {
  useTheme();
  const fg = primary ? colors.onPrimary : colors.text;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [styles.action, continuous, primary && styles.actionPrimary, pressed && styles.actionPressed]}
    >
      <View style={[styles.actionIcon, { backgroundColor: primary ? 'rgba(0,0,0,0.14)' : colors.primarySoft }]}>
        <Ionicons name={icon} size={20} color={primary ? colors.onPrimary : colors.primary} />
      </View>
      <Text style={[styles.actionText, { color: fg }]}>{title}</Text>
    </Pressable>
  );
}

const styles = createStyles(() => StyleSheet.create({
  setup: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.lg, borderRadius: radius.lg, backgroundColor: colors.primarySoft },
  setupTitle: { color: colors.text, fontSize: font.md + 1, fontWeight: '700' },
  hello: { color: colors.text, fontSize: font.xxl, fontWeight: '700', letterSpacing: tracking.title },
  sub: { color: colors.muted, fontSize: font.sm },
  actions: { flexDirection: 'row', gap: spacing.md },
  action: {
    flex: 1,
    minHeight: 96,
    padding: spacing.lg,
    gap: spacing.sm,
    justifyContent: 'space-between',
    borderRadius: radius.lg,
    backgroundColor: colors.card,
  },
  actionPrimary: { backgroundColor: colors.primary },
  actionPressed: { opacity: 0.85, transform: [{ scale: 0.97 }] },
  actionIcon: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  actionText: { fontSize: font.md + 1, fontWeight: '600', letterSpacing: tracking.headline },
}));
