import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { bodyApi } from '../../api/endpoints';
import { Button, Card, Chips, Columns, ErrorState, FieldRow, FormError, Loading, Screen, TextField } from '../../components';
import { useAuth } from '../../context/AuthContext';
import { useResource } from '../../hooks/useResource';
import { colors, continuous, createStyles, font, radius, spacing, useTheme } from '../../theme';
import { fmt } from '../../utils/format';

const SEX = [
  { value: 'male', label: 'Hombre' },
  { value: 'female', label: 'Mujer' },
];
const PACE = [
  { value: 'slow', label: 'Lento' },
  { value: 'moderate', label: 'Moderado' },
  { value: 'fast', label: 'Rápido' },
];
const EMPTY = { sex: null, birthDate: '', heightCm: '', weightKg: '', bodyFatPct: '', activityLevel: null, goal: null, pace: 'moderate' };

const toNumber = (v) => (v === '' || v == null ? null : Number(String(v).replace(',', '.')));

/** Lo que manda el formulario al servidor; null si todavía falta algo obligatorio. */
function toPayload(form) {
  const payload = {
    sex: form.sex,
    birthDate: form.birthDate.trim(),
    heightCm: toNumber(form.heightCm),
    weightKg: toNumber(form.weightKg),
    bodyFatPct: toNumber(form.bodyFatPct),
    activityLevel: form.activityLevel,
    goal: form.goal,
    pace: form.pace,
  };
  const complete = payload.sex && /^\d{4}-\d{2}-\d{2}$/.test(payload.birthDate) && payload.heightCm && payload.weightKg && payload.activityLevel && payload.goal;
  return complete ? payload : null;
}

/**
 * Datos corporales y objetivo. Con peso, altura, edad, sexo y actividad se calcula el gasto
 * (Mifflin-St Jeor o Katch-McArdle) y las metas de calorías y macros para el objetivo elegido.
 */
export default function BodyProfileScreen() {
  useTheme();
  const { data, error, loading, reload } = useResource(() => Promise.all([bodyApi.get(), bodyApi.options()]), []);
  if (error) return <ErrorState error={error} onRetry={reload} />;
  if (loading || !data) return <Loading />;
  const [body, options] = data;
  return <BodyForm body={body} options={options} reload={reload} />;
}

/** Formulario con los datos guardados como punto de partida. */
const initialForm = (p) =>
  p ? { ...p, heightCm: String(p.heightCm), weightKg: String(p.weightKg), bodyFatPct: p.bodyFatPct == null ? '' : String(p.bodyFatPct), pace: p.pace ?? 'moderate' } : EMPTY;

