import { StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { DISEÑO_INICIAL, useApariencia } from '../context/AparienciaContext';
import { coloresControles, type Tema } from '../tema';
import { radius, space, type as t } from '../theme';
import { sombra } from './Carta';
import { Deslizador } from './Deslizador';
import { PressableScale } from './PressableScale';

const RESORTE = { duration: 400, dampingRatio: 1 } as const;
/** Alto del escenario y posición de la capa del frente (las otras suben desde ahí). */
const ESCENARIO = 156;
const FRENTE = 70;

/**
 * Profundidad: elevación (sombra) de todas las cartas y separación entre las capas de la demo.
 * Las capas son absolutas y sin hijos propios, así que animar su posición no mueve nada más.
 */
export function EditorProfundidad({ tema }: { tema: Tema }) {
  const { diseño, valores, editarDiseño } = useApariencia();
  const { desl } = coloresControles(tema);

  const atras = useAnimatedStyle(() => {
    const s = valores.separacion.get();
    return { left: s * 2, right: s * 2, top: FRENTE - s * 2 };
  });
  const medio = useAnimatedStyle(() => {
    const s = valores.separacion.get();
    return { left: s, right: s, top: FRENTE - s };
  });
  // La capa del frente proyecta una sombra más fuerte que las cartas, para que se note la altura.
  const frente = useAnimatedStyle(() => sombra(Math.max(valores.elevacion.get(), 8), 1.3));

  const restablecer = () => {
    valores.elevacion.set(withSpring(DISEÑO_INICIAL.elevacion, RESORTE));
    valores.separacion.set(withSpring(DISEÑO_INICIAL.separacion, RESORTE));
    editarDiseño({ elevacion: DISEÑO_INICIAL.elevacion, separacion: DISEÑO_INICIAL.separacion });
  };

  return (
    <View style={styles.contenedor}>
      <View style={styles.escenario} accessibilityLabel="Tres capas apiladas">
        <Animated.View style={[styles.capa, { backgroundColor: tema.paleta.brillante, opacity: 0.2 }, atras]} />
        <Animated.View style={[styles.capa, { backgroundColor: tema.paleta.brillante, opacity: 0.38 }, medio]} />
        <Animated.View style={[styles.capa, styles.frente, { top: FRENTE, backgroundColor: tema.acento }, frente]}>
          <Text style={[t.headline, { color: tema.sobreAcento }]}>Capa al frente</Text>
        </Animated.View>
      </View>

      <View style={styles.deslizadores}>
        <Deslizador
          etiqueta="Elevación de las cartas"
          valor={valores.elevacion}
          inicial={diseño.elevacion}
          min={0}
          max={40}
          paso={2}
          colores={desl}
          onSoltar={(elevacion) => editarDiseño({ elevacion })}
        />
        <Deslizador
          etiqueta="Separación entre capas"
          valor={valores.separacion}
          inicial={diseño.separacion}
          min={4}
          max={28}
          paso={2}
          unidad=" pt"
          colores={desl}
          onSoltar={(separacion) => editarDiseño({ separacion })}
        />
      </View>

      <PressableScale onPress={restablecer} accessibilityRole="button" style={[styles.restablecer, { borderColor: tema.tarjetaBorde }]}>
        <Text style={[t.subhead, { color: tema.acento, fontWeight: '600' }]}>Restablecer profundidad</Text>
      </PressableScale>
      <Text style={[t.footnote, { color: tema.texto2 }]}>
        La elevación se ve en todas las cartas de esta pantalla. En modo claro la sombra se nota más.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { gap: space.md },
  escenario: { height: ESCENARIO },
  capa: { position: 'absolute', height: 72, borderRadius: radius.md },
  frente: { left: 0, right: 0, justifyContent: 'center', paddingHorizontal: space.lg },
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
