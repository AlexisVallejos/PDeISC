import Ionicons from '@expo/vector-icons/Ionicons';
import { useCallback, useMemo, useRef, useState } from 'react';
import { Platform, Pressable, ScrollView, SectionList, StyleSheet, Text, TextInput, View, type ViewStyle } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BotonArriba } from '../components/BotonArriba';
import { FilaComponente } from '../components/FilaComponente';
import { HojaApariencia } from '../components/HojaApariencia';
import { categorias, componentes } from '../data/componentes';
import { radius, space, tapTarget, type as t, useTheme } from '../theme';
import type { CategoriaId, Componente } from '../types/componente';
import type { CatalogoScreenProps } from '../types/navigation';

// SectionList animable: el desplazamiento se lee en el hilo de UI, sin re-render por cuadro.
const AnimatedSectionList = Animated.createAnimatedComponent(
  SectionList<Componente, { categoria: (typeof categorias)[number]; data: Componente[] }>,
);

/** Alto de la barra superior compacta (sin contar el notch). */
const BARRA = 44;

const TOTAL_COMPONENTES = componentes.filter((c) => c.tipo === 'componente').length;
const TOTAL_APIS = componentes.length - TOTAL_COMPONENTES;

/** Quita acentos y pasa a minúsculas para que "pantalla" encuentre "Pantálla". */
const normalizar = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