function BodyForm({ body, options, reload }) {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const [form, setForm] = useState(() => initialForm(body.profile));
  const [errors, setErrors] = useState({});
  const [plan, setPlan] = useState(body.plan);
  const [formError, setFormError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [weight, setWeight] = useState('');

  // Vista previa en vivo: se recalcula medio segundo después del último cambio.
  const payload = toPayload(form);
  const key = JSON.stringify(payload);
  useEffect(() => {
    if (!payload) return undefined;
    const t = setTimeout(() => {
      bodyApi
        .preview(payload)
        .then((p) => {
          setPlan(p);
          setErrors({});
        })
        .catch((err) => setErrors(err.fieldErrors ?? {}));
    }, 500);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const set = (field) => (value) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const save = async () => {
    if (!payload) {
      setFormError('Completá sexo, fecha de nacimiento, altura, peso, actividad y objetivo.');
      return;
    }
    setSaving(true);
    setFormError(null);
    try {
      await bodyApi.save({ ...payload, applyGoals: true });
      await refreshUser();
      router.back();
    } catch (err) {
      setErrors(err.fieldErrors ?? {});
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const logWeight = async () => {
    const kg = toNumber(weight);
    if (!kg) return;
    setFormError(null);
    try {
      await bodyApi.logWeight({ weightKg: kg });
      setWeight('');
      await reload();
    } catch (err) {
      setFormError(err.message);
    }
  };

  const goal = options.goals.find((g) => g.value === form.goal);

  const formCards = (
    <>
      <Card title="Tus datos">
        <Text style={styles.label}>Sexo biológico</Text>
        <Chips options={SEX} value={form.sex} onChange={set('sex')} scroll={false} />
        <FieldRow>
          <TextField label="Fecha de nacimiento" value={form.birthDate} onChangeText={set('birthDate')} error={errors.birthDate} placeholder="AAAA-MM-DD" hint="Ej.: 1998-04-21" />
          <TextField label="Altura (cm)" value={form.heightCm} onChangeText={set('heightCm')} error={errors.heightCm} keyboardType="decimal-pad" placeholder="175" />
        </FieldRow>
        <FieldRow>
          <TextField label="Peso (kg)" value={form.weightKg} onChangeText={set('weightKg')} error={errors.weightKg} keyboardType="decimal-pad" placeholder="72,5" />
          <TextField label="% de grasa (opcional)" value={form.bodyFatPct} onChangeText={set('bodyFatPct')} error={errors.bodyFatPct} keyboardType="decimal-pad" placeholder="18" hint="Si lo sabés, el cálculo es más preciso" />
        </FieldRow>
      </Card>

      <Card title="Nivel de actividad">
        {options.activity.map((a) => (
          <Option key={a.value} selected={form.activityLevel === a.value} title={a.label} detail={`${a.detail} · ×${a.factor}`} onPress={() => set('activityLevel')(a.value)} />
        ))}
      </Card>

      <Card title="Objetivo">
        {options.goals.map((g) => (
          <Option key={g.value} selected={form.goal === g.value} title={g.label} onPress={() => set('goal')(g.value)} />
        ))}
        {goal?.hasPace ? (
          <>
            <Text style={styles.label}>Ritmo</Text>
            <Chips options={PACE} value={form.pace} onChange={set('pace')} scroll={false} />
            <Text style={styles.muted}>
              {form.goal === 'cut'
                ? 'Lento 0,5 % · moderado 0,75 % · rápido 1 % del peso por semana. Más lento conserva mejor el músculo.'
                : 'Lento 0,25 % · moderado 0,35 % · rápido 0,5 % del peso por semana. Más rápido suma más grasa.'}
            </Text>
          </>
        ) : null}
      </Card>
    </>
  );

  const result = (
    <>
      <Card title="Tu plan">
        {!plan ? (
          <Text style={styles.muted}>Completá tus datos para ver el cálculo.</Text>
        ) : (
          <>
            <View style={[styles.hero, continuous]}>
              <Text style={styles.heroValue}>{fmt(plan.goals.kcal)}</Text>
              <Text style={styles.heroLabel}>kcal por día</Text>
            </View>
            <View style={styles.macros}>
              <Macro label="Proteínas" grams={plan.goals.protein} color={colors.protein} extra={`${fmt(plan.proteinPerKg)} g/kg`} />
              <Macro label="Carbohidratos" grams={plan.goals.carbs} color={colors.carbs} />
              <Macro label="Grasas" grams={plan.goals.fat} color={colors.fat} />
            </View>
            <Row label="Metabolismo basal" value={`${fmt(plan.bmr)} kcal`} />
            <Row label={`Gasto diario (×${plan.activityFactor})`} value={`${fmt(plan.tdee)} kcal`} />
            <Row label="Cambio esperado" value={plan.weeklyChangeKg ? `${plan.weeklyChangeKg > 0 ? '+' : ''}${fmt(plan.weeklyChangeKg)} kg por semana` : 'Mantener el peso'} />
            <Row label="IMC" value={`${fmt(plan.bmi)} · ${plan.bmiCategory}`} />
            {plan.leanMassKg ? <Row label="Masa magra" value={`${fmt(plan.leanMassKg)} kg`} /> : null}
            <Row label="Agua" value={`${fmt(plan.waterLiters)} L por día`} />
            <Row label="Fibra" value={`${plan.fiberGrams} g por día`} />
            <Text style={styles.muted}>Método: {plan.method}, edad {plan.age} años.</Text>
            {plan.notes.map((n) => (
              <Text key={n} style={styles.warning}>
                {n}
              </Text>
            ))}
          </>
        )}
        <FormError message={formError} />
        <Button title="Guardar y aplicar a mis metas" icon="checkmark" onPress={save} loading={saving} />
        <Text style={styles.muted}>
          Es una estimación: revisá tu peso cada semana y ajustá. Con una condición de salud, embarazo o un trastorno alimentario, seguí la indicación de un profesional.
        </Text>
      </Card>

      {body?.profile ? (
        <Card title="Registrar peso">
          <FieldRow>
            <TextField label="Peso de hoy (kg)" value={weight} onChangeText={setWeight} keyboardType="decimal-pad" placeholder={String(body.profile.weightKg)} />
          </FieldRow>
          <Button title="Guardar peso" icon="scale-outline" variant="tinted" onPress={logWeight} />
          {body.weights.slice(-6).reverse().map((w) => (
            <Row key={w.date} label={w.date} value={`${fmt(w.weightKg)} kg`} />
          ))}
        </Card>
      ) : null}
    </>
  );

  return (
    <Screen>
      <Columns side={formCards} sideWidth={620}>
        {result}
      </Columns>
    </Screen>
  );
}

function Option({ selected, title, detail, onPress }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="radio" accessibilityState={{ selected }} style={[styles.option, continuous, selected && styles.optionSelected]}>
      <View style={[styles.radio, selected && styles.radioOn]} />
      <View style={{ flex: 1 }}>
        <Text style={styles.optionTitle}>{title}</Text>
        {detail ? <Text style={styles.muted}>{detail}</Text> : null}
      </View>
    </Pressable>
  );
}

function Macro({ label, grams, color, extra }) {
  return (
    <View style={styles.macro}>
      <Text style={[styles.macroValue, { color }]}>{grams} g</Text>
      <Text style={styles.muted}>{label}</Text>
      {extra ? <Text style={styles.muted}>{extra}</Text> : null}
    </View>
  );
}

function Row({ label, value }) {
  return (
    <View style={styles.row}>
      <Text style={styles.muted}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const styles = createStyles(() => StyleSheet.create({
  label: { color: colors.muted, fontSize: font.sm, fontWeight: '600' },
  muted: { color: colors.muted, fontSize: font.sm },
  warning: { color: colors.warning, fontSize: font.sm, fontWeight: '600' },
  option: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.md, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border },
  optionSelected: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  radio: { width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: colors.border },
  radioOn: { borderColor: colors.primary, backgroundColor: colors.primary },
  optionTitle: { color: colors.text, fontSize: font.md, fontWeight: '600' },
  hero: { alignItems: 'center', paddingVertical: spacing.md, borderRadius: radius.md, backgroundColor: colors.primarySoft },
  heroValue: { color: colors.primary, fontSize: 40, fontWeight: '800' },
  heroLabel: { color: colors.primary, fontSize: font.sm, fontWeight: '600' },
  macros: { flexDirection: 'row', justifyContent: 'space-around' },
  macro: { alignItems: 'center', gap: 2 },
  macroValue: { fontSize: font.lg, fontWeight: '700' },
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.md },
  rowValue: { color: colors.text, fontSize: font.sm, fontWeight: '600' },
}));
