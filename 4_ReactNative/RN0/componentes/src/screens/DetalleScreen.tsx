import Ionicons from '@expo/vector-icons/Ionicons';
import type { ReactNode } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import Animated, { useAnimatedRef, useAnimatedScrollHandler, useReducedMotion, useSharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BotonArriba } from '../components/BotonArriba';
import { Etiquetas } from '../components/Etiqueta';
import { IconoFicha } from '../components/IconoFicha';
import { PressableScale } from '../components/PressableScale';
import { buscarComponente, categorias, vecinos } from '../data/componentes';
import { demos } from '../demos';
import { radius, space, tapTarget, type as t, useTheme } from '../theme';
import type { DetalleScreenProps } from '../types/navigation';

/** Ficha de un componente: para qué sirve, demo en vivo, props clave y código. */
export function DetalleScreen({ route, navigation }: DetalleScreenProps) {
  const c = useTheme();
  const insets = useSafeAreaInsets();
  const componente = buscarComponente(route.params.id);
  const reducir = useReducedMotion();
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollY = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler((e) => {
    scrollY.set(e.contentOffset.y);
  });

  if (!componente) {
    return (
      <View style={[styles.pantalla, styles.centro, { backgroundColor: c.background }]}>
        <Text style={[t.headline, { color: c.label }]}>No encontramos ese componente.</Text>
      </View>
    );
  }

  const Demo = demos[componente.id];
  const categoria = categorias.find((cat) => cat.id === componente.categoria);
  const { anterior, siguiente } = vecinos(componente.id);

  return (
    <View style={[styles.pantalla, { backgroundColor: c.background }]}>
      {/* Barra superior con "Atrás" (el gesto de borde de iOS también funciona) */}
      <View style={[styles.barra, { paddingTop: insets.top, backgroundColor: c.background, borderBottomColor: c.separator }]}>
        <Pressable
          onPress={() => navigation.goBack()}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Volver a Componentes"
          style={({ pressed }) => [styles.atras, webControl, pressed && { opacity: 0.5 }]}
        >
          <Ionicons name="chevron-back" size={26} color={c.tint} />
          <Text style={[t.body, { color: c.tint }]}>Componentes</Text>
        </Pressable>
      </View>

      <Animated.ScrollView
        ref={scrollRef}
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={[styles.contenido, { paddingBottom: insets.bottom + space.xxxl }]}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
      >
        {/* Encabezado */}
        <View style={styles.hero}>
          <IconoFicha nombre={componente.icono} tamaño={64} />
          <Text style={[t.eyebrow, { color: c.tint }]}>{categoria?.titulo}</Text>
          <Text style={[styles.nombre, { color: c.label }]} accessibilityRole="header">
            {componente.tipo === 'componente' ? `<${componente.nombre} />` : componente.nombre}
          </Text>
          <Etiquetas componente={componente} />
          <Text style={[t.title3, styles.resumen, { color: c.secondaryLabel }]}>{componente.resumen}</Text>
        </View>

        {componente.aviso && (
          <View style={[styles.aviso, { backgroundColor: c.tintSoft }]}>
            <Ionicons name="information-circle" size={20} color={c.tint} />
            <Text style={[t.subhead, styles.avisoTexto, { color: c.label }]}>{componente.aviso}</Text>
          </View>
        )}

        <Bloque titulo="¿Para qué sirve?">
          <Text style={[t.body, { color: c.label }]}>{componente.paraQue}</Text>
        </Bloque>

        <Bloque titulo="Demo en vivo">
          <View style={[styles.tarjeta, { backgroundColor: c.card }]}>{Demo ? <Demo key={componente.id} /> : null}</View>
        </Bloque>

        <Bloque titulo="Props y métodos clave">
          <View style={[styles.tarjeta, styles.sinRelleno, { backgroundColor: c.card }]}>
            {componente.props.map((p, i) => (
              <View
                key={p.nombre}
                style={[
                  styles.prop,
                  i < componente.props.length - 1 && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: c.separator },
                ]}
              >
                <Text style={[t.code, { color: c.tint }]}>{p.nombre}</Text>
                <Text style={[t.subhead, { color: c.secondaryLabel }]}>{p.descripcion}</Text>
              </View>
            ))}
          </View>
        </Bloque>

        <Bloque titulo="Código">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={[styles.codigo, { backgroundColor: c.codeBackground }]}>
            <Text style={[t.code, { color: c.codeText }]} selectable>
              {/* Si el ejemplo ya trae su propio import (p. ej. safe-area-context), no se agrega otro. */}
              {componente.codigo.includes('import ') ? '' : `import { ${componente.nombre} } from 'react-native';\n\n`}
              <Text style={{ color: c.codeMuted }}>{'// Ejemplo\n'}</Text>
              {componente.codigo}
            </Text>
          </ScrollView>
        </Bloque>

        {/* Anterior / siguiente: recorrer el catálogo sin volver a la lista */}
        <View style={styles.vecinos}>
          {anterior ? (
            <Vecino direccion="anterior" nombre={anterior.nombre} onPress={() => navigation.replace('Detalle', { id: anterior.id })} />
          ) : (
            <View style={styles.flex} />
          )}
          {siguiente ? (
            <Vecino direccion="siguiente" nombre={siguiente.nombre} onPress={() => navigation.replace('Detalle', { id: siguiente.id })} />
          ) : (
            <View style={styles.flex} />
          )}
        </View>
      </Animated.ScrollView>

      <BotonArriba
        scrollY={scrollY}
        abajo={insets.bottom + space.xl}
        color={c.tint}
        colorIcono={c.onTint}
        onPress={() => scrollRef.current?.scrollTo({ y: 0, animated: !reducir })}
      />
    </View>
  );
}

