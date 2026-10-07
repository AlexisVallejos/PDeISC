import { useEffect, useRef, useState } from 'react';
import {
  ActionSheetIOS,
  BackHandler,
  Button,
  DrawerLayoutAndroid,
  InputAccessoryView,
  Keyboard,
  Platform,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  ToastAndroid,
  TouchableNativeFeedback,
  View,
} from 'react-native';
import { BotonDemo, Dato, Nota, SoloEn } from '../components/DemoKit';
import { radius, space, tapTarget, type as t, useTheme } from '../theme';

/** Platform: datos del sistema y un valor elegido con Platform.select. */
export function PlatformDemo() {
  const elegido = Platform.select({ ios: 'Hola, iPhone', android: 'Hola, Android', default: 'Hola, navegador' });
  return (
    <View>
      <Dato etiqueta="Platform.OS" valor={Platform.OS} />
      <Dato etiqueta="Platform.Version" valor={String(Platform.Version ?? '—')} />
      <Dato etiqueta="Platform.select(...)" valor={elegido} />
    </View>
  );
}

/** TouchableNativeFeedback: onda de Material desde el punto tocado. */
export function TouchableNativeFeedbackDemo() {
  const c = useTheme();
  const [n, setN] = useState(0);
  if (Platform.OS !== 'android') return <SoloEn plataforma="android" />;
  return (
    <View style={{ gap: space.md }}>
      <View style={styles.recorte}>
        <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple(c.tint, false)} onPress={() => setN((v) => v + 1)}>
          <View style={[styles.objetivo, { backgroundColor: c.fill }]}>
            <Text style={[t.headline, { color: c.label }]}>Tocá y mirá la onda</Text>
          </View>
        </TouchableNativeFeedback>
      </View>
      <Dato etiqueta="Toques" valor={n} />
    </View>
  );
}

/** DrawerLayoutAndroid: cajón lateral dentro del recuadro de la demo. */
export function DrawerLayoutAndroidDemo() {
  const c = useTheme();
  const cajon = useRef<DrawerLayoutAndroid>(null);
  if (Platform.OS !== 'android') return <SoloEn plataforma="android" />;
  return (
    <View style={[styles.marco, { backgroundColor: c.fill }]}>
      <DrawerLayoutAndroid
        ref={cajon}
        drawerWidth={200}
        drawerPosition="left"
        renderNavigationView={() => (
          <View style={[styles.menu, { backgroundColor: c.card }]}>
            {['Inicio', 'Perfil', 'Ajustes'].map((item) => (
              <Text key={item} style={[t.body, { color: c.label }]}>
                {item}
              </Text>
            ))}
            <Button title="Cerrar" color={c.tint} onPress={() => cajon.current?.closeDrawer()} />
          </View>
        )}
      >
        <View style={styles.centro}>
          <BotonDemo icono="menu" titulo="Abrir menú" onPress={() => cajon.current?.openDrawer()} />
          <Nota>O deslizá desde el borde izquierdo.</Nota>
        </View>
      </DrawerLayoutAndroid>
    </View>
  );
}

/** ToastAndroid: aviso breve que se va solo. */
export function ToastAndroidDemo() {
  if (Platform.OS !== 'android') return <SoloEn plataforma="android" />;
  return (
    <View style={{ gap: space.md }}>
      <BotonDemo titulo="Toast corto" onPress={() => ToastAndroid.show('Guardado', ToastAndroid.SHORT)} />
      <BotonDemo variante="suave" titulo="Toast arriba" onPress={() => ToastAndroid.showWithGravity('Arriba', ToastAndroid.SHORT, ToastAndroid.TOP)} />
    </View>
  );
}

/** BackHandler: interceptar el botón Atrás de Android. */
export function BackHandlerDemo() {
  const c = useTheme();
  const [interceptar, setInterceptar] = useState(false);
  const [veces, setVeces] = useState(0);

  useEffect(() => {
    if (Platform.OS !== 'android' || !interceptar) return;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      setVeces((v) => v + 1);
      return true; // lo manejamos nosotros: no vuelve atrás
    });
    return () => sub.remove();
  }, [interceptar]);

  if (Platform.OS !== 'android') return <SoloEn plataforma="android" />;
  return (
    <View style={{ gap: space.sm }}>
      <View style={styles.ajuste}>
        <Text style={[t.body, { color: c.label }]}>Interceptar Atrás</Text>
        <Switch value={interceptar} onValueChange={setInterceptar} trackColor={{ true: c.acentoBrillante, false: c.fill }} thumbColor="#FFFFFF" ios_backgroundColor={c.fill} />
      </View>
      <Dato etiqueta="Veces interceptado" valor={veces} />
      <Nota>Con el interruptor encendido, Atrás no sale de esta ficha.</Nota>
    </View>
  );
}

/** InputAccessoryView: barra propia encima del teclado (iOS). */
export function InputAccessoryViewDemo() {
  const c = useTheme();
  const [texto, setTexto] = useState('');
  if (Platform.OS !== 'ios') return <SoloEn plataforma="ios" />;
  const id = 'barra-demo';
  return (
    <View style={{ gap: space.md }}>
      <TextInput
        value={texto}
        onChangeText={setTexto}
        inputAccessoryViewID={id}
        placeholder="Tocá para ver la barra"
        placeholderTextColor={c.tertiaryLabel}
        style={[styles.input, { color: c.label, backgroundColor: c.fill }]}
      />
      <InputAccessoryView nativeID={id} backgroundColor={c.card}>
        <View style={[styles.barra, { borderTopColor: c.separator }]}>
          <Button title="Borrar" color={c.danger} onPress={() => setTexto('')} />
          <Button title="Listo" color={c.tint} onPress={() => Keyboard.dismiss()} />
        </View>
      </InputAccessoryView>
    </View>
  );
}

/** ActionSheetIOS: hoja de opciones nativa. */
export function ActionSheetIOSDemo() {
  const [elegida, setElegida] = useState('—');
  if (Platform.OS !== 'ios') return <SoloEn plataforma="ios" />;
  const opciones = ['Cancelar', 'Compartir', 'Duplicar', 'Borrar'];
  return (
    <View style={{ gap: space.md }}>
      <BotonDemo
        icono="ellipsis-horizontal-circle"
        titulo="Mostrar opciones"
        onPress={() =>
          ActionSheetIOS.showActionSheetWithOptions(
            { options: opciones, cancelButtonIndex: 0, destructiveButtonIndex: 3, title: 'Foto' },
            (i) => setElegida(opciones[i]!),
          )
        }
      />
      <Dato etiqueta="Opción elegida" valor={elegida} />
    </View>
  );
}

const styles = StyleSheet.create({
  recorte: { borderRadius: radius.lg, overflow: 'hidden' },
  objetivo: { minHeight: 72, alignItems: 'center', justifyContent: 'center' },
  marco: { height: 230, borderRadius: radius.lg, overflow: 'hidden' },
  menu: { flex: 1, gap: space.lg, padding: space.xl },
  centro: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: space.md },
  ajuste: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: tapTarget },
  input: { ...t.body, minHeight: 48, paddingHorizontal: space.md, borderRadius: radius.md },
  barra: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: space.md, paddingVertical: space.xs, borderTopWidth: StyleSheet.hairlineWidth },
});