/** Catálogo: búsqueda + filtros por categoría + lista agrupada (un SectionList). */
export function CatalogoScreen({ navigation }: CatalogoScreenProps) {
  const c = useTheme();
  const insets = useSafeAreaInsets();
  const [busqueda, setBusqueda] = useState('');
  const [filtro, setFiltro] = useState<CategoriaId | 'todos'>('todos');
  const [apariencia, setApariencia] = useState(false);
  const reducir = useReducedMotion();
  const lista = useRef<SectionList<Componente, { categoria: (typeof categorias)[number]; data: Componente[] }>>(null);

  // Barra compacta estilo iOS: el título chico aparece cuando el título grande se va de pantalla.
  const scrollY = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler((e) => {
    scrollY.set(e.contentOffset.y);
  });
  const tituloCompacto = useAnimatedStyle(() => ({ opacity: interpolate(scrollY.get(), [44, 72], [0, 1], 'clamp') }));
  const bordeCompacto = useAnimatedStyle(() => ({ opacity: interpolate(scrollY.get(), [60, 90], [0, 1], 'clamp') }));

  const secciones = useMemo(() => {
    const q = normalizar(busqueda.trim());
    return categorias
      .filter((cat) => filtro === 'todos' || cat.id === filtro)
      .map((cat) => ({
        categoria: cat,
        data: componentes.filter(
          (comp) => comp.categoria === cat.id && (!q || normalizar(`${comp.nombre} ${comp.resumen} ${comp.paraQue}`).includes(q)),
        ),
      }))
      .filter((s) => s.data.length > 0);
  }, [busqueda, filtro]);

  const abrir = useCallback((id: string) => navigation.navigate('Detalle', { id }), [navigation]);

  const renderItem = useCallback(
    ({ item, index, section }: { item: Componente; index: number; section: { data: Componente[] } }) => (
      <FilaComponente componente={item} primera={index === 0} ultima={index === section.data.length - 1} onPress={abrir} />
    ),
    [abrir],
  );

  const encabezado = (
    <View style={styles.encabezado}>
      <Text style={[styles.eyebrow, { color: c.tint }]}>React Native 0.86 · Expo</Text>
      <Text style={[styles.titulo, { color: c.label }]} accessibilityRole="header">
        Componentes
      </Text>
      <Text style={[styles.bajada, { color: c.secondaryLabel }]}>
        {TOTAL_COMPONENTES} componentes nativos y {TOTAL_APIS} APIs, cada uno con una demo en vivo.
      </Text>

      {/* Búsqueda estilo iOS: 17 pt (no dispara zoom en Safari), botón para borrar */}
      <View style={[styles.buscador, { backgroundColor: c.fill }]}>
        <Ionicons name="search" size={18} color={c.secondaryLabel} />
        <TextInput
          value={busqueda}
          onChangeText={setBusqueda}
          placeholder="Buscar un componente"
          placeholderTextColor={c.secondaryLabel}
          autoCorrect={false}
          autoCapitalize="none"
          returnKeyType="search"
          clearButtonMode="never"
          style={[styles.buscadorInput, { color: c.label }]}
          accessibilityLabel="Buscar un componente"
        />
        {busqueda.length > 0 && (
          <Pressable onPress={() => setBusqueda('')} hitSlop={12} accessibilityRole="button" accessibilityLabel="Borrar búsqueda">
            <Ionicons name="close-circle" size={18} color={c.tertiaryLabel} />
          </Pressable>
        )}
      </View>

      {/* Filtros por categoría (pares: cambian sin animación) */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips} style={styles.chipsScroll}>
        {[{ id: 'todos' as const, titulo: 'Todos' }, ...categorias].map((cat) => {
          const activo = filtro === cat.id;
          return (
            <Pressable
              key={cat.id}
              onPress={() => setFiltro(cat.id)}
              accessibilityRole="button"
              accessibilityState={{ selected: activo }}
              style={({ pressed }) => [
                styles.chip,
                webControl,
                { backgroundColor: activo ? c.tint : pressed ? c.cardPressed : c.card, borderColor: activo ? c.tint : c.separator },
              ]}
            >
              <Text style={[styles.chipTexto, { color: activo ? c.onTint : c.label }]}>{cat.titulo}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );

  return (
    <View style={[styles.pantalla, { backgroundColor: c.background }]}>
      <AnimatedSectionList
        ref={lista}
        onScroll={onScroll}
        scrollEventThrottle={16}
        sections={secciones}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        renderSectionHeader={({ section }) => (
          <View style={styles.seccion}>
            <Text style={[styles.seccionTitulo, { color: c.secondaryLabel }]}>{section.categoria.titulo}</Text>
            <Text style={[styles.seccionTexto, { color: c.tertiaryLabel }]}>{section.categoria.descripcion}</Text>
          </View>
        )}
        stickySectionHeadersEnabled={false}
        ListHeaderComponent={encabezado}
        ListEmptyComponent={
          <View style={styles.vacio}>
            <Ionicons name="search-outline" size={36} color={c.tertiaryLabel} />
            <Text style={[t.headline, { color: c.label }]}>Sin resultados</Text>
            <Text style={[t.subhead, { color: c.secondaryLabel, textAlign: 'center' }]}>
              No hay componentes que coincidan con “{busqueda}”.
            </Text>
          </View>
        }
        ListFooterComponent={
          <Text style={[styles.pie, { color: c.tertiaryLabel }]}>Esta lista es un SectionList: un componente del propio catálogo.</Text>
        }
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={[styles.contenido, { paddingTop: insets.top + BARRA, paddingBottom: insets.bottom + space.xxxl }]}
        initialNumToRender={14}
      />

      {/* Barra superior: fondo + título compacto que aparecen al desplazar; el botón de apariencia siempre visible */}
      <View pointerEvents="box-none" style={[styles.barra, { paddingTop: insets.top, height: insets.top + BARRA }]}>
        <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: c.background }, tituloCompacto]} />
        <Animated.View pointerEvents="none" style={[styles.bordeBarra, { backgroundColor: c.separator }, bordeCompacto]} />
        <Animated.Text
          style={[styles.tituloBarra, { color: c.label }, tituloCompacto]}
          accessibilityElementsHidden
          importantForAccessibility="no"
        >
          Componentes
        </Animated.Text>
        <Pressable
          onPress={() => setApariencia(true)}
          hitSlop={6}
          accessibilityRole="button"
          accessibilityLabel="Apariencia: color y modo"
          style={({ pressed }) => [styles.botonApariencia, webControl, { backgroundColor: pressed ? c.cardPressed : c.tintSoft }]}
        >
          <Ionicons name="color-palette" size={20} color={c.tint} />
        </Pressable>
      </View>

      <BotonArriba
        scrollY={scrollY}
        abajo={insets.bottom + space.xl}
        color={c.tint}
        colorIcono={c.onTint}
        umbral={600}
        onPress={() => lista.current?.getScrollResponder()?.scrollTo({ y: 0, animated: !reducir })}
      />

      <HojaApariencia visible={apariencia} onCerrar={() => setApariencia(false)} />
    </View>
  );
}

const webControl =
  Platform.OS === 'web' ? ({ userSelect: 'none', touchAction: 'manipulation', cursor: 'pointer' } as ViewStyle) : undefined;

const styles = StyleSheet.create({
  pantalla: { flex: 1 },
  contenido: { paddingHorizontal: space.lg, maxWidth: 720, width: '100%', alignSelf: 'center' },
  encabezado: { gap: space.sm, marginBottom: space.sm },
  eyebrow: { ...t.eyebrow },
  titulo: { ...t.largeTitle },
  bajada: { ...t.subhead, marginBottom: space.sm },
  buscador: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    minHeight: tapTarget,
    paddingHorizontal: space.md,
    borderRadius: radius.md,
  },
  buscadorInput: { ...t.body, flex: 1, minHeight: tapTarget, paddingVertical: 0 },
  chipsScroll: { marginHorizontal: -space.lg },
  chips: { gap: space.sm, paddingHorizontal: space.lg, paddingVertical: space.xs },
  chip: {
    minHeight: 36,
    justifyContent: 'center',
    paddingHorizontal: space.md + 2,
    borderRadius: radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
  },
  chipTexto: { ...t.subhead, fontWeight: '600' },
  seccion: { gap: 2, paddingHorizontal: space.lg, paddingTop: space.xl, paddingBottom: space.sm },
  seccionTitulo: { ...t.footnote, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.4 },
  seccionTexto: { ...t.footnote },
  vacio: { alignItems: 'center', gap: space.sm, paddingVertical: space.xxxl, paddingHorizontal: space.xl },
  pie: { ...t.footnote, textAlign: 'center', marginTop: space.xxl },
  barra: { position: 'absolute', top: 0, left: 0, right: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  bordeBarra: { position: 'absolute', left: 0, right: 0, bottom: 0, height: StyleSheet.hairlineWidth },
  tituloBarra: { ...t.headline },
  botonApariencia: {
    position: 'absolute',
    right: space.lg,
    bottom: 2,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
