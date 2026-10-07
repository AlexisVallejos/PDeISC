import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useIsFocused } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import type { ReactNode } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  ReduceMotion,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useReducedMotion,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BotonArriba } from '../components/BotonArriba';
import { Carta } from '../components/Carta';
import { EditorCartas } from '../components/EditorCartas';
import { EditorFormas } from '../components/EditorFormas';
import { EditorProfundidad } from '../components/EditorProfundidad';
import { EditorTipografia } from '../components/EditorTipografia';
import { Segmentado } from '../components/Segmentado';
import { SelectorColor } from '../components/SelectorColor';
import { partirSaludo, useApariencia, type AlineacionSaludo, type PesoSaludo, type TamañoSaludo } from '../context/AparienciaContext';
import { conAlfa } from '../paletas';
import { estiloSaludo, useTema } from '../tema';
import { mono, radius, space, type as t } from '../theme';

/**
 * Segunda pestaña: estilo opuesto a Inicio (degradado, vidrio, tipografía grande) y todo lo editable:
 * color, modo claro/oscuro, el "Hola, mundo" y las formas.
 */
export function EstilosScreen() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const focused = useIsFocused();
  const reducir = useReducedMotion();
  const tema = useTema();
  const { paleta, elegirPaleta, modo, elegirModo, saludo, editarSaludo, diseño } = useApariencia();

  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollY = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler((e) => {
    scrollY.set(e.contentOffset.y);
  });

  const [inicio, ultima] = partirSaludo(saludo.texto);
  const coloresSeg = {
    pista: tema.relleno,
    activo: tema.oscuro ? 'rgba(255, 255, 255, 0.16)' : '#FFFFFF',
    texto: tema.texto2,
    textoActivo: tema.texto,
  };

  const tonos = [
    { nombre: 'Noche', hex: paleta.noche },
    { nombre: 'Profundo', hex: paleta.profundo },
    { nombre: 'Base', hex: paleta.claro },
    { nombre: 'Brillante', hex: paleta.brillante },
    { nombre: 'Pastel', hex: paleta.pastel },
  ];

  return (
    <View style={[styles.screen, { backgroundColor: tema.degradado[1] }]}>
      {focused && <StatusBar style={tema.oscuro ? 'light' : 'dark'} />}

      {/* Fondo: al cambiar de color o de modo, el degradado nuevo se funde sobre el anterior */}
      <Animated.View
        key={`${paleta.id}-${tema.oscuro}`}
        entering={FadeIn.duration(360).reduceMotion(ReduceMotion.Never)}
        exiting={FadeOut.duration(360).reduceMotion(ReduceMotion.Never)}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      >
        <LinearGradient colors={tema.degradado} end={{ x: 0.5, y: 0.7 }} style={StyleSheet.absoluteFill} />
        <LinearGradient
          colors={[tema.brillo, conAlfa(paleta.brillante, 0)]}
          start={{ x: 1, y: 0 }}
          end={{ x: 0.25, y: 0.55 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

      <Animated.ScrollView
        ref={scrollRef}
        onScroll={onScroll}
        scrollEventThrottle={16}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={[styles.content, { paddingTop: insets.top + space.xxl, paddingBottom: tabBarHeight + space.xxxl + 40 }]}
        contentInsetAdjustmentBehavior="never"
      >
        <Text style={[styles.eyebrow, { color: tema.acento }]}>Pestaña 2</Text>
        <Text style={[styles.title, { color: tema.texto }]} accessibilityRole="header">
          Estilos
        </Text>
        <Text style={[styles.lead, { color: tema.texto2 }]}>Misma app, otra personalidad. Todo lo de esta pestaña se puede cambiar.</Text>

        <Carta titulo="Elegí un color" tema={tema}>
          <SelectorColor valor={paleta.id} onCambiar={elegirPaleta} fondo={tema.oscuro ? 'oscuro' : 'claro'} tinta={tema.texto} />
          <Text style={[styles.caption, { color: tema.texto2 }]}>
            Cambia toda la app: el saludo, los botones, este fondo y la barra de pestañas.
          </Text>
        </Carta>

        <Carta titulo="Modo" tema={tema}>
          <Segmentado
            etiqueta="Modo de color"
            valor={modo}
            onCambiar={elegirModo}
            colores={coloresSeg}
            opciones={[
              { valor: 'sistema', titulo: 'Sistema', icono: 'phone-portrait-outline' },
              { valor: 'claro', titulo: 'Claro', icono: 'sunny-outline' },
              { valor: 'oscuro', titulo: 'Oscuro', icono: 'moon-outline' },
            ]}
          />
          <Text style={[styles.caption, { color: tema.texto2 }]}>“Sistema” sigue al modo del teléfono.</Text>
        </Carta>

        <Carta titulo="Tu “Hola, mundo”" tema={tema}>
          {/* Vista previa: el mismo saludo que se ve en Inicio */}
          <View style={[styles.preview, { backgroundColor: tema.fondo, borderColor: tema.separador }]}>
            <Text style={[estiloSaludo(saludo, 0.72, diseño.fuente), { color: tema.texto }]} accessibilityRole="header">
              {inicio ? `${inicio}\n` : ''}
              <Text style={{ color: tema.acento }}>{ultima}</Text>
            </Text>
          </View>
          <TextInput
            value={saludo.texto}
            onChangeText={(texto) => editarSaludo({ texto })}
            placeholder="Hola, mundo."
            placeholderTextColor={tema.texto3}
            maxLength={40}
            autoCorrect={false}
            returnKeyType="done"
            style={[styles.input, { color: tema.texto, backgroundColor: tema.relleno }]}
            accessibilityLabel="Texto del saludo"
          />
          <Segmentado<TamañoSaludo>
            etiqueta="Tamaño del saludo"
            valor={saludo.tamaño}
            onCambiar={(tamaño) => editarSaludo({ tamaño })}
            colores={coloresSeg}
            opciones={[
              { valor: 'chico', titulo: 'Chico' },
              { valor: 'mediano', titulo: 'Mediano' },
              { valor: 'grande', titulo: 'Grande' },
            ]}
          />
          <Segmentado<PesoSaludo>
            etiqueta="Peso del saludo"
            valor={saludo.peso}
            onCambiar={(peso) => editarSaludo({ peso })}
            colores={coloresSeg}
            opciones={[
              { valor: 'regular', titulo: 'Regular' },
              { valor: 'negrita', titulo: 'Negrita' },
              { valor: 'black', titulo: 'Black' },
            ]}
          />
          <Segmentado<AlineacionSaludo>
            etiqueta="Alineación del saludo"
            valor={saludo.alineacion}
            onCambiar={(alineacion) => editarSaludo({ alineacion })}
            colores={coloresSeg}
            opciones={[
              { valor: 'left', titulo: 'Izquierda' },
              { valor: 'center', titulo: 'Centro' },
              { valor: 'right', titulo: 'Derecha' },
            ]}
          />
          <Text style={[styles.caption, { color: tema.texto2 }]}>
            La última palabra va en el color de acento. Los cambios se ven también en Inicio.
          </Text>
        </Carta>

        <Carta titulo="Formas" tema={tema}>
          <EditorFormas tema={tema} />
          <EditorCartas tema={tema} />
        </Carta>

        <Carta titulo={`Paleta · ${paleta.nombre}`} tema={tema}>
          <View style={styles.swatches}>
            {tonos.map((v) => (
              <View key={v.nombre} style={styles.swatch}>
                <View style={[styles.swatchColor, { backgroundColor: v.hex, borderColor: tema.tarjetaBorde }]} />
                <Text style={[styles.swatchName, { color: tema.texto }]} numberOfLines={1}>
                  {v.nombre}
                </Text>
                <Text style={[styles.swatchHex, { color: tema.texto3 }]}>{v.hex}</Text>
              </View>
            ))}
          </View>
        </Carta>

        <Carta titulo="Tipografía" tema={tema}>
          <EditorTipografia tema={tema} />
        </Carta>

        <Carta titulo="Profundidad" tema={tema}>
          <EditorProfundidad tema={tema} />
        </Carta>
      </Animated.ScrollView>

      <BotonArriba
        scrollY={scrollY}
        abajo={tabBarHeight + space.sm}
        color={tema.acento}
        colorIcono={tema.sobreAcento}
        onPress={() => scrollRef.current?.scrollTo({ y: 0, animated: !reducir })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingHorizontal: space.xl, gap: space.lg, maxWidth: 640, width: '100%', alignSelf: 'center' },
  eyebrow: { ...t.eyebrow },
  title: { ...t.display, marginTop: -space.sm },
  lead: { ...t.body, marginBottom: space.sm },

  caption: { ...t.footnote },

  preview: { padding: space.lg, borderRadius: radius.md, borderWidth: StyleSheet.hairlineWidth },
  input: { ...t.body, minHeight: 46, paddingHorizontal: space.md, borderRadius: radius.md },

  swatches: { flexDirection: 'row', gap: space.sm },
  swatch: { flex: 1, gap: space.xs },
  swatchColor: { aspectRatio: 1, borderRadius: radius.sm, borderWidth: StyleSheet.hairlineWidth },
  swatchName: { ...t.footnote, fontWeight: '600' },
  swatchHex: { fontFamily: mono, fontSize: 10, lineHeight: 14 },
});
