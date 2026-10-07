import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import type { Tema } from '../tema';
import { radius, space, type as t } from '../theme';
import { Deslizador } from './Deslizador';
import { PressableScale } from './PressableScale';
import { Segmentado } from './Segmentado';

type FormaId = 'cuadrado' | 'redondeado' | 'pildora' | 'circulo';
type Tono = 'base' | 'brillante' | 'pastel';

/** Cada forma de partida: proporción (ancho / alto) y redondez (% del alto). */
const FORMAS: Record<FormaId, { titulo: string; aspecto: number; redondez: number }> = {
  cuadrado: { titulo: 'Recto', aspecto: 1, redondez: 0 },
  redondeado: { titulo: 'Curvo', aspecto: 1, redondez: 24 },
  pildora: { titulo: 'Píldora', aspecto: 1.8, redondez: 50 },
  circulo: { titulo: 'Círculo', aspecto: 1, redondez: 50 },
};

const INICIAL = { tamaño: 96, giro: 0 };
const RESORTE = { duration: 400, dampingRatio: 1 } as const;

/**
 * Editor de formas: se elige una forma de partida y se ajustan tamaño, redondez y giro con deslizadores.
 * La vista previa lee los valores compartidos en el hilo de UI: se mueve con el dedo sin re-render.
 */
export function EditorFormas({ tema }: { tema: Tema }) {
  const [forma, setForma] = useState<FormaId>('redondeado');
  const [tono, setTono] = useState<Tono>('brillante');
  // "version" vuelve a montar los deslizadores al restablecer, para que sus etiquetas arranquen bien.
  const [version, setVersion] = useState(0);

  const tamaño = useSharedValue(INICIAL.tamaño);
  const redondez = useSharedValue(FORMAS.redondeado.redondez);
  const giro = useSharedValue(INICIAL.giro);
  const aspecto = useSharedValue(FORMAS.redondeado.aspecto);

  const elegirForma = (id: FormaId) => {
    setForma(id);
    aspecto.set(withSpring(FORMAS[id].aspecto, RESORTE));
    redondez.set(withSpring(FORMAS[id].redondez, RESORTE));
  };

  const restablecer = () => {
    setForma('redondeado');
    setTono('brillante');
    tamaño.set(withSpring(INICIAL.tamaño, RESORTE));
    giro.set(withSpring(INICIAL.giro, RESORTE));
    aspecto.set(withSpring(FORMAS.redondeado.aspecto, RESORTE));
    redondez.set(withSpring(FORMAS.redondeado.redondez, RESORTE));
    setVersion((v) => v + 1);
  };

  // Figura absoluta y sin hijos: animar su tamaño no mueve a nadie más.
  const figura = useAnimatedStyle(() => {
    const alto = tamaño.get();
    return {
      width: alto * aspecto.get(),
      height: alto,
      borderRadius: (redondez.get() / 100) * alto,
      transform: [{ rotate: `${giro.get()}deg` }],
    };
  });

  const colorFigura = { base: tema.paleta.claro, brillante: tema.paleta.brillante, pastel: tema.paleta.pastel }[tono];
  const coloresSeg = {
    pista: tema.relleno,
    activo: tema.oscuro ? 'rgba(255, 255, 255, 0.16)' : '#FFFFFF',
    texto: tema.texto2,
    textoActivo: tema.texto,
  };
  const coloresDesl = { pista: tema.relleno, relleno: tema.acento, texto: tema.texto, texto2: tema.texto2 };

  return (
    <View style={styles.contenedor}>
      <View style={[styles.lienzo, { backgroundColor: tema.relleno }]} accessibilityLabel={`Vista previa: ${FORMAS[forma].titulo}`}>
        <Animated.View style={[styles.figura, { backgroundColor: colorFigura }, figura]} />
      </View>

      <Segmentado
        etiqueta="Forma de partida"
        valor={forma}
        onCambiar={elegirForma}
        colores={coloresSeg}
        opciones={(Object.keys(FORMAS) as FormaId[]).map((id) => ({ valor: id, titulo: FORMAS[id].titulo }))}
      />

      <View key={version} style={styles.deslizadores}>
        <Deslizador
          etiqueta="Tamaño de la figura"
          valor={tamaño}
          inicial={INICIAL.tamaño}
          min={48}
          max={140}
          paso={4}
          unidad=" pt"
          colores={coloresDesl}
        />
        <Deslizador
          etiqueta="Redondez"
          valor={redondez}
          inicial={FORMAS.redondeado.redondez}
          min={0}
          max={50}
          paso={2}
          unidad=" %"
          colores={coloresDesl}
        />
        <Deslizador etiqueta="Giro" valor={giro} inicial={INICIAL.giro} min={0} max={90} paso={5} unidad="°" colores={coloresDesl} />
      </View>

      <Segmentado
        etiqueta="Tono"
        valor={tono}
        onCambiar={setTono}
        colores={coloresSeg}
        opciones={[
          { valor: 'base', titulo: 'Base' },
          { valor: 'brillante', titulo: 'Brillante' },
          { valor: 'pastel', titulo: 'Pastel' },
        ]}
      />

      <PressableScale onPress={restablecer} accessibilityRole="button" style={[styles.restablecer, { borderColor: tema.tarjetaBorde }]}>
        <Text style={[t.subhead, { color: tema.acento, fontWeight: '600' }]}>Restablecer</Text>
      </PressableScale>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { gap: space.md },
  lienzo: { height: 200, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  figura: { position: 'absolute' },
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
