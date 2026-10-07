import { StyleSheet, Text, View } from 'react-native';
import { radius, space, type as t, useTheme } from '../theme';
import type { Componente } from '../types/componente';

/** Etiquetas chicas: "API", "Android", "iOS", "Desaconsejado". */
export function Etiquetas({ componente }: { componente: Componente }) {
  const lista: string[] = [];
  if (componente.tipo === 'api') lista.push('API');
  if (componente.plataforma) lista.push(componente.plataforma === 'android' ? 'Android' : 'iOS');
  if (componente.aviso) lista.push('Desaconsejado');
  if (!lista.length) return null;
  return (
    <View style={styles.fila}>
      {lista.map((e) => (
        <Etiqueta key={e} texto={e} />
      ))}
    </View>
  );
}

export function Etiqueta({ texto }: { texto: string }) {
  const c = useTheme();
  return (
    <View style={[styles.etiqueta, { backgroundColor: c.fill }]}>
      <Text style={[styles.texto, { color: c.secondaryLabel }]}>{texto}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  fila: { flexDirection: 'row', flexWrap: 'wrap', gap: space.xs },
  etiqueta: { paddingHorizontal: space.sm, paddingVertical: 2, borderRadius: radius.pill },
  texto: { ...t.caption, fontWeight: '600' },
});
