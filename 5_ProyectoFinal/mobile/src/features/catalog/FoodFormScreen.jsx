import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import { foodsApi } from '../../api/endpoints';
import { Button, Card, ErrorState, FieldRow, FormError, Loading, Screen, TextField } from '../../components';
import { useAuth } from '../../context/AuthContext';
import { colors, createStyles, font, spacing, useTheme } from '../../theme';
import { confirm } from '../../utils/confirm';
import { decimal } from '../../utils/inputs';
import { toNumber, validateMacroConsistency, validateNumbers, validateText } from '../../utils/validation';

const EMPTY = { name: '', category: '', brand: '', portionGrams: '100', portionDescription: '', kcal: '', protein: '', carbs: '', fat: '' };

/** Alta / edición / baja de un alimento (propio, o global si es coach/admin). */
export default function FoodFormScreen() {
  useTheme();
  const router = useRouter();
  const { user } = useAuth();
  const { id: idParam } = useLocalSearchParams();
  const id = idParam ? Number(idParam) : null;
  const isStaff = user.role !== 'athlete';

  const [form, setForm] = useState(EMPTY);
  const [isGlobal, setIsGlobal] = useState(isStaff);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(Boolean(id));
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    if (!id) return;
    foodsApi
      .get(id)
      .then((f) => {
        setIsGlobal(f.isGlobal);
        setForm({
          name: f.name,
          category: f.category || '',
          brand: f.brand || '',
          portionGrams: String(f.portionGrams),
          portionDescription: f.portionDescription || '',
          kcal: String(f.kcal),
          protein: String(f.protein),
          carbs: String(f.carbs),
          fat: String(f.fat),
        });
      })
      .catch(setLoadError)
      .finally(() => setLoading(false));
  }, [id]);

  // Números: solo dígitos y un decimal (porción hasta 5000 g, macros hasta 5000).
  const NUMERIC = { portionGrams: decimal(4), kcal: decimal(4), protein: decimal(4), carbs: decimal(4), fat: decimal(4) };
  const set = (key) => (value) => {
    setForm((f) => ({ ...f, [key]: NUMERIC[key] ? NUMERIC[key](value) : value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const save = async () => {
    // Mismos límites que el servidor (foods.schemas.js) + coherencia entre calorías y macros.
    const max = { portionGrams: 5000, kcal: 5000, protein: 5000, carbs: 5000, fat: 5000 };
    const found = validateNumbers(form, ['portionGrams', 'kcal', 'protein', 'carbs', 'fat'], { positive: ['portionGrams'], max });
    if (!Object.keys(found).length) Object.assign(found, validateMacroConsistency({ ...form, grams: form.portionGrams }));
    const texts = {
      name: validateText(form.name, { min: 2, max: 150, label: 'el nombre' }),
      category: validateText(form.category, { max: 60 }),
      brand: validateText(form.brand, { max: 80 }),
      portionDescription: validateText(form.portionDescription, { max: 120 }),
    };
    for (const [k, v] of Object.entries(texts)) if (v) found[k] = v;
    setErrors(found);
    setFormError(null);
    if (Object.keys(found).length) return;
    const body = {
      name: form.name.trim(),
      category: form.category.trim() || (isGlobal ? 'General' : 'Personal'),
      brand: form.brand.trim() || null,
      portionGrams: toNumber(form.portionGrams),
      portionDescription: form.portionDescription.trim() || null,
      kcal: toNumber(form.kcal),
      protein: toNumber(form.protein),
      carbs: toNumber(form.carbs),
      fat: toNumber(form.fat),
    };
    setSaving(true);
    try {
      if (id) await foodsApi.update(id, body);
      else await foodsApi.create({ ...body, isGlobal });
      router.back();
    } catch (err) {
      setErrors(err.fieldErrors);
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!(await confirm('Eliminar alimento', `¿Eliminar "${form.name}"? Los registros del diario se conservan.`))) return;
    try {
      await foodsApi.remove(id);
      router.back();
    } catch (err) {
      setFormError(err.message);
    }
  };

  if (loading) return <Loading />;
  if (loadError) return <ErrorState error={loadError} onRetry={() => router.back()} />;

  return (
    <Screen
      footer={
        <View style={styles.row}>
          {id ? <Button title="Eliminar" variant="danger" icon="trash-outline" onPress={remove} /> : null}
          <Button title={id ? 'Guardar cambios' : 'Crear alimento'} onPress={save} loading={saving} style={{ flex: 1 }} />
        </View>
      }
    >
      <Stack.Screen options={{ title: id ? 'Editar alimento' : 'Nuevo alimento' }} />
      <FormError message={formError} />
      {isStaff && !id ? (
        <View style={styles.switchRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.switchLabel}>Agregar al catálogo global</Text>
            <Text style={styles.muted}>Lo verán todos los usuarios. Si lo desactivás, queda solo para vos.</Text>
          </View>
          <Switch value={isGlobal} onValueChange={setIsGlobal} />
        </View>
      ) : null}
      <Card>
        <TextField label="Nombre" value={form.name} onChangeText={set('name')} error={errors.name} maxLength={150} />
        <FieldRow>
          <TextField label="Categoría" value={form.category} onChangeText={set('category')} error={errors.category} placeholder="Ej. Lácteos" maxLength={60} />
          <TextField label="Marca" value={form.brand} onChangeText={set('brand')} error={errors.brand} maxLength={80} />
        </FieldRow>
      </Card>
      <Card title="Valores por porción">
        <FieldRow>
          <TextField label="Porción (g)" value={form.portionGrams} onChangeText={set('portionGrams')} error={errors.portionGrams} keyboardType="decimal-pad" hint="Entre 0,1 y 5000 g" />
          <TextField label="Descripción" value={form.portionDescription} onChangeText={set('portionDescription')} error={errors.portionDescription} placeholder="1 taza" maxLength={120} />
        </FieldRow>
        <FieldRow>
          <TextField label="Kcal" value={form.kcal} onChangeText={set('kcal')} error={errors.kcal} keyboardType="decimal-pad" />
          <TextField label="Proteínas (g)" value={form.protein} onChangeText={set('protein')} error={errors.protein} keyboardType="decimal-pad" />
        </FieldRow>
        <FieldRow>
          <TextField label="Carbohidratos (g)" value={form.carbs} onChangeText={set('carbs')} error={errors.carbs} keyboardType="decimal-pad" />
          <TextField label="Grasas (g)" value={form.fat} onChangeText={set('fat')} error={errors.fat} keyboardType="decimal-pad" />
        </FieldRow>
        <Text style={styles.muted}>Las calorías se controlan contra los macros (4 kcal por gramo de proteína y carbohidrato, 9 por gramo de grasa).</Text>
      </Card>
    </Screen>
  );
}

const styles = createStyles(() => StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  switchRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  switchLabel: { color: colors.text, fontSize: font.md, fontWeight: '600' },
  muted: { color: colors.muted, fontSize: font.sm },
}));