function Bloque({ titulo, children }: { titulo: string; children: ReactNode }) {
  const c = useTheme();
  return (
    <View style={styles.bloque}>
      <Text style={[styles.bloqueTitulo, { color: c.secondaryLabel }]}>{titulo}</Text>
      {children}
    </View>
  );
}

function Vecino({ direccion, nombre, onPress }: { direccion: 'anterior' | 'siguiente'; nombre: string; onPress: () => void }) {
  const c = useTheme();
  const siguiente = direccion === 'siguiente';
  return (
    <View style={styles.flex}>
      <PressableScale
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`${siguiente ? 'Siguiente' : 'Anterior'}: ${nombre}`}
        style={[styles.vecino, { backgroundColor: c.card, alignItems: siguiente ? 'flex-end' : 'flex-start' }]}
      >
        <Text style={[t.caption, { color: c.secondaryLabel }]}>{siguiente ? 'Siguiente' : 'Anterior'}</Text>
        <View style={[styles.vecinoFila, siguiente && { flexDirection: 'row-reverse' }]}>
          <Ionicons name={siguiente ? 'chevron-forward' : 'chevron-back'} size={16} color={c.tint} />
          <Text style={[t.headline, { color: c.tint }]} numberOfLines={1}>
            {nombre}
          </Text>
        </View>
      </PressableScale>
    </View>
  );
}

const webControl =
  Platform.OS === 'web' ? ({ userSelect: 'none', touchAction: 'manipulation', cursor: 'pointer' } as ViewStyle) : undefined;

const styles = StyleSheet.create({
  pantalla: { flex: 1 },
  centro: { alignItems: 'center', justifyContent: 'center' },
  flex: { flex: 1 },
  barra: { borderBottomWidth: StyleSheet.hairlineWidth },
  atras: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    minHeight: tapTarget,
    paddingLeft: space.sm,
    paddingRight: space.lg,
  },
  // Ancho de contenido: máximo 640 con 20 de margen (la demo de ScrollView usa estos valores).
  contenido: { gap: space.xxl, paddingHorizontal: space.xl, paddingTop: space.xl, maxWidth: 640, width: '100%', alignSelf: 'center' },
  hero: { gap: space.sm, alignItems: 'flex-start' },
  nombre: { ...t.largeTitle, marginTop: -2 },
  resumen: { fontWeight: '400' },
  aviso: { flexDirection: 'row', gap: space.sm, padding: space.md, borderRadius: radius.md, marginTop: -space.md },
  avisoTexto: { flex: 1 },
  bloque: { gap: space.sm },
  bloqueTitulo: { ...t.footnote, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.4, paddingHorizontal: space.xs },
  tarjeta: { padding: space.lg, borderRadius: radius.lg },
  sinRelleno: { paddingVertical: 0 },
  prop: { gap: 2, paddingVertical: space.md },
  codigo: { borderRadius: radius.lg, padding: space.lg },
  vecinos: { flexDirection: 'row', gap: space.md },
  vecino: { gap: 2, padding: space.md, borderRadius: radius.lg, minHeight: tapTarget + 16, justifyContent: 'center' },
  vecinoFila: { flexDirection: 'row', alignItems: 'center', gap: 2, maxWidth: '100%' },
});
