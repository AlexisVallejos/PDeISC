import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { reportsApi } from '../../api/endpoints';
import { Button, Card, EmptyState, ErrorState, FormError, ListItem, Loading, Screen } from '../../components';
import { useResource } from '../../hooks/useResource';
import { colors, createStyles, font, spacing, useTheme } from '../../theme';
import { addDays, formatWeek } from '../../utils/dates';
import { fmt } from '../../utils/format';
import { savePdf } from '../../utils/savePdf';

export default function WeeklyReportsScreen() {
  useTheme();
  const { userId: param } = useLocalSearchParams();
  const userId = param ? Number(param) : undefined;
  const { data, error, reload, refreshing } = useResource(() => reportsApi.weeklyList(userId), [userId]);
  // Cada informe es desplegable: se abre debajo de su fila y se cierra tocándolo otra vez.
  const [openId, setOpenId] = useState(null);
  const [details, setDetails] = useState({});
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState(null);
  const run = async (action) => {
    setBusy(true); setActionError(null);
    try { await action(); } catch (err) { setActionError(err.message); } finally { setBusy(false); }
  };
  const toggle = (id) => {
    if (openId === id) return setOpenId(null);
    setOpenId(id);
    if (!details[id]) run(async () => { const report = await reportsApi.weekly(id); setDetails((d) => ({ ...d, [id]: report })); });
  };
  return <Screen onRefresh={reload} refreshing={refreshing}>
    <Text style={styles.muted}>Cada lunes se publica el PDF de la semana anterior, de lunes a domingo, con la alimentación registrada, los entrenamientos realizados y la comparación de cargas. Los informes guardados conservan la información al momento del cierre.</Text>
    <FormError message={actionError} />
    <Button title="Generar última semana cerrada" variant="tinted" icon="refresh" loading={busy} onPress={() => run(async () => { await reportsApi.generateWeekly(undefined, userId); await reload(); })} />
    {error ? <ErrorState error={error} onRetry={reload} /> : !data ? <Loading /> : !data.length ? <EmptyState title="Todavía no hay informes" message="El primer informe automático estará disponible cuando termine tu primera semana." /> : <Card title="Informes disponibles">
      {data.map((r) => {
        const open = openId === r.id;
        const report = details[r.id];
        return <View key={r.id}>
          <ListItem
            title={formatWeek(r.weekStart)}
            subtitle={`${r.weekStart} al ${addDays(r.weekStart, 6)}`}
            icon="document-text-outline"
            onPress={() => toggle(r.id)}
            right={<Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={17} color={colors.chevron} />}
          />
          {open && (!report ? <Loading /> : <View style={styles.detail}>
            <Text style={styles.text}>{report.athlete.name} · {report.summary.sessions} sesiones · {report.summary.loggedDays}/7 días con comidas · {report.summary.daysOnTarget} en objetivo</Text>
            <Text style={styles.text}>{report.assessment}</Text>
            {report.daily.map((d) => <Text key={d.date} style={styles.muted}>{d.date}: {d.meals ? `${fmt(d.kcal)} kcal` : 'Sin comidas registradas'} · {d.sessions} sesiones realizadas</Text>)}
            <Button title="Descargar PDF semanal" icon="download-outline" loading={busy} onPress={() => run(async () => savePdf(await reportsApi.weeklyPdf(report.id)))} />
            <Button title="Cerrar" variant="secondary" icon="chevron-up" onPress={() => setOpenId(null)} />
          </View>)}
        </View>;
      })}
    </Card>}
  </Screen>;
}
const styles = createStyles(() => StyleSheet.create({ muted: { color: colors.muted, fontSize: font.sm }, text: { color: colors.text, fontSize: font.md }, detail: { gap: spacing.sm, paddingVertical: spacing.sm, paddingLeft: spacing.sm } }));
