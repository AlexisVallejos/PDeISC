import { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Easing, Linking, PixelRatio, Platform, Share, StyleSheet, Text, Vibration, View, useColorScheme } from 'react-native';
import { BotonDemo, Dato, Fila, Nota } from '../components/DemoKit';
import { radius, space, type as t, useTheme } from '../theme';

/** StyleSheet: hairlineWidth comparado con 1 y 2 puntos, y absoluteFill. */
export function StyleSheetDemo() {
  const c = useTheme();
  return (
    <View style={{ gap: space.md }}>
      {[
        { etiqueta: 'hairlineWidth', alto: StyleSheet.hairlineWidth },
        { etiqueta: '1 pt', alto: 1 },
        { etiqueta: '2 pt', alto: 2 },
      ].map((l) => (
        <View key={l.etiqueta} style={{ gap: space.xs }}>
          <Text style={[t.footnote, { color: c.secondaryLabel }]}>{l.etiqueta}</Text>
          <View style={{ height: l.alto, backgroundColor: c.label }} />
        </View>
      ))}
      <View style={[styles.absoluto, { backgroundColor: c.fill }]}>
        <View style={[StyleSheet.absoluteFill, styles.capa, { backgroundColor: c.tintSoft, borderColor: c.tint }]} />
        <Text style={[t.subhead, { color: c.label }]}>StyleSheet.absoluteFill cubre todo el padre</Text>
      </View>
    </View>
  );
}

/**
 * Animated (el sistema incluido en React Native).
 * Resorte sin rebote para escalar; si el usuario pidió reducir movimiento, solo cambia la opacidad.
 */
export function AnimatedDemo() {
  const c = useTheme();
  // useRef + Animated.Value funciona en iOS, Android y web (useAnimatedValue no existe en react-native-web).
  const valor = useRef(new Animated.Value(0)).current;
  const [activo, setActivo] = useState(false);
  const [reducir, setReducir] = useState(false);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReducir);
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', setReducir);
    return () => sub.remove();
  }, []);

  const animar = () => {
    const destino = activo ? 0 : 1;
    setActivo(!activo);
    const anim = reducir
      ? Animated.timing(valor, { toValue: destino, duration: 200, easing: Easing.out(Easing.quad), useNativeDriver: Platform.OS !== 'web' })
      : Animated.spring(valor, { toValue: destino, damping: 27, stiffness: 180, mass: 1, useNativeDriver: Platform.OS !== 'web' });
    anim.start();
  };

  const escala = valor.interpolate({ inputRange: [0, 1], outputRange: [1, reducir ? 1 : 1.35] });
  const giro = valor.interpolate({ inputRange: [0, 1], outputRange: ['0deg', reducir ? '0deg' : '90deg'] });
  const opacidad = valor.interpolate({ inputRange: [0, 1], outputRange: [0.55, 1] });

  return (
    <View style={{ gap: space.md }}>
      <View style={[styles.escenario, { backgroundColor: c.fill }]}>
        <Animated.View style={[styles.cuadro, { backgroundColor: c.tint, opacity: opacidad, transform: [{ scale: escala }, { rotate: giro }] }]} />
      </View>
      <BotonDemo icono="play" titulo={activo ? 'Volver' : 'Animar con resorte'} onPress={animar} />
      <Nota>{reducir ? 'Reducir movimiento está activo: solo cambia la opacidad.' : 'Tocá de nuevo en medio de la animación: el resorte cambia de rumbo sin saltos.'}</Nota>
    </View>
  );
}

/** useColorScheme: el modo actual del sistema. */
export function UseColorSchemeDemo() {
  const c = useTheme();
  const modo = useColorScheme();
  return (
    <View style={{ gap: space.md }}>
      <View style={[styles.muestra, { backgroundColor: c.card, borderColor: c.separator }]}>
        <Text style={[t.title3, { color: c.label }]}>Sistema en modo {modo === 'dark' ? 'oscuro' : 'claro'}</Text>
        <Text style={[t.footnote, { color: c.secondaryLabel }]}>useColorScheme() → "{modo ?? 'null'}"</Text>
      </View>
      <Dato etiqueta="Modo de esta app" valor={c.scheme === 'dark' ? 'Oscuro' : 'Claro'} />
      <Nota>Si en Apariencia elegís “Sistema”, la app sigue este valor; si elegís Claro u Oscuro, lo ignora.</Nota>
    </View>
  );
}

