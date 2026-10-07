import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps, ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { radius, space, tapTarget, type as t, useTheme } from '../theme';
import { PressableScale } from './PressableScale';

/** Piezas chicas que comparten todas las demos, para que se vean como una sola app. */

interface BotonDemoProps {
  titulo: string;
  onPress: () => void;
  /** "lleno" para la acción principal, "suave" para las secundarias. */
  variante?: 'lleno' | 'suave';
  icono?: ComponentProps<typeof Ionicons>['name'];
  disabled?: boolean;
}

export function BotonDemo({ titulo, onPress, variante = 'lleno', icono, disabled }: BotonDemoProps) {
  const c = useTheme();
  const lleno = variante === 'lleno';
  return (
    <PressableScale
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={titulo}
      style={[styles.boton, { backgroundColor: lleno ? c.tint : c.tintSoft }]}
    >
      {icono && <Ionicons name={icono} size={18} color={lleno ? c.onTint : c.tint} />}
      <Text style={[styles.botonTexto, { color: lleno ? c.onTint : c.tint }]}>{titulo}</Text>
    </PressableScale>
  );
}

/** Fila "etiqueta · valor" para mostrar datos en vivo. */
export function Dato({ etiqueta, valor }: { etiqueta: string; valor: ReactNode }) {
  const c = useTheme();
  return (
    <View style={[styles.dato, { borderBottomColor: c.separator }]}>
      <Text style={[styles.datoEtiqueta, { color: c.secondaryLabel }]}>{etiqueta}</Text>
      <Text style={[styles.datoValor, { color: c.label }]} selectable>
        {valor}
      </Text>
    </View>
  );
}

/** Texto de apoyo debajo de una demo. */
export function Nota({ children }: { children: ReactNode }) {
  const c = useTheme();
  return <Text style={[styles.nota, { color: c.secondaryLabel }]}>{children}</Text>;
}

/** Fila horizontal de controles que se acomoda en pantallas chicas. */
export function Fila({ children }: { children: ReactNode }) {
  return <View style={styles.fila}>{children}</View>;
}

/** Aviso cuando el componente no existe en la plataforma actual. */
export function SoloEn({ plataforma }: { plataforma: 'android' | 'ios' }) {
  const c = useTheme();
  const nombre = plataforma === 'android' ? 'Android' : 'iOS';
  return (
    <View style={[styles.soloEn, { backgroundColor: c.fill }]}>
      <Ionicons name={plataforma === 'android' ? 'logo-android' : 'logo-apple'} size={28} color={c.secondaryLabel} />
      <Text style={[styles.soloEnTitulo, { color: c.label }]}>Solo en {nombre}</Text>
      <Text style={[styles.soloEnTexto, { color: c.secondaryLabel }]}>
        Abrí la app en un dispositivo {nombre} para probar la demo. El código y las props de abajo valen igual.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  boton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.sm,
    minHeight: tapTarget,
    paddingHorizontal: space.lg,
    borderRadius: radius.md,
  },
  botonTexto: { ...t.headline },
  dato: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: space.md,
    paddingVertical: space.sm + 2,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  datoEtiqueta: { ...t.subhead },
  datoValor: { ...t.subhead, fontWeight: '600', flexShrink: 1, textAlign: 'right' },
  nota: { ...t.footnote },
  fila: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  soloEn: { alignItems: 'center', gap: space.sm, padding: space.xl, borderRadius: radius.lg },
  soloEnTitulo: { ...t.headline },
  soloEnTexto: { ...t.footnote, textAlign: 'center', maxWidth: 300 },
});
