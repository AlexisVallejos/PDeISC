import { StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { DISEÑO_INICIAL, useApariencia, type PesoTexto } from '../context/AparienciaContext';
import { coloresControles, type Tema } from '../tema';
import { FUENTES, mono, radius, space, type Fuente, type as t } from '../theme';
import { Deslizador } from './Deslizador';
import { PressableScale } from './PressableScale';
import { Segmentado } from './Segmentado';

const PESOS: Record<PesoTexto, '400' | '700' | '800'> = { regular: '400', negrita: '700', black: '800' };
const RESORTE = { duration: 400, dampingRatio: 1 } as const;

/**
 * Editor de tipografía: familia, peso, tamaño, espaciado entre letras e interlineado.
 * El tamaño, el espaciado y el interlineado se leen en el hilo de UI: el texto de muestra los sigue en vivo.
 * La familia elegida se aplica también al “Hola, mundo” de Inicio.
 */
export function EditorTipografia({ tema }: { tema: Tema }) {
  const { diseño, valores, editarDiseño } = useApariencia();
  const { seg, desl } = coloresControles(tema);
  const familia = FUENTES[diseño.fuente].familia;
  const peso = PESOS[diseño.pesoTexto];

  const aa = useAnimatedStyle(() => {
    const tamaño = valores.tamañoTexto.get() * 2.8;
    return { fontSize: tamaño, lineHeight: tamaño * 1.05, letterSpacing: valores.tracking.get() * 2.8 };
  });
  const titulo = useAnimatedStyle(() => {
    const tamaño = valores.tamañoTexto.get();
    return { fontSize: tamaño, lineHeight: (tamaño * valores.interlineado.get()) / 100, letterSpacing: valores.tracking.get() };
  });
  const cuerpo = useAnimatedStyle(() => {
    const tamaño = Math.max(13, Math.round(valores.tamañoTexto.get() * 0.72));
    return { fontSize: tamaño, lineHeight: (tamaño * valores.interlineado.get()) / 100, letterSpacing: valores.tracking.get() * 0.6 };
  });

  const restablecer = () => {
    const d = DISEÑO_INICIAL;
    valores.tamañoTexto.set(withSpring(d.tamañoTexto, RESORTE));
    valores.tracking.set(withSpring(d.tracking, RESORTE));
    valores.interlineado.set(withSpring(d.interlineado, RESORTE));
    editarDiseño({
      fuente: d.fuente,
      pesoTexto: d.pesoTexto,
      tamañoTexto: d.tamañoTexto,
      tracking: d.tracking,
      interlineado: d.interlineado,
    });
  };

  return (
    <View style={styles.contenedor}>
      <View style={[styles.muestra, { backgroundColor: tema.fondo, borderColor: tema.separador }]}>
        <Animated.Text style={[{ fontFamily: familia, fontWeight: peso, color: tema.acento }, aa]}>Aa</Animated.Text>
        <Animated.Text style={[{ fontFamily: familia, fontWeight: peso, color: tema.texto }, titulo]} numberOfLines={2}>
          Título grande
        </Animated.Text>
        <Animated.Text style={[{ fontFamily: familia, fontWeight: '400', color: tema.texto2 }, cuerpo]}>
          Texto de lectura con el interlineado cómodo de iOS.
        </Animated.Text>
        <Text style={[styles.codigo, { color: tema.acento }]}>{`fontFamily: '${FUENTES[diseño.fuente].titulo.toLowerCase()}'`}</Text>
      </View>

      <Segmentado<Fuente>
        etiqueta="Familia tipográfica"
        valor={diseño.fuente}
        onCambiar={(fuente) => editarDiseño({ fuente })}
        colores={seg}
        opciones={(Object.keys(FUENTES) as Fuente[]).map((f) => ({ valor: f, titulo: FUENTES[f].titulo }))}
      />
      <Segmentado<PesoTexto>
        etiqueta="Peso"
        valor={diseño.pesoTexto}
        onCambiar={(pesoTexto) => editarDiseño({ pesoTexto })}
        colores={seg}
        opciones={[
          { valor: 'regular', titulo: 'Regular' },
          { valor: 'negrita', titulo: 'Negrita' },
          { valor: 'black', titulo: 'Black' },
        ]}
      />

      <View style={styles.deslizadores}>
        <Deslizador
          etiqueta="Tamaño del texto"
          valor={valores.tamañoTexto}
          inicial={diseño.tamañoTexto}
          min={14}
          max={40}
          paso={1}
          unidad=" pt"
          colores={desl}
          onSoltar={(tamañoTexto) => editarDiseño({ tamañoTexto })}
        />
        <Deslizador
          etiqueta="Espaciado entre letras"
          valor={valores.tracking}
          inicial={diseño.tracking}
          min={-2}
          max={4}
          paso={0.5}
          unidad=" pt"
          colores={desl}
          onSoltar={(tracking) => editarDiseño({ tracking })}
        />
        <Deslizador
          etiqueta="Interlineado"
          valor={valores.interlineado}
          inicial={diseño.interlineado}
          min={100}
          max={180}
          paso={5}
          unidad=" %"
          colores={desl}
          onSoltar={(interlineado) => editarDiseño({ interlineado })}
        />
      </View>

      <PressableScale onPress={restablecer} accessibilityRole="button" style={[styles.restablecer, { borderColor: tema.tarjetaBorde }]}>
        <Text style={[t.subhead, { color: tema.acento, fontWeight: '600' }]}>Restablecer tipografía</Text>
      </PressableScale>
      <Text style={[t.footnote, { color: tema.texto2 }]}>La familia también cambia el “Hola, mundo” de Inicio.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { gap: space.md },
  muestra: { gap: space.xs, padding: space.lg, borderRadius: radius.md, borderWidth: StyleSheet.hairlineWidth },
  codigo: { fontFamily: mono, fontSize: 12, lineHeight: 16, marginTop: space.xs },
  deslizadores: { gap: space.xs },
  restablecer: {
    alignSelf: 'flex-start',
    minHeight: 40,
    justifyContent: 'center',
    paddingHorizontal: space.lg,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
});
