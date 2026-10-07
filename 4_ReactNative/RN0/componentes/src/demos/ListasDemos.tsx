import { memo, useCallback, useState } from 'react';
import { FlatList, RefreshControl, ScrollView, SectionList, StyleSheet, Text, View, VirtualizedList } from 'react-native';
import { Nota } from '../components/DemoKit';
import { radius, space, type as t, useTheme } from '../theme';

const FRUTAS = ['Manzana', 'Banana', 'Cereza', 'Durazno', 'Frutilla', 'Kiwi', 'Limón', 'Mango', 'Naranja', 'Pera', 'Sandía', 'Uva'];
const DATOS = Array.from({ length: 60 }, (_, i) => ({ id: String(i), nombre: `${FRUTAS[i % FRUTAS.length]} #${i + 1}` }));

/** Fila memorizada: FlatList no la vuelve a dibujar si no cambió. */
const FilaLista = memo(function FilaLista({ texto, color }: { texto: string; color: string }) {
  return <Text style={[styles.fila, { color }]}>{texto}</Text>;
});

/** FlatList: 60 ítems dentro de un recuadro que se desplaza solo. */
export function FlatListDemo() {
  const c = useTheme();
  const renderItem = useCallback(({ item }: { item: (typeof DATOS)[number] }) => <FilaLista texto={item.nombre} color={c.label} />, [c.label]);
  return (
    <View style={{ gap: space.md }}>
      <FlatList
        data={DATOS}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={[styles.separador, { backgroundColor: c.separator }]} />}
        nestedScrollEnabled
        initialNumToRender={8}
        style={[styles.marco, { backgroundColor: c.fill }]}
      />
      <Nota>60 ítems, pero solo se dibujan los visibles.</Nota>
    </View>
  );
}

const SECCIONES = [
  { title: 'Frutas', data: ['Manzana', 'Pera', 'Uva'] },
  { title: 'Verduras', data: ['Lechuga', 'Tomate', 'Zanahoria'] },
  { title: 'Legumbres', data: ['Lenteja', 'Garbanzo'] },
];

/** SectionList: lista agrupada con títulos. */
export function SectionListDemo() {
  const c = useTheme();
  return (
    <SectionList
      sections={SECCIONES}
      keyExtractor={(item) => item}
      nestedScrollEnabled
      stickySectionHeadersEnabled
      style={[styles.marco, { backgroundColor: c.fill }]}
      renderItem={({ item }) => <Text style={[styles.fila, { color: c.label }]}>{item}</Text>}
      renderSectionHeader={({ section }) => (
        <Text style={[styles.titulo, { color: c.tint, backgroundColor: c.card }]}>{section.title}</Text>
      )}
    />
  );
}

/** VirtualizedList: mil filas sin arreglo; solo funciones para contar y leer. */
export function VirtualizedListDemo() {
  const c = useTheme();
  return (
    <View style={{ gap: space.md }}>
      <VirtualizedList<{ id: string; titulo: string }>
        getItemCount={() => 1000}
        getItem={(_data, i) => ({ id: String(i), titulo: `Fila ${i + 1} de 1000` })}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <FilaLista texto={item.titulo} color={c.label} />}
        initialNumToRender={8}
        nestedScrollEnabled
        style={[styles.marco, { backgroundColor: c.fill }]}
      />
      <Nota>No hay ningún arreglo de 1000 elementos: cada fila se calcula cuando hace falta.</Nota>
    </View>
  );
}

/** RefreshControl: tirar hacia abajo para recargar. */
export function RefreshControlDemo() {
  const c = useTheme();
  const [cargando, setCargando] = useState(false);
  const [hora, setHora] = useState(() => new Date());

  const recargar = useCallback(() => {
    setCargando(true);
    setTimeout(() => {
      setHora(new Date());
      setCargando(false);
    }, 1200);
  }, []);

  return (
    <ScrollView
      nestedScrollEnabled
      style={[styles.marco, { backgroundColor: c.fill }]}
      contentContainerStyle={styles.refresco}
      refreshControl={<RefreshControl refreshing={cargando} onRefresh={recargar} tintColor={c.tint} colors={[c.tint]} />}
    >
      <Text style={[t.headline, { color: c.label }]}>Tirá hacia abajo</Text>
      <Text style={[t.subhead, { color: c.secondaryLabel }]}>
        Actualizado a las {hora.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  marco: { height: 220, borderRadius: radius.lg },
  fila: { ...t.body, paddingHorizontal: space.lg, paddingVertical: space.md },
  separador: { height: StyleSheet.hairlineWidth, marginLeft: space.lg },
  titulo: { ...t.eyebrow, paddingHorizontal: space.lg, paddingVertical: space.sm },
  refresco: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', gap: space.xs, minHeight: 240 },
});
