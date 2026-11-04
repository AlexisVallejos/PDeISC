import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { coachingApi, foodsApi } from '../../api/endpoints';
import { Button, Card, Chips, EmptyState, ErrorState, FormError, ListItem, Loading, Screen, TextField } from '../../components';
import { useResource } from '../../hooks/useResource';
import { colors, createStyles, font, spacing, useTheme } from '../../theme';
import { MEALS, mealLabel } from '../../utils/constants';
import { addDays, today } from '../../utils/dates';
import { fmt } from '../../utils/format';
import { dateMask, decimal } from '../../utils/inputs';
import { validateDateRange, validateNumbers, validateText } from '../../utils/validation';
import { WEEKDAYS } from './NutritionPlansScreen';

export default function NutritionPlanFormScreen() {
  useTheme();
  const router = useRouter();
  const { userId } = useLocalSearchParams();
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [startDate, setStartDate] = useState(today());
  const [endDate, setEndDate] = useState(addDays(today(), 27));
  const [items, setItems] = useState([]);
  const [dayOfWeek, setDay] = useState(0);
  const [meal, setMeal] = useState('desayuno');
  const [search, setSearch] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [formError, setFormError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const { data: foods, error, reload } = useResource(() => foodsApi.list({ search: searchTerm || undefined, scope: 'global', limit: 30 }), [searchTerm]);
  const setGrams = (index, grams) => {
    setItems((list) => list.map((item, i) => i === index ? { ...item, grams: decimal(4)(grams) } : item));
    setErrors((e) => ({ ...e, [`item${index}`]: undefined }));
  };
  // Mismas reglas que el servidor (coaching.routes.js): título 2–120, indicaciones hasta 3000,
  // vigencia de hasta un año y cada cantidad entre 0,1 y 5000 g.
  const validate = () => {
    const found = { ...validateDateRange(startDate, endDate) };
    const t = validateText(title, { min: 2, max: 120, label: 'el título' });
    if (t) found.title = t;
    const n = validateText(notes, { max: 3000 });
    if (n) found.notes = n;
    if (!items.length) found.items = 'Agregá al menos un alimento al menú';
    if (items.length > 100) found.items = 'Como máximo 100 alimentos por plan';
    items.forEach((item, i) => {
      const e = validateNumbers({ g: item.grams }, ['g'], { positive: ['g'], max: { g: 5000 } }).g;
      if (e) found[`item${i}`] = e;
    });
    return found;
  };
  const save = async () => {
    setFormError(null);
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length) return setFormError(found.items ?? 'Revisá los campos marcados en rojo');
    setSaving(true);
    try {
      await coachingApi.createPlan({ athleteId: Number(userId), title: title.trim(), notes: notes.trim(), startDate, endDate,
        items: items.map((i) => ({ foodId: i.food.id, dayOfWeek: i.dayOfWeek, meal: i.meal, grams: Number(i.grams.replace(',', '.')) })) });
      router.back();
    } catch (err) { setFormError(err.message); } finally { setSaving(false); }
  };
  return <Screen footer={<Button title="Asignar plan al atleta" icon="checkmark" loading={saving} onPress={save} />}>
    <Stack.Screen options={{ title: 'Nuevo plan de alimentación' }} />
    <FormError message={formError} />
    <Card title="Indicaciones y vigencia">
      <TextField label="Título" value={title} onChangeText={setTitle} error={errors.title} maxLength={120} placeholder="Ej. Plan semanal de entrenamiento" />
      <TextField label="Indicaciones para el atleta" value={notes} onChangeText={setNotes} error={errors.notes} maxLength={3000} multiline hint={`${notes.length}/3000`} />
      <View style={styles.row}>
        <TextField label="Inicio (AAAA-MM-DD)" value={startDate} onChangeText={(t) => setStartDate(dateMask(t))} error={errors.startDate} keyboardType="number-pad" maxLength={10} style={{ flex: 1, minWidth: 160 }} />
        <TextField label="Fin (AAAA-MM-DD)" value={endDate} onChangeText={(t) => setEndDate(dateMask(t))} error={errors.endDate} hint="Hasta un año de vigencia" keyboardType="number-pad" maxLength={10} style={{ flex: 1, minWidth: 160 }} />
      </View>
    </Card>
    <Card title="Agregar alimentos al menú">
      <Text style={styles.muted}>Los alimentos de Todos los días se suman a los específicos de cada día. Elegí el día y la comida antes de agregar un alimento.</Text>
      <Chips options={WEEKDAYS.map((label, value) => ({ label, value }))} value={dayOfWeek} onChange={setDay} />
      <Chips options={MEALS.map((m) => ({ label: m.label, value: m.key }))} value={meal} onChange={setMeal} />
      <TextField label="Buscar en el catálogo" value={search} onChangeText={setSearch} maxLength={100} onSubmitEditing={() => setSearchTerm(search.trim())} returnKeyType="search" />
      <Button title="Buscar alimentos" variant="tinted" small onPress={() => setSearchTerm(search.trim())} />
      {error ? <ErrorState error={error} onRetry={reload} /> : !foods ? <Loading /> : !foods.data.length ? <EmptyState title="Sin alimentos" message="Probá otra búsqueda o agregá el alimento desde Catálogo." /> : foods.data.map((f) => <ListItem key={f.id} title={f.name} subtitle={`${fmt(f.kcal)} kcal por ${fmt(f.portionGrams)} g · Tocá para agregar`}
        onPress={() => setItems((list) => [...list, { food: f, dayOfWeek, meal, grams: String(f.portionGrams) }])} />)}
    </Card>
    <Card title={`Menú del plan · ${items.length} alimentos`}>
      {!items.length && <Text style={styles.muted}>Seleccioná alimentos del catálogo para armar el plan.</Text>}
      {items.map((item, index) => <View key={index} style={styles.item}>
        <Text style={styles.text}>{WEEKDAYS[item.dayOfWeek]} · {mealLabel(item.meal)} · {item.food.name}</Text>
        <View style={styles.row}>
          <TextField label="Cantidad (gramos)" value={item.grams} onChangeText={(g) => setGrams(index, g)} error={errors[`item${index}`]} keyboardType="decimal-pad" style={{ flex: 1 }} />
          <Button title="Quitar" variant="danger" small onPress={() => setItems((list) => list.filter((_, i) => i !== index))} />
        </View>
      </View>)}
    </Card>
  </Screen>;
}
const styles = createStyles(() => StyleSheet.create({ row: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, alignItems: 'center' }, item: { gap: spacing.sm, paddingVertical: spacing.md }, text: { color: colors.text, fontSize: font.md }, muted: { color: colors.muted, fontSize: font.sm } }));
