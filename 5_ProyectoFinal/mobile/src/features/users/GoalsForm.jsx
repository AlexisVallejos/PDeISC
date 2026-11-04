import { useState } from 'react';
import { View } from 'react-native';
import { Button, FieldRow, FormError, TextField } from '../../components';
import { spacing } from '../../theme';
import { digits } from '../../utils/inputs';
import { toNumber, validateNumbers } from '../../utils/validation';

const FIELDS = [
  ['kcal', 'Calorías (kcal)'],
  ['protein', 'Proteínas (g)'],
  ['carbs', 'Carbohidratos (g)'],
  ['fat', 'Grasas (g)'],
];

/**
 * Formulario de objetivos diarios. Lo usan el perfil propio y el coach sobre su atleta.
 * Quien lo usa le pasa `key` (id del usuario) para reiniciarlo al cambiar de usuario.
 */
export function GoalsForm({ goals, onSave }) {
  const toForm = (g) => Object.fromEntries(FIELDS.map(([k]) => [k, String(g?.[k] ?? '')]));
  const [form, setForm] = useState(toForm(goals));
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const save = async () => {
    // Mismos límites que el servidor (users.schemas.js): enteros, kcal 800–10000.
    const found = validateNumbers(form, FIELDS.map(([k]) => k), {
      integer: FIELDS.map(([k]) => k),
      min: { kcal: 800 },
      max: { kcal: 10000, protein: 1000, carbs: 2000, fat: 1000 },
    });
    // Las calorías de los macros tienen que cerrar con la meta (±15 %).
    if (!Object.keys(found).length) {
      const fromMacros = 4 * toNumber(form.protein) + 4 * toNumber(form.carbs) + 9 * toNumber(form.fat);
      const kcal = toNumber(form.kcal);
      if (Math.abs(fromMacros - kcal) > kcal * 0.15) {
        found.kcal = `Los macros suman ${Math.round(fromMacros)} kcal: ajustá las calorías o los gramos (±15 %)`;
      }
    }
    setErrors(found);
    setFormError(null);
    setSaved(false);
    if (Object.keys(found).length) return;
    setSaving(true);
    try {
      await onSave(Object.fromEntries(FIELDS.map(([k]) => [k, Math.round(toNumber(form[k]))])));
      setSaved(true);
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={{ gap: spacing.md }}>
      <FormError message={formError} />
      <FieldRow>
        {FIELDS.map(([key, label]) => (
          <TextField
            key={key}
            label={label}
            value={form[key]}
            onChangeText={(v) => {
              setForm((f) => ({ ...f, [key]: digits(5)(v) }));
              setSaved(false);
            }}
            error={errors[key]}
            keyboardType="number-pad"
          />
        ))}
      </FieldRow>
      <Button title={saved ? 'Guardado ✓' : 'Guardar objetivos'} variant="secondary" loading={saving} onPress={save} />
    </View>
  );
}
