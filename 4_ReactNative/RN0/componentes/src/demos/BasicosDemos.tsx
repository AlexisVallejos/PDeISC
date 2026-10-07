import { useState } from 'react';
import { Image, ImageBackground, ScrollView, StyleSheet, Text, TextInput, View, useWindowDimensions, type ImageResizeMode } from 'react-native';
import { BotonDemo, Fila, Nota } from '../components/DemoKit';
import { radius, space, type as t, useTheme } from '../theme';

const icono = require('../../assets/icon.png');

/** View: tres cajas con flex 1·2·3; se puede cambiar la dirección del eje. */
export function ViewDemo() {
  const c = useTheme();
  const [fila, setFila] = useState(true);
  return (
    <View style={{ gap: space.md }}>
      <View style={[styles.flexBox, { flexDirection: fila ? 'row' : 'column', backgroundColor: c.fill }]}>
        {[1, 2, 3].map((n) => (
          <View key={n} style={[styles.caja, { flex: n, backgroundColor: c.tint, opacity: 0.45 + n * 0.18 }]}>
            <Text style={[styles.cajaTexto, { color: c.onTint }]}>flex: {n}</Text>
          </View>
        ))}
      </View>
      <BotonDemo
        variante="suave"
        icono="swap-horizontal"
        titulo={fila ? 'Cambiar a column' : 'Cambiar a row'}
        onPress={() => setFila((v) => !v)}
      />
    </View>
  );
}

/** Text: texto anidado con estilos y corte en N líneas. */
export function TextDemo() {
  const c = useTheme();
  const [abierto, setAbierto] = useState(false);
  return (
    <View style={{ gap: space.md }}>
      <Text style={[t.title3, { color: c.label }]}>
        Hola, <Text style={{ color: c.tint, fontWeight: '800' }}>mundo</Text>
        <Text style={{ fontStyle: 'italic' }}> anidado</Text>.
      </Text>
      <Text style={[t.body, { color: c.secondaryLabel }]} numberOfLines={abierto ? undefined : 2}>
        React Native dibuja cada texto con el motor tipográfico del sistema. Por eso se ve nítido, respeta el tamaño de letra
        elegido por el usuario y se puede leer con VoiceOver o TalkBack sin hacer nada extra.
      </Text>
      <BotonDemo variante="suave" titulo={abierto ? 'Ver menos (numberOfLines={2})' : 'Ver más'} onPress={() => setAbierto((v) => !v)} />
    </View>
  );
}

const MODOS: ImageResizeMode[] = ['cover', 'contain', 'center'];

/** Image: la misma imagen con distintos resizeMode. */
export function ImageDemo() {
  const c = useTheme();
  const [modo, setModo] = useState<ImageResizeMode>('cover');
  return (
    <View style={{ gap: space.md }}>
      <View style={[styles.marcoImagen, { backgroundColor: c.fill }]}>
        <Image source={icono} resizeMode={modo} style={styles.imagen} alt="Ícono de Expo" />
      </View>
      <Fila>
        {MODOS.map((m) => (
          <BotonDemo key={m} titulo={m} variante={m === modo ? 'lleno' : 'suave'} onPress={() => setModo(m)} />
        ))}
      </Fila>
    </View>
  );
}

/** ImageBackground: texto encima de una imagen. */
export function ImageBackgroundDemo() {
  return (
    <ImageBackground source={icono} resizeMode="cover" style={styles.portada} imageStyle={{ borderRadius: radius.lg }}>
      <View style={styles.portadaVelo}>
        <Text style={[t.eyebrow, { color: '#FFFFFF' }]}>Portada</Text>
        <Text style={[t.title1, { color: '#FFFFFF' }]}>Texto sobre la imagen</Text>
      </View>
    </ImageBackground>
  );
}

/** TextInput: campo controlado con eco en vivo. */
export function TextInputDemo() {
  const c = useTheme();
  const [nombre, setNombre] = useState('');
  return (
    <View style={{ gap: space.md }}>
      <TextInput
        value={nombre}
        onChangeText={setNombre}
        placeholder="Escribí tu nombre"
        placeholderTextColor={c.tertiaryLabel}
        autoCapitalize="words"
        autoCorrect={false}
        returnKeyType="done"
        maxLength={30}
        style={[styles.input, { color: c.label, backgroundColor: c.fill }]}
        accessibilityLabel="Tu nombre"
      />
      <Text style={[t.title3, { color: c.label }]}>Hola, {nombre.trim() || '…'}</Text>
      <Nota>{nombre.length}/30 caracteres · value + onChangeText mantienen el estado en React.</Nota>
    </View>
  );
}

const PAGINAS = ['Página 1', 'Página 2', 'Página 3'];

/** ScrollView horizontal con páginas e indicador. */
export function ScrollViewDemo() {
  const c = useTheme();
  const { width } = useWindowDimensions();
  // Ancho del recuadro de la demo: pantalla menos los márgenes de la ficha (máximo 640).
  const ancho = Math.min(width, 640) - space.xl * 2 - space.lg * 2;
  const [pagina, setPagina] = useState(0);
  return (
    <View style={{ gap: space.md }}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => setPagina(Math.round(e.nativeEvent.contentOffset.x / ancho))}
        style={{ width: ancho, borderRadius: radius.lg }}
      >
        {PAGINAS.map((p, i) => (
          <View key={p} style={[styles.pagina, { width: ancho, backgroundColor: c.tint, opacity: 1 - i * 0.22 }]}>
            <Text style={[t.title1, { color: c.onTint }]}>{p}</Text>
            <Text style={[t.subhead, { color: c.onTint }]}>Deslizá hacia el costado</Text>
          </View>
        ))}
      </ScrollView>
      <View style={styles.puntos} accessibilityLabel={`Página ${pagina + 1} de ${PAGINAS.length}`}>
        {PAGINAS.map((p, i) => (
          <View key={p} style={[styles.punto, { backgroundColor: i === pagina ? c.tint : c.separator }]} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flexBox: { height: 150, gap: space.sm, padding: space.sm, borderRadius: radius.lg },
  caja: { justifyContent: 'center', alignItems: 'center', borderRadius: radius.sm },
  cajaTexto: { ...t.footnote, fontWeight: '700' },
  marcoImagen: { height: 160, borderRadius: radius.lg, overflow: 'hidden' },
  imagen: { width: '100%', height: '100%' },
  portada: { height: 180, justifyContent: 'flex-end' },
  portadaVelo: { gap: space.xs, padding: space.lg, borderBottomLeftRadius: radius.lg, borderBottomRightRadius: radius.lg, backgroundColor: 'rgba(0, 0, 0, 0.45)' },
  input: { ...t.body, minHeight: 48, paddingHorizontal: space.md, borderRadius: radius.md },
  pagina: { height: 150, justifyContent: 'center', alignItems: 'center', gap: space.xs },
  puntos: { flexDirection: 'row', justifyContent: 'center', gap: space.sm },
  punto: { width: 8, height: 8, borderRadius: 4 },
});
