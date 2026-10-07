import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps } from 'react';
import { Modal, Platform, Pressable, ScrollView, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApariencia, type Modo } from '../context/AparienciaContext';
import { radius, space, tapTarget, type as t, useTheme } from '../theme';
import { IconoFicha } from './IconoFicha';
import { SelectorColor } from './SelectorColor';

const MODOS: { id: Modo; titulo: string; icono: ComponentProps<typeof Ionicons>['name'] }[] = [
  { id: 'sistema', titulo: 'Sistema', icono: 'phone-portrait-outline' },
  { id: 'claro', titulo: 'Claro', icono: 'sunny-outline' },
  { id: 'oscuro', titulo: 'Oscuro', icono: 'moon-outline' },
];

/**
 * Hoja "Apariencia": color de acento + modo claro/oscuro, con vista previa en vivo.
 * En iOS es la hoja nativa (pageSheet), que se cierra deslizando hacia abajo.
 */
export function HojaApariencia({ visible, onCerrar }: { visible: boolean; onCerrar: () => void }) {
  const c = useTheme();
  const insets = useSafeAreaInsets();
  const { paleta, modo, elegirPaleta, elegirModo } = useApariencia();
  const ios = Platform.OS === 'ios';

  return (
    <Modal visible={visible} animationType="slide" presentationStyle={ios ? 'pageSheet' : 'fullScreen'} onRequestClose={onCerrar}>
      <View style={[styles.hoja, { backgroundColor: c.background, paddingTop: ios ? space.sm : insets.top }]}>
        {/* Agarradera visual: indica que en iOS se puede bajar para cerrar */}
        {ios && <View style={[styles.agarradera, { backgroundColor: c.tertiaryLabel }]} />}

        <View style={styles.cabecera}>
          <Text style={[t.title3, { color: c.label }]} accessibilityRole="header">
            Apariencia
          </Text>
          <Pressable onPress={onCerrar} hitSlop={8} accessibilityRole="button" style={({ pressed }) => [styles.listo, webControl, pressed && { opacity: 0.5 }]}>
            <Text style={[t.headline, { color: c.tint }]}>Listo</Text>
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={[styles.contenido, { paddingBottom: insets.bottom + space.xxl }]}>
          {/* Vista previa: una fila del catálogo y un botón con el acento actual */}
          <View style={[styles.preview, { backgroundColor: c.card }]}>
            <View style={styles.previewFila}>
              <IconoFicha nombre="square-outline" />
              <View style={{ flex: 1 }}>
                <Text style={[t.headline, { color: c.label }]}>View</Text>
                <Text style={[t.subhead, { color: c.secondaryLabel }]}>Así se ven las fichas.</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={c.tertiaryLabel} />
            </View>
            <View style={[styles.previewBoton, { backgroundColor: c.tint }]}>
              <Text style={[t.headline, { color: c.onTint }]}>Botón principal</Text>
            </View>
          </View>

          <Text style={[styles.seccion, { color: c.secondaryLabel }]}>Color de acento</Text>
          <View style={[styles.tarjeta, { backgroundColor: c.card }]}>
            <SelectorColor valor={paleta.id} onCambiar={elegirPaleta} fondo={c.scheme === 'dark' ? 'oscuro' : 'claro'} tinta={c.label} />
          </View>

          <Text style={[styles.seccion, { color: c.secondaryLabel }]}>Modo</Text>
          {/* Control segmentado de iOS */}
          <View style={[styles.segmentado, { backgroundColor: c.fill }]} accessibilityRole="radiogroup" accessibilityLabel="Modo de color">
            {MODOS.map((m) => {
              const activo = m.id === modo;
              return (
                <Pressable
                  key={m.id}
                  onPress={() => elegirModo(m.id)}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: activo }}
                  style={[styles.segmento, webControl, activo && [styles.segmentoActivo, { backgroundColor: c.card }]]}
                >
                  <Ionicons name={m.icono} size={18} color={activo ? c.tint : c.secondaryLabel} />
                  <Text style={[t.subhead, { color: activo ? c.label : c.secondaryLabel, fontWeight: activo ? '600' : '400' }]}>{m.titulo}</Text>
                </Pressable>
              );
            })}
          </View>
          <Text style={[t.footnote, styles.nota, { color: c.tertiaryLabel }]}>
            “Sistema” sigue el modo del teléfono (useColorScheme). La elección se guarda para la próxima vez.
          </Text>
        </ScrollView>
      </View>
    </Modal>
  );
}

const webControl = Platform.OS === 'web' ? ({ userSelect: 'none', cursor: 'pointer' } as ViewStyle) : undefined;

const styles = StyleSheet.create({
  hoja: { flex: 1 },
  agarradera: { alignSelf: 'center', width: 36, height: 5, borderRadius: 3, marginBottom: space.xs, opacity: 0.6 },
  cabecera: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingLeft: space.xl, paddingRight: space.sm, minHeight: tapTarget + 8 },
  listo: { minHeight: tapTarget, justifyContent: 'center', paddingHorizontal: space.md },
  contenido: { gap: space.sm, paddingHorizontal: space.lg, paddingTop: space.sm, maxWidth: 640, width: '100%', alignSelf: 'center' },
  preview: { gap: space.lg, padding: space.lg, borderRadius: radius.lg, marginBottom: space.md },
  previewFila: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  previewBoton: { minHeight: tapTarget, alignItems: 'center', justifyContent: 'center', borderRadius: radius.md },
  seccion: { ...t.footnote, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.4, paddingHorizontal: space.lg, marginTop: space.md },
  tarjeta: { padding: space.lg, borderRadius: radius.lg },
  segmentado: { flexDirection: 'row', padding: 3, borderRadius: radius.md },
  segmento: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, minHeight: tapTarget - 4, borderRadius: radius.md - 3 },
  segmentoActivo: { shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 4, shadowOffset: { width: 0, height: 1 }, elevation: 2 },
  nota: { paddingHorizontal: space.lg },
});
