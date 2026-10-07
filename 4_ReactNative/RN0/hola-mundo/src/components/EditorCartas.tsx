import { StyleSheet, Text, View } from 'react-native';
import Animated, { withSpring } from 'react-native-reanimated';
import { DISEÑO_INICIAL, useApariencia } from '../context/AparienciaContext';
import { coloresControles, type Tema } from '../tema';
import { space, type as t } from '../theme';
import { useEstiloCarta } from './Carta';
import { Deslizador } from './Deslizador';
import { PressableScale } from './PressableScale';
import { Segmentado } from './Segmentado';

const RESORTE = { duration: 400, dampingRatio: 1 } as const;
type Preajuste = 'recta' | 'suave' | 'curva' | 'capsula' | 'otro';
const PREAJUSTES = { recta: 0, suave: 12, curva: 22, capsula: 36 } as const;

/**
 * Forma de las cartas: radio de las esquinas y grosor del borde.
 * Todas las cartas de esta pantalla cambian a la vez (son los mismos valores compartidos).
 */
export function EditorCartas({ tema }: { tema: Tema }) {
  const { diseño, valores, editarDiseño } = useApariencia();
  const { seg, desl } = coloresControles(tema);
  const muestra = useEstiloCarta();

  const actual: Preajuste =
    (Object.keys(PREAJUSTES) as (keyof typeof PREAJUSTES)[]).find((k) => PREAJUSTES[k] === diseño.radioCartas) ?? 'otro';

  const elegir = (id: Preajuste) => {
    if (id === 'otro') return;
    valores.radioCartas.set(withSpring(PREAJUSTES[id], RESORTE));
    editarDiseño({ radioCartas: PREAJUSTES[id] });
  };

  const restablecer = () => {
    valores.radioCartas.set(withSpring(DISEÑO_INICIAL.radioCartas, RESORTE));
    valores.bordeCartas.set(withSpring(DISEÑO_INICIAL.bordeCartas, RESORTE));
    editarDiseño({ radioCartas: DISEÑO_INICIAL.radioCartas, bordeCartas: DISEÑO_INICIAL.bordeCartas });
  };

  return (
    <View style={styles.contenedor}>
      <Text style={[styles.subtitulo, { color: tema.texto3 }]}>Forma de las cartas</Text>

      {/* Carta de muestra: usa la misma forma que todas las demás */}
      <Animated.View style={[styles.muestra, { backgroundColor: tema.fondo, borderColor: tema.tarjetaBorde }, muestra]}>
        <View style={[styles.linea, { backgroundColor: tema.acento, width: '38%' }]} />
        <View style={[styles.linea, { backgroundColor: tema.relleno }]} />
        <View style={[styles.linea, { backgroundColor: tema.relleno, width: '72%' }]} />
      </Animated.View>

      <Segmentado<Preajuste>
        etiqueta="Forma de las cartas"
        valor={actual}
        onCambiar={elegir}
        colores={seg}
        opciones={[
          { valor: 'recta', titulo: 'Recta' },
          { valor: 'suave', titulo: 'Suave' },
          { valor: 'curva', titulo: 'Curva' },
          { valor: 'capsula', titulo: 'Cápsula' },
        ]}
      />

      <View style={styles.deslizadores}>
        <Deslizador
          etiqueta="Radio de las esquinas"
          valor={valores.radioCartas}
          inicial={diseño.radioCartas}
          min={0}
          max={36}
          paso={2}
          unidad=" pt"
          colores={desl}
          onSoltar={(radioCartas) => editarDiseño({ radioCartas })}
        />
        <Deslizador
          etiqueta="Grosor del borde"
          valor={valores.bordeCartas}
          inicial={diseño.bordeCartas}
          min={0}
          max={4}
          paso={1}
          unidad=" pt"
          colores={desl}
          onSoltar={(bordeCartas) => editarDiseño({ bordeCartas })}
        />
      </View>

      <PressableScale onPress={restablecer} accessibilityRole="button" style={[styles.restablecer, { borderColor: tema.tarjetaBorde }]}>
        <Text style={[t.subhead, { color: tema.acento, fontWeight: '600' }]}>Restablecer cartas</Text>
      </PressableScale>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { gap: space.md },
  subtitulo: { ...t.eyebrow, marginTop: space.sm },
  muestra: { gap: space.sm, padding: space.lg },
  linea: { height: 10, borderRadius: 5 },
  deslizadores: { gap: space.xs },
  restablecer: {
    alignSelf: 'flex-start',
    minHeight: 40,
    justifyContent: 'center',
    paddingHorizontal: space.lg,
    borderRadius: 999,
    borderWidth: 1,
  },
});