/** Linking: abrir otras apps con una URL. */
export function LinkingDemo() {
  return (
    <Fila>
      <BotonDemo icono="globe-outline" titulo="Abrir web" onPress={() => Linking.openURL('https://reactnative.dev')} />
      <BotonDemo variante="suave" icono="mail-outline" titulo="Escribir correo" onPress={() => Linking.openURL('mailto:hola@ejemplo.com?subject=RN0')} />
    </Fila>
  );
}

/** Share: la hoja nativa para compartir. */
export function ShareDemo() {
  const [resultado, setResultado] = useState('—');
  const compartir = async () => {
    try {
      const r = await Share.share({ message: 'Estoy aprendiendo los componentes de React Native.' });
      setResultado(r.action === Share.sharedAction ? 'Compartido' : 'Cancelado');
    } catch {
      setResultado('No disponible en este navegador');
    }
  };
  return (
    <View style={{ gap: space.md }}>
      <BotonDemo icono="share-outline" titulo="Compartir" onPress={compartir} />
      <Dato etiqueta="Resultado" valor={resultado} />
    </View>
  );
}

/** Vibration: un pulso y un patrón. */
export function VibrationDemo() {
  return (
    <View style={{ gap: space.md }}>
      <Fila>
        <BotonDemo titulo="Vibrar" onPress={() => Vibration.vibrate(Platform.OS === 'android' ? 120 : undefined)} />
        <BotonDemo variante="suave" titulo="Patrón (Android)" onPress={() => Vibration.vibrate([0, 120, 80, 120])} />
      </Fila>
      <Nota>En iOS la duración es fija (unos 400 ms). Para el "clic" sutil de las interfaces conviene expo-haptics.</Nota>
    </View>
  );
}

/** PixelRatio: densidad real de esta pantalla. */
export function PixelRatioDemo() {
  return (
    <View>
      <Dato etiqueta="PixelRatio.get()" valor={`${PixelRatio.get()}×`} />
      <Dato etiqueta="getFontScale()" valor={`${PixelRatio.getFontScale()}×`} />
      <Dato etiqueta="64 pt equivalen a" valor={`${PixelRatio.getPixelSizeForLayoutSize(64)} px`} />
    </View>
  );
}

/** AccessibilityInfo: ajustes de accesibilidad del sistema. */
export function AccessibilityInfoDemo() {
  const [lector, setLector] = useState<boolean | null>(null);
  const [reducir, setReducir] = useState<boolean | null>(null);

  useEffect(() => {
    AccessibilityInfo.isScreenReaderEnabled().then(setLector);
    AccessibilityInfo.isReduceMotionEnabled().then(setReducir);
    const a = AccessibilityInfo.addEventListener('screenReaderChanged', setLector);
    const b = AccessibilityInfo.addEventListener('reduceMotionChanged', setReducir);
    return () => {
      a.remove();
      b.remove();
    };
  }, []);

  const si = (v: boolean | null) => (v === null ? '…' : v ? 'Sí' : 'No');
  return (
    <View style={{ gap: space.md }}>
      <View>
        <Dato etiqueta="Lector de pantalla activo" valor={si(lector)} />
        <Dato etiqueta="Reducir movimiento" valor={si(reducir)} />
      </View>
      <BotonDemo variante="suave" icono="volume-high-outline" titulo="Anunciar en voz alta" onPress={() => AccessibilityInfo.announceForAccessibility('Hola desde el catálogo')} />
      <Nota>El anuncio solo se escucha con VoiceOver o TalkBack encendidos.</Nota>
    </View>
  );
}

const styles = StyleSheet.create({
  absoluto: { height: 72, alignItems: 'center', justifyContent: 'center', paddingHorizontal: space.lg, borderRadius: radius.md, overflow: 'hidden' },
  capa: { borderWidth: 1, borderStyle: 'dashed', borderRadius: radius.md },
  escenario: { height: 150, alignItems: 'center', justifyContent: 'center', borderRadius: radius.lg },
  cuadro: { width: 64, height: 64, borderRadius: 18 },
  muestra: { gap: space.xs, padding: space.lg, borderRadius: radius.lg, borderWidth: StyleSheet.hairlineWidth },
});
