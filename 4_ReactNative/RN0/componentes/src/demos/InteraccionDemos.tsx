import { useState } from 'react';
import { Button, Keyboard, Pressable, StyleSheet, Switch, Text, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { Dato, Nota } from '../components/DemoKit';
import { radius, space, tapTarget, type as t, useTheme } from '../theme';

/** Pressable: estilo según el estado, toque normal y toque largo. */
export function PressableDemo() {
  const c = useTheme();
  const [toques, setToques] = useState(0);
  const [largos, setLargos] = useState(0);
  return (
    <View style={{ gap: space.md }}>
      <Pressable
        onPress={() => setToques((n) => n + 1)}
        onLongPress={() => setLargos((n) => n + 1)}
        accessibilityRole="button"
        style={({ pressed }) => [
          styles.objetivo,
          { backgroundColor: pressed ? c.tint : c.tintSoft, transform: [{ scale: pressed ? 0.97 : 1 }] },
        ]}
      >
        {({ pressed }) => <Text style={[t.headline, { color: pressed ? c.onTint : c.tint }]}>{pressed ? 'Presionado' : 'Tocame o mantené'}</Text>}
      </Pressable>
      <Dato etiqueta="onPress" valor={toques} />
      <Dato etiqueta="onLongPress" valor={largos} />
    </View>
  );
}

/** Button: el botón del sistema, sin estilos propios. */
export function ButtonDemo() {
  const c = useTheme();
  const [veces, setVeces] = useState(0);
  return (
    <View style={{ gap: space.md }}>
      <Button title="Tocá el botón nativo" color={c.tint} onPress={() => setVeces((n) => n + 1)} />
      <Button title="Deshabilitado" disabled onPress={() => {}} />
      <Dato etiqueta="Toques" valor={veces} />
      <Nota>En iOS el color pinta el texto; en Android, el fondo.</Nota>
    </View>
  );
}

/** Switch: valor controlado. */
export function SwitchDemo() {
  const c = useTheme();
  const [wifi, setWifi] = useState(true);
  const [avion, setAvion] = useState(false);
  return (
    <View>
      <View style={[styles.ajuste, { borderBottomColor: c.separator }]}>
        <Text style={[t.body, { color: c.label }]}>Wi-Fi</Text>
        <Switch value={wifi} onValueChange={setWifi} trackColor={{ true: c.acentoBrillante, false: c.fill }} thumbColor="#FFFFFF" ios_backgroundColor={c.fill} accessibilityLabel="Wi-Fi" />
      </View>
      <View style={styles.ajuste}>
        <Text style={[t.body, { color: c.label }]}>Modo avión</Text>
        <Switch value={avion} onValueChange={setAvion} trackColor={{ true: c.acentoBrillante, false: c.fill }} thumbColor="#FFFFFF" ios_backgroundColor={c.fill} accessibilityLabel="Modo avión" />
      </View>
      <Nota>Wi-Fi {wifi ? 'encendido' : 'apagado'} · modo avión {avion ? 'encendido' : 'apagado'}</Nota>
    </View>
  );
}

/** Los tres Touchable, lado a lado, para comparar su feedback. */
function useContador() {
  const [n, setN] = useState(0);
  return [n, () => setN((v) => v + 1)] as const;
}

export function TouchableOpacityDemo() {
  const c = useTheme();
  const [n, sumar] = useContador();
  return (
    <View style={{ gap: space.md }}>
      <TouchableOpacity activeOpacity={0.4} onPress={sumar} style={[styles.objetivo, { backgroundColor: c.tint }]} accessibilityRole="button">
        <Text style={[t.headline, { color: c.onTint }]}>Bajo la opacidad al tocar</Text>
      </TouchableOpacity>
      <Dato etiqueta="Toques" valor={n} />
    </View>
  );
}

export function TouchableHighlightDemo() {
  const c = useTheme();
  const [n, sumar] = useContador();
  return (
    <View style={{ gap: space.md }}>
      <TouchableHighlight underlayColor={c.cardPressed} onPress={sumar} style={[styles.objetivo, { backgroundColor: c.fill }]} accessibilityRole="button">
        <Text style={[t.headline, { color: c.label }]}>Oscurezco el fondo</Text>
      </TouchableHighlight>
      <Dato etiqueta="Toques" valor={n} />
    </View>
  );
}

export function TouchableWithoutFeedbackDemo() {
  const c = useTheme();
  const [n, sumar] = useContador();
  return (
    <View style={{ gap: space.md }}>
      <TouchableWithoutFeedback
        onPress={() => {
          sumar();
          Keyboard.dismiss();
        }}
        accessibilityRole="button"
      >
        <View style={[styles.objetivo, { borderWidth: 1, borderStyle: 'dashed', borderColor: c.separator }]}>
          <Text style={[t.headline, { color: c.secondaryLabel }]}>Zona invisible: no cambio al tocar</Text>
        </View>
      </TouchableWithoutFeedback>
      <Dato etiqueta="Toques detectados" valor={n} />
      <Nota>Por eso no conviene para botones: el usuario no sabe si tocó.</Nota>
    </View>
  );
}

const styles = StyleSheet.create({
  objetivo: { minHeight: 72, alignItems: 'center', justifyContent: 'center', paddingHorizontal: space.lg, borderRadius: radius.lg },
  ajuste: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: tapTarget + 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
