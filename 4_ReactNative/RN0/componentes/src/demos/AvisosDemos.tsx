import { useState } from 'react';
import { ActivityIndicator, Alert, Modal, Platform, StatusBar, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BotonDemo, Dato, Fila, Nota } from '../components/DemoKit';
import { radius, space, type as t, useTheme } from '../theme';

/** ActivityIndicator: tamaños y encendido/apagado. */
export function ActivityIndicatorDemo() {
  const c = useTheme();
  const [girando, setGirando] = useState(true);
  return (
    <View style={{ gap: space.md }}>
      <View style={[styles.escenario, { backgroundColor: c.fill }]}>
        <ActivityIndicator animating={girando} size="small" color={c.tint} />
        <ActivityIndicator animating={girando} size="large" color={c.tint} />
      </View>
      <BotonDemo variante="suave" titulo={girando ? 'Detener' : 'Reanudar'} onPress={() => setGirando((v) => !v)} />
    </View>
  );
}

/** Modal: hoja que se superpone; en iOS usa la presentación nativa pageSheet. */
export function ModalDemo() {
  const c = useTheme();
  const insets = useSafeAreaInsets();
  const [abierto, setAbierto] = useState(false);
  const [estilo, setEstilo] = useState<'slide' | 'fade'>('slide');

  const abrir = (tipo: 'slide' | 'fade') => {
    setEstilo(tipo);
    setAbierto(true);
  };

  return (
    <View style={{ gap: space.md }}>
      <Fila>
        <BotonDemo titulo="Abrir (slide)" onPress={() => abrir('slide')} />
        <BotonDemo variante="suave" titulo="Abrir (fade)" onPress={() => abrir('fade')} />
      </Fila>
      <Modal
        visible={abierto}
        animationType={estilo}
        presentationStyle={estilo === 'slide' && Platform.OS === 'ios' ? 'pageSheet' : 'overFullScreen'}
        transparent={estilo === 'fade'}
        onRequestClose={() => setAbierto(false)}
      >
        <View style={[styles.modalFondo, estilo === 'fade' && { backgroundColor: c.overlay, justifyContent: 'center', padding: space.xl }]}>
          <View
            style={[
              styles.modalHoja,
              { backgroundColor: c.card, paddingBottom: insets.bottom + space.xl },
              estilo === 'fade' ? { borderRadius: radius.xl } : { flex: 1, paddingTop: Platform.OS === 'ios' ? space.xl : insets.top + space.xl },
            ]}
          >
            <Text style={[t.title1, { color: c.label }]}>Soy un Modal</Text>
            <Text style={[t.body, { color: c.secondaryLabel }]}>
              Bloqueo lo que está detrás hasta que me cierres. {Platform.OS === 'ios' && estilo === 'slide' ? 'También podés deslizarme hacia abajo.' : ''}
            </Text>
            <BotonDemo titulo="Cerrar" onPress={() => setAbierto(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

/** StatusBar: cambia la hora y la batería a claro u oscuro, o la oculta. */
export function StatusBarDemo() {
  const [claro, setClaro] = useState(false);
  const [oculta, setOculta] = useState(false);
  return (
    <View style={{ gap: space.md }}>
      <StatusBar barStyle={claro ? 'light-content' : 'dark-content'} hidden={oculta} animated />
      <Fila>
        <BotonDemo variante="suave" titulo={claro ? 'Texto oscuro' : 'Texto claro'} onPress={() => setClaro((v) => !v)} />
        <BotonDemo variante="suave" titulo={oculta ? 'Mostrar barra' : 'Ocultar barra'} onPress={() => setOculta((v) => !v)} />
      </Fila>
      <Nota>Mirá la hora y la batería arriba de todo. Al salir de esta ficha, la app vuelve a su estilo.</Nota>
    </View>
  );
}

/** Alert: diálogo del sistema. En la web se usa el diálogo del navegador. */
export function AlertDemo() {
  const [respuesta, setRespuesta] = useState('—');

  const simple = () => {
    if (Platform.OS === 'web') {
      window.alert('Hola desde Alert');
      return setRespuesta('Aceptar');
    }
    Alert.alert('Hola', 'Esto es un Alert nativo.', [{ text: 'Aceptar', onPress: () => setRespuesta('Aceptar') }]);
  };

  const confirmar = () => {
    if (Platform.OS === 'web') {
      return setRespuesta(window.confirm('¿Borrar la foto? No se puede deshacer.') ? 'Borrar' : 'Cancelar');
    }
    Alert.alert('¿Borrar la foto?', 'No se puede deshacer.', [
      { text: 'Cancelar', style: 'cancel', onPress: () => setRespuesta('Cancelar') },
      { text: 'Borrar', style: 'destructive', onPress: () => setRespuesta('Borrar') },
    ]);
  };

  return (
    <View style={{ gap: space.md }}>
      <Fila>
        <BotonDemo titulo="Aviso simple" onPress={simple} />
        <BotonDemo variante="suave" icono="trash-outline" titulo="Confirmar borrado" onPress={confirmar} />
      </Fila>
      <Dato etiqueta="Botón elegido" valor={respuesta} />
    </View>
  );
}

const styles = StyleSheet.create({
  escenario: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: space.xxl, height: 110, borderRadius: radius.lg },
  modalFondo: { flex: 1 },
  modalHoja: { gap: space.lg, padding: space.xl, width: '100%', maxWidth: 560, alignSelf: 'center' },
});
