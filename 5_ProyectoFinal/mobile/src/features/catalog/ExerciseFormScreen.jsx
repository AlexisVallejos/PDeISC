import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { exercisesApi } from '../../api/endpoints';
import { Button, Chips, ErrorState, FormError, ImageField, Loading, Screen, TextField } from '../../components';
import { colors, createStyles, font, spacing, useTheme } from '../../theme';
import { confirm } from '../../utils/confirm';
import { validateText, validateUrl } from '../../utils/validation';

const DEFAULT_GROUPS = ['Pecho', 'Espalda', 'Piernas', 'Hombros', 'Biceps', 'Triceps', 'Core'];

/** Alta / edición / baja de un ejercicio del catálogo (coach y admin). */
export default function ExerciseFormScreen() {
  useTheme();
  const router = useRouter();
  const { id: idParam } = useLocalSearchParams();
  const id = idParam ? Number(idParam) : null;
  const [form, setForm] = useState({ name: '', muscleGroup: '', equipment: '', imageUrl: '' });
  const [groups, setGroups] = useState(DEFAULT_GROUPS);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(Boolean(id));
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    exercisesApi
      .muscleGroups()
      .then((list) => setGroups([...new Set([...DEFAULT_GROUPS, ...list])]))
      .catch(() => {});
    if (!id) return;
    exercisesApi
      .get(id)
      .then((e) => setForm({ name: e.name, muscleGroup: e.muscleGroup, equipment: e.equipment || '', imageUrl: e.imageUrl || '' }))
      .catch(setLoadError)
      .finally(() => setLoading(false));
  }, [id]);

  const set = (key) => (value) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const save = async () => {
    const found = {};
    // Mismos topes que el servidor (exercises.routes.js).
    const checks = {
      name: validateText(form.name, { min: 2, max: 120, label: 'el nombre' }),
      muscleGroup: validateText(form.muscleGroup, { min: 2, max: 40, label: 'el grupo muscular' }),
      equipment: validateText(form.equipment, { max: 60 }),
      imageUrl: validateUrl(form.imageUrl),
    };
    for (const [k, v] of Object.entries(checks)) if (v) found[k] = v;
    setErrors(found);
    setFormError(null);
    if (Object.keys(found).length) return;
    const body = {
      name: form.name.trim(),
      muscleGroup: form.muscleGroup.trim(),
      equipment: form.equipment.trim() || null,
      imageUrl: form.imageUrl.trim() || null,
    };
    setSaving(true);
    try {
      if (id) await exercisesApi.update(id, body);
      else await exercisesApi.create(body);
      router.back();
    } catch (err) {
      setErrors(err.fieldErrors);
      setFormError(err.status === 409 ? 'Ya existe un ejercicio con ese nombre' : err.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!(await confirm('Eliminar ejercicio', `¿Eliminar "${form.name}" del catálogo? Las sesiones ya cargadas lo conservan.`))) return;
    try {
      await exercisesApi.remove(id);
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
          <Button title={id ? 'Guardar cambios' : 'Crear ejercicio'} onPress={save} loading={saving} style={{ flex: 1 }} />
        </View>
      }
    >
      <Stack.Screen options={{ title: id ? 'Editar ejercicio' : 'Nuevo ejercicio' }} />
      <FormError message={formError} />
      <TextField label="Nombre" value={form.name} onChangeText={set('name')} error={errors.name} maxLength={120} />
      <View style={{ gap: spacing.sm }}>
        <Text style={styles.label}>Grupo muscular</Text>
        <Chips options={groups.map((g) => ({ value: g, label: g }))} value={form.muscleGroup} onChange={set('muscleGroup')} />
        <TextField value={form.muscleGroup} onChangeText={set('muscleGroup')} error={errors.muscleGroup} placeholder="u otro…" maxLength={40} />
      </View>
      <TextField label="Equipamiento (opcional)" value={form.equipment} onChangeText={set('equipment')} error={errors.equipment} placeholder="Barra, máquina…" maxLength={60} />
      <ImageField label="Imagen (opcional)" value={form.imageUrl || null} onChange={(url) => set('imageUrl')(url || '')} error={errors.imageUrl} />
    </Screen>
  );
}

const styles = createStyles(() => StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.md },
  label: { color: colors.muted, fontSize: font.sm, fontWeight: '600' },
}));
