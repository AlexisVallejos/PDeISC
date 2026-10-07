import Ionicons from '@expo/vector-icons/Ionicons';
import { useIsFocused } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { Platform, Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PressableScale } from '../components/PressableScale';
import { useEntrada } from '../components/useEntrada';
import { partirSaludo, useApariencia } from '../context/AparienciaContext';
import { estiloSaludo, useTema } from '../tema';
import { radius, space, type as t } from '../theme';
import type { InicioScreenProps } from '../types/navigation';

/** Pantalla limpia: el "Hola, mundo" (editable desde Estilos) centrado, sin nada que compita con él. */
export function InicioScreen({ navigation }: InicioScreenProps) {
  const insets = useSafeAreaInsets();
  const focused = useIsFocused();
  const tema = useTema();
  const { saludo, elegirModo, diseño } = useApariencia();
  const [inicio, ultima] = partirSaludo(saludo.texto);
  const centrado = saludo.alineacion === 'center' ? 'center' : saludo.alineacion === 'right' ? 'flex-end' : 'flex-start';

  // Entrada única al abrir la app, en cascada corta (60 ms entre piezas).
  const e0 = useEntrada(0);
  const e1 = useEntrada(60);
  const e2 = useEntrada(120);
  const e3 = useEntrada(200);

  return (
    <View style={[styles.screen, { paddingTop: insets.top, backgroundColor: tema.fondo }]}>
      {focused && <StatusBar style={tema.oscuro ? 'light' : 'dark'} />}

      {/* Atajo claro/oscuro, arriba a la derecha (el modo completo se elige en Estilos) */}
      <Pressable
        onPress={() => elegirModo(tema.oscuro ? 'claro' : 'oscuro')}
        hitSlop={6}
        accessibilityRole="button"
        accessibilityLabel={tema.oscuro ? 'Pasar a modo claro' : 'Pasar a modo oscuro'}
        style={({ pressed }) => [
          styles.modo,
          webControl,
          { top: insets.top + space.sm, backgroundColor: pressed ? tema.separador : tema.relleno },
        ]}
      >
        <Ionicons name={tema.oscuro ? 'sunny' : 'moon'} size={20} color={tema.texto} />
      </Pressable>

      <View style={[styles.center, { alignItems: centrado }]}>
        <Animated.Text style={[styles.eyebrow, { color: tema.acento, textAlign: saludo.alineacion }, e0]}>
          Mi primer proyecto · Expo
        </Animated.Text>

        <Animated.Text style={[estiloSaludo(saludo, 1, diseño.fuente), { color: tema.texto }, e1]} accessibilityRole="header">
          {inicio ? `${inicio}\n` : ''}
          <Text style={{ color: tema.acento }}>{ultima}</Text>
        </Animated.Text>

        <Animated.Text style={[styles.subtitle, { color: tema.texto2, textAlign: saludo.alineacion }, e2]}>
          Esta es la pantalla inicial de la app, hecha con React Native y Expo.
        </Animated.Text>

        <Animated.View style={[styles.acciones, { alignItems: centrado }, e3]}>
          <PressableScale
            style={[styles.button, { backgroundColor: tema.acento }]}
            onPress={() => navigation.navigate('Estilos')}
            accessibilityRole="button"
            accessibilityLabel="Ver la pestaña Estilos"
          >
            <Text style={[styles.buttonText, { color: tema.sobreAcento }]}>Ver otro estilo</Text>
          </PressableScale>
          <Text style={[styles.pista, { color: tema.texto2 }]}>
            Color <Text style={{ color: tema.acento, fontWeight: '600' }}>{tema.paleta.nombre}</Text> · el saludo se edita en Estilos
          </Text>
        </Animated.View>
      </View>
    </View>
  );
}

const webControl = Platform.OS === 'web' ? ({ userSelect: 'none', cursor: 'pointer' } as ViewStyle) : undefined;

const styles = StyleSheet.create({
  screen: { flex: 1 },
  modo: {
    position: 'absolute',
    right: space.xl,
    zIndex: 1,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: space.xxl,
    gap: space.lg,
    maxWidth: 560,
    width: '100%',
    alignSelf: 'center',
  },
  eyebrow: { ...t.eyebrow },
  subtitle: { ...t.body, maxWidth: 340 },
  acciones: { gap: space.md, marginTop: space.md },
  button: { minHeight: 50, justifyContent: 'center', paddingHorizontal: space.xxl, borderRadius: radius.pill },
  buttonText: { ...t.headline },
  pista: { ...t.footnote },
});
