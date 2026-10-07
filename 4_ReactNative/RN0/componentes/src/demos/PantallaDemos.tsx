import { useEffect, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BotonDemo, Dato, Nota } from '../components/DemoKit';
import { radius, space, type as t, useTheme } from '../theme';

/** SafeAreaView: los márgenes reales de este dispositivo, dibujados. */
export function SafeAreaViewDemo() {
  const c = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <View style={{ gap: space.md }}>
      <View style={[styles.telefono, { borderColor: c.separator }]}>
        <View style={[styles.zona, { height: Math.max(insets.top, 6), backgroundColor: c.tintSoft }]} />
        <View style={[styles.segura, { backgroundColor: c.fill }]}>
          <Text style={[t.footnote, { color: c.secondaryLabel }]}>Zona segura</Text>
        </View>
        <View style={[styles.zona, { height: Math.max(insets.bottom, 6), backgroundColor: c.tintSoft }]} />
      </View>
      <Dato etiqueta="Arriba (notch / isla)" valor={`${Math.round(insets.top)} pt`} />
      <Dato etiqueta="Abajo (barra de inicio)" valor={`${Math.round(insets.bottom)} pt`} />
      <Dato etiqueta="Costados" valor={`${Math.round(insets.left)} / ${Math.round(insets.right)} pt`} />
    </View>
  );
}

/** KeyboardAvoidingView: el campo sube con el teclado. */
export function KeyboardAvoidingViewDemo() {
  const c = useTheme();
  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={80} style={{ gap: space.md }}>
      <TextInput
        placeholder="Tocá acá y mirá cómo sube"
        placeholderTextColor={c.tertiaryLabel}
        style={[styles.input, { color: c.label, backgroundColor: c.fill }]}
        returnKeyType="done"
      />
      <Nota>En iOS se usa behavior="padding". En Android la ventana ya se ajusta sola al teclado.</Nota>
    </KeyboardAvoidingView>
  );
}

/** useWindowDimensions: valores que cambian al girar o redimensionar. */
export function UseWindowDimensionsDemo() {
  const { width, height, scale, fontScale } = useWindowDimensions();
  return (
    <View>
      <Dato etiqueta="Ancho" valor={`${Math.round(width)} pt`} />
      <Dato etiqueta="Alto" valor={`${Math.round(height)} pt`} />
      <Dato etiqueta="Orientación" valor={width > height ? 'Horizontal' : 'Vertical'} />
      <Dato etiqueta="Densidad (scale)" valor={`${scale}×`} />
      <Dato etiqueta="Tamaño de letra (fontScale)" valor={`${fontScale}×`} />
      <Nota>Girá el dispositivo: los números se actualizan solos.</Nota>
    </View>
  );
}

/** Keyboard: escuchar cuándo aparece y cerrarlo. */
export function KeyboardDemo() {
  const c = useTheme();
  const [alto, setAlto] = useState(0);

  useEffect(() => {
    const mostrar = Keyboard.addListener('keyboardDidShow', (e) => setAlto(e.endCoordinates.height));
    const ocultar = Keyboard.addListener('keyboardDidHide', () => setAlto(0));
    return () => {
      mostrar.remove();
      ocultar.remove();
    };
  }, []);

  return (
    <View style={{ gap: space.md }}>
      <TextInput
        placeholder="Abrí el teclado"
        placeholderTextColor={c.tertiaryLabel}
        style={[styles.input, { color: c.label, backgroundColor: c.fill }]}
      />
      <Dato etiqueta="Teclado" valor={alto ? `visible (${Math.round(alto)} pt)` : 'oculto'} />
      <BotonDemo variante="suave" icono="chevron-down" titulo="Keyboard.dismiss()" onPress={() => Keyboard.dismiss()} />
    </View>
  );
}

const styles = StyleSheet.create({
  telefono: { height: 200, borderWidth: 2, borderRadius: 28, overflow: 'hidden', width: 140, alignSelf: 'center' },
  zona: { width: '100%' },
  segura: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  input: { ...t.body, minHeight: 48, paddingHorizontal: space.md, borderRadius: radius.md },
});
