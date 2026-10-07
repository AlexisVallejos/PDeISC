import type { Categoria, Componente } from '../types/componente';

/**
 * Catálogo: los 24 componentes de núcleo de React Native 0.86 (todo lo que se importa
 * de 'react-native' y se dibuja como <Etiqueta />) más las APIs que se usan a diario.
 * Quedan afuera los que el núcleo ya extrajo a paquetes aparte (ProgressBarAndroid, Clipboard).
 */

export const categorias: Categoria[] = [
  { id: 'basicos', titulo: 'Básicos', descripcion: 'Las piezas con las que se arma cualquier pantalla.' },
  { id: 'interaccion', titulo: 'Interacción', descripcion: 'Todo lo que responde a un toque.' },
  { id: 'listas', titulo: 'Listas', descripcion: 'Contenido largo que se desplaza sin trabar la app.' },
  { id: 'avisos', titulo: 'Avisos y superposición', descripcion: 'Carga, ventanas y mensajes al usuario.' },
  { id: 'pantalla', titulo: 'Pantalla y teclado', descripcion: 'Notch, teclado y tamaño de la pantalla.' },
  { id: 'plataforma', titulo: 'Según la plataforma', descripcion: 'Comportamientos distintos en iOS y Android.' },
  { id: 'apis', titulo: 'APIs útiles', descripcion: 'Módulos y hooks que no se dibujan, pero se usan todo el tiempo.' },
];

export const componentes: Componente[] = [
  // ───────── Básicos ─────────
  {
    id: 'view',
    nombre: 'View',
    categoria: 'basicos',
    tipo: 'componente',
    icono: 'square-outline',
    resumen: 'El contenedor base de toda la interfaz.',
    paraQue:
      'Agrupa otros elementos y les da diseño con Flexbox: dirección, alineación, márgenes, fondo y bordes. Es el equivalente a un <div>: cada pantalla es un árbol de Views.',
    props: [
      { nombre: 'style', descripcion: 'Flexbox, tamaño, color de fondo, bordes y sombras.' },
      { nombre: 'pointerEvents', descripcion: 'Decide si la vista (o sus hijos) reciben toques.' },
      { nombre: 'accessible / accessibilityLabel', descripcion: 'Cómo la describe un lector de pantalla.' },
      { nombre: 'onLayout', descripcion: 'Avisa el tamaño y la posición final al dibujarse.' },
    ],
    codigo: `<View style={{ flexDirection: 'row', gap: 8 }}>
  <View style={{ flex: 1, height: 40, backgroundColor: 'green' }} />
  <View style={{ flex: 2, height: 40, backgroundColor: 'lime' }} />
</View>`,
  },
  {
    id: 'text',
    nombre: 'Text',
    categoria: 'basicos',
    tipo: 'componente',
    icono: 'text-outline',
    resumen: 'Muestra texto, con estilos y anidado.',
    paraQue:
      'Todo texto visible tiene que estar dentro de un <Text>. Se puede anidar para cambiar el estilo de una palabra, cortar en N líneas y hacerlo seleccionable o tocable.',
    props: [
      { nombre: 'numberOfLines', descripcion: 'Corta el texto con "…" después de N líneas.' },
      { nombre: 'selectable', descripcion: 'Permite seleccionar y copiar el texto.' },
      { nombre: 'onPress', descripcion: 'Convierte el texto en un enlace tocable.' },
      { nombre: 'allowFontScaling', descripcion: 'Respeta el tamaño de letra del sistema (activado por defecto).' },
    ],
    codigo: `<Text style={{ fontSize: 17 }} numberOfLines={2}>
  Hola, <Text style={{ fontWeight: '700', color: 'green' }}>mundo</Text>.
</Text>`,
  },
  {
    id: 'image',
    nombre: 'Image',
    categoria: 'basicos',
    tipo: 'componente',
    icono: 'image-outline',
    resumen: 'Muestra imágenes locales o de internet.',
    paraQue:
      'Carga fotos, íconos o ilustraciones desde el proyecto (require) o una URL. Las imágenes remotas necesitan un tamaño explícito, y resizeMode decide cómo se ajustan al recuadro.',
    props: [
      { nombre: 'source', descripcion: 'require("./foto.png") o { uri: "https://…" }.' },
      { nombre: 'resizeMode', descripcion: 'cover, contain, stretch, center o repeat.' },
      { nombre: 'onLoad / onError', descripcion: 'Saber cuándo cargó o si falló.' },
      { nombre: 'alt', descripcion: 'Texto alternativo para lectores de pantalla.' },
    ],
    codigo: `<Image
  source={{ uri: 'https://reactnative.dev/img/tiny_logo.png' }}
  style={{ width: 64, height: 64, borderRadius: 12 }}
  alt="Logo de React"
/>`,
  },
  {
    id: 'image-background',
    nombre: 'ImageBackground',
    categoria: 'basicos',
    tipo: 'componente',
    icono: 'images-outline',
    resumen: 'Una imagen que funciona como fondo de otros elementos.',
    paraQue:
      'Igual que Image, pero acepta hijos: sirve para portadas, tarjetas con foto o encabezados donde el texto va encima de la imagen.',
    props: [
      { nombre: 'source', descripcion: 'La imagen de fondo.' },
      { nombre: 'imageStyle', descripcion: 'Estilo de la imagen (por ejemplo, borderRadius).' },
      { nombre: 'resizeMode', descripcion: 'Cómo se ajusta al recuadro.' },
    ],
    codigo: `<ImageBackground source={require('./portada.png')} style={{ height: 160 }}>
  <Text style={{ color: 'white' }}>Texto sobre la foto</Text>
</ImageBackground>`,
  },
  {
    id: 'text-input',
    nombre: 'TextInput',
    categoria: 'basicos',
    tipo: 'componente',
    icono: 'create-outline',
    resumen: 'Campo para escribir con el teclado.',
    paraQue:
      'Captura texto del usuario: nombres, correos, contraseñas, búsquedas. Se controla con value y onChangeText, y se elige el teclado adecuado para cada dato.',
    props: [
      { nombre: 'value / onChangeText', descripcion: 'Texto actual y función que recibe cada cambio.' },
      { nombre: 'keyboardType', descripcion: 'email-address, numeric, phone-pad, url…' },
      { nombre: 'secureTextEntry', descripcion: 'Oculta lo que se escribe (contraseñas).' },
      { nombre: 'returnKeyType / onSubmitEditing', descripcion: 'Texto de la tecla Enter y qué hace.' },
    ],
    codigo: `const [nombre, setNombre] = useState('');

<TextInput
  value={nombre}
  onChangeText={setNombre}
  placeholder="Tu nombre"
  autoCapitalize="words"
/>`,
  },
  {
    id: 'scroll-view',
    nombre: 'ScrollView',
    categoria: 'basicos',
    tipo: 'componente',
    icono: 'swap-vertical-outline',
    resumen: 'Contenedor que se desplaza.',
    paraQue:
      'Para contenido que no entra en pantalla y es corto o de largo conocido (un formulario, un artículo). Dibuja todos sus hijos de una vez: para listas largas conviene FlatList.',
    props: [
      { nombre: 'horizontal', descripcion: 'Desplaza de lado en vez de hacia abajo.' },
      { nombre: 'pagingEnabled', descripcion: 'Se detiene de a una página (carruseles).' },
      { nombre: 'contentContainerStyle', descripcion: 'Estilo del contenido interior (padding, gap).' },
      { nombre: 'keyboardShouldPersistTaps', descripcion: 'Si un toque cierra el teclado o llega al botón.' },
    ],
    codigo: `<ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
  <Pagina color="green" />
  <Pagina color="lime" />
</ScrollView>`,
  },

  // ───────── Interacción ─────────
  {
    id: 'pressable',
    nombre: 'Pressable',
    categoria: 'interaccion',
    tipo: 'componente',
    icono: 'finger-print-outline',
    resumen: 'La forma moderna de hacer algo tocable.',
    paraQue:
      'Detecta toques y te deja dibujar cada estado (presionado, enfocado). Es la opción recomendada para botones y filas propias: reemplaza a la familia Touchable.',
    props: [
      { nombre: 'onPress / onLongPress', descripcion: 'Toque normal y toque prolongado.' },
      { nombre: 'style={({ pressed }) => …}', descripcion: 'Estilo distinto mientras se presiona.' },
      { nombre: 'hitSlop', descripcion: 'Agranda el área táctil sin agrandar el dibujo.' },
      { nombre: 'android_ripple', descripcion: 'Onda de Material Design en Android.' },
    ],
    codigo: `<Pressable
  onPress={guardar}
  style={({ pressed }) => [estilos.boton, pressed && { opacity: 0.7 }]}
>
  <Text>Guardar</Text>
</Pressable>`,
  },
  {
    id: 'button',
    nombre: 'Button',
    categoria: 'interaccion',
    tipo: 'componente',
    icono: 'radio-button-on-outline',
    resumen: 'Botón nativo básico, sin estilos propios.',
    paraQue:
      'Un botón con el aspecto del sistema en cada plataforma. Es rápido para prototipos, pero solo acepta título y color: para un diseño propio se usa Pressable.',
    props: [
      { nombre: 'title', descripcion: 'El texto del botón (obligatorio).' },
      { nombre: 'onPress', descripcion: 'Qué hace al tocarlo.' },
      { nombre: 'color', descripcion: 'Color del texto en iOS o del fondo en Android.' },
      { nombre: 'disabled', descripcion: 'Lo deshabilita y lo atenúa.' },
    ],
    codigo: `<Button title="Aceptar" color="#1F7A36" onPress={() => alert('¡Listo!')} />`,
  },
  {
    id: 'switch',
    nombre: 'Switch',
    categoria: 'interaccion',
    tipo: 'componente',
    icono: 'toggle-outline',
    resumen: 'Interruptor de encendido y apagado.',
    paraQue:
      'Para una opción que se aplica al instante (modo oscuro, notificaciones). Si el cambio necesita confirmarse con "Guardar", es mejor un checkbox.',
    props: [
      { nombre: 'value / onValueChange', descripcion: 'Estado actual y función que recibe el nuevo.' },
      { nombre: 'trackColor', descripcion: 'Color del riel apagado y encendido.' },
      { nombre: 'thumbColor', descripcion: 'Color del círculo.' },
      { nombre: 'disabled', descripcion: 'Bloquea el cambio.' },
    ],
    codigo: `const [activo, setActivo] = useState(true);

<Switch value={activo} onValueChange={setActivo} trackColor={{ true: '#34C759' }} />`,
  },
  {
    id: 'touchable-opacity',
    nombre: 'TouchableOpacity',
    categoria: 'interaccion',
    tipo: 'componente',
    icono: 'contrast-outline',
    resumen: 'Se vuelve semitransparente al tocarlo.',
    paraQue:
      'La forma clásica de dar feedback a un toque bajando la opacidad. Sigue funcionando, pero para código nuevo la documentación recomienda Pressable.',
    props: [
      { nombre: 'onPress', descripcion: 'Qué hace al tocarlo.' },
      { nombre: 'activeOpacity', descripcion: 'Opacidad mientras se presiona (0,2 por defecto).' },
    ],
    codigo: `<TouchableOpacity activeOpacity={0.6} onPress={abrir}>
  <Text>Abrir</Text>
</TouchableOpacity>`,
  },
  {
    id: 'touchable-highlight',
    nombre: 'TouchableHighlight',
    categoria: 'interaccion',
    tipo: 'componente',
    icono: 'color-fill-outline',
    resumen: 'Oscurece el fondo al tocarlo.',
    paraQue:
      'Muestra un color de resaltado detrás del contenido mientras se presiona, como las filas de una lista de iOS. Acepta un solo hijo.',
    props: [
      { nombre: 'underlayColor', descripcion: 'Color que aparece al presionar.' },
      { nombre: 'onPress', descripcion: 'Qué hace al tocarlo.' },
    ],
    codigo: `<TouchableHighlight underlayColor="#E5E5EA" onPress={elegir}>
  <View style={estilos.fila}><Text>Opción</Text></View>
</TouchableHighlight>`,
  },
  {
    id: 'touchable-without-feedback',
    nombre: 'TouchableWithoutFeedback',
    categoria: 'interaccion',
    tipo: 'componente',
    icono: 'hand-left-outline',
    resumen: 'Detecta toques sin ningún efecto visual.',
    paraQue:
      'Útil para áreas invisibles, como tocar fuera de un campo para cerrar el teclado. No conviene en botones: un toque sin respuesta visual parece roto.',
    props: [
      { nombre: 'onPress', descripcion: 'Qué hace al tocarlo.' },
      { nombre: 'accessibilityRole', descripcion: 'Indica al lector de pantalla qué es.' },
    ],
    codigo: `<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
  <View style={{ flex: 1 }}>{/* formulario */}</View>
</TouchableWithoutFeedback>`,
  },

  // ───────── Listas ─────────
  {
    id: 'flat-list',
    nombre: 'FlatList',
    categoria: 'listas',
    tipo: 'componente',
    icono: 'list-outline',
    resumen: 'Lista eficiente para muchos elementos.',
    paraQue:
      'Solo dibuja lo que está en pantalla y recicla el resto, así una lista de miles de ítems no traba la app. Incluye separadores, encabezado, pie y carga al llegar al final.',
    props: [
      { nombre: 'data / renderItem', descripcion: 'Los datos y cómo se dibuja cada uno.' },
      { nombre: 'keyExtractor', descripcion: 'Clave única de cada ítem.' },
      { nombre: 'ItemSeparatorComponent', descripcion: 'Qué va entre ítems.' },
      { nombre: 'onEndReached', descripcion: 'Cargar más al llegar al final (scroll infinito).' },
    ],
    codigo: `<FlatList
  data={frutas}
  keyExtractor={(f) => f.id}
  renderItem={({ item }) => <Text>{item.nombre}</Text>}
/>`,
  },
  {
    id: 'section-list',
    nombre: 'SectionList',
    categoria: 'listas',
    tipo: 'componente',
    icono: 'albums-outline',
    resumen: 'Lista dividida en secciones con título.',
    paraQue:
      'Como FlatList, pero agrupada: contactos por letra, ajustes por tema. La pantalla principal de este catálogo es un SectionList.',
    props: [
      { nombre: 'sections', descripcion: 'Arreglo de { title, data: [...] }.' },
      { nombre: 'renderSectionHeader', descripcion: 'Cómo se dibuja el título de cada sección.' },
      { nombre: 'stickySectionHeadersEnabled', descripcion: 'Títulos que quedan fijos al desplazar.' },
    ],
    codigo: `<SectionList
  sections={[{ title: 'Frutas', data: ['Manzana', 'Pera'] }]}
  renderItem={({ item }) => <Text>{item}</Text>}
  renderSectionHeader={({ section }) => <Text>{section.title}</Text>}
/>`,
  },
  {
    id: 'virtualized-list',
    nombre: 'VirtualizedList',
    categoria: 'listas',
    tipo: 'componente',
    icono: 'layers-outline',
    resumen: 'La base de FlatList, para datos que no son arreglos.',
    paraQue:
      'Es el motor que usan FlatList y SectionList. Se usa directo cuando los datos no son un arreglo (por ejemplo, una estructura inmutable) y hay que decirle cómo contar y leer cada ítem.',
    props: [
      { nombre: 'getItemCount', descripcion: 'Cuántos ítems hay.' },
      { nombre: 'getItem', descripcion: 'Cómo leer el ítem en una posición.' },
      { nombre: 'renderItem', descripcion: 'Cómo se dibuja cada ítem.' },
    ],
    codigo: `<VirtualizedList
  getItemCount={() => 1000}
  getItem={(_, i) => ({ id: String(i), titulo: 'Fila ' + (i + 1) })}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => <Text>{item.titulo}</Text>}
/>`,
  },
  {
    id: 'refresh-control',
    nombre: 'RefreshControl',
    categoria: 'listas',
    tipo: 'componente',
    icono: 'refresh-outline',
    resumen: 'Deslizar hacia abajo para actualizar.',
    paraQue:
      'Se agrega a un ScrollView o FlatList y muestra el indicador nativo de "tirar para recargar". Mientras refreshing es true, el indicador queda girando.',
    props: [
      { nombre: 'refreshing', descripcion: 'Si está actualizando en este momento.' },
      { nombre: 'onRefresh', descripcion: 'Función que recarga los datos.' },
      { nombre: 'tintColor / colors', descripcion: 'Color del indicador en iOS / Android.' },
    ],
    codigo: `<ScrollView
  refreshControl={<RefreshControl refreshing={cargando} onRefresh={recargar} />}
>
  {/* contenido */}
</ScrollView>`,
  },

  // ───────── Avisos y superposición ─────────
  {
    id: 'activity-indicator',
    nombre: 'ActivityIndicator',
    categoria: 'avisos',
    tipo: 'componente',
    icono: 'sync-outline',
    resumen: 'Indicador circular de carga.',
    paraQue:
      'Avisa que algo está en proceso (una petición, un guardado) cuando no se sabe cuánto falta. Usa el spinner nativo de cada sistema.',
    props: [
      { nombre: 'animating', descripcion: 'Si se muestra girando.' },
      { nombre: 'size', descripcion: '"small", "large" o un número (Android).' },
      { nombre: 'color', descripcion: 'Color del indicador.' },
    ],
    codigo: `{cargando && <ActivityIndicator size="large" color="#34C759" />}`,
  },
  {
    id: 'modal',
    nombre: 'Modal',
    categoria: 'avisos',
    tipo: 'componente',
    icono: 'browsers-outline',
    resumen: 'Ventana que se superpone a la pantalla.',
    paraQue:
      'Muestra contenido por encima de todo y bloquea lo de atrás: confirmaciones, formularios cortos, detalles. En iOS, presentationStyle="pageSheet" da la hoja nativa que se cierra deslizando.',
    props: [
      { nombre: 'visible', descripcion: 'Si está abierto.' },
      { nombre: 'animationType', descripcion: 'none, slide o fade.' },
      { nombre: 'presentationStyle', descripcion: 'fullScreen, pageSheet, formSheet (iOS).' },
      { nombre: 'onRequestClose', descripcion: 'Botón Atrás de Android o gesto de cierre en iOS.' },
    ],
    codigo: `<Modal visible={abierto} animationType="slide" onRequestClose={() => setAbierto(false)}>
  <Text>Contenido</Text>
</Modal>`,
  },
  {
    id: 'status-bar',
    nombre: 'StatusBar',
    categoria: 'avisos',
    tipo: 'componente',
    icono: 'battery-half-outline',
    resumen: 'Controla la barra de estado del sistema.',
    paraQue:
      'Cambia el color de la hora y la batería (claro u oscuro) según el fondo de cada pantalla, o la oculta. En Expo se suele usar la versión de expo-status-bar.',
    props: [
      { nombre: 'barStyle', descripcion: 'light-content o dark-content.' },
      { nombre: 'hidden', descripcion: 'La oculta.' },
      { nombre: 'backgroundColor', descripcion: 'Color de fondo (Android).' },
    ],
    codigo: `<StatusBar barStyle="light-content" />`,
  },
  {
    id: 'alert',
    nombre: 'Alert',
    categoria: 'avisos',
    tipo: 'api',
    icono: 'alert-circle-outline',
    resumen: 'Diálogo nativo con título, mensaje y botones.',
    paraQue:
      'Para confirmar una acción importante o avisar un error. Los botones pueden ser "cancel" o "destructive" y el sistema los dibuja como corresponde en cada plataforma.',
    props: [
      { nombre: 'Alert.alert(titulo, mensaje, botones)', descripcion: 'Muestra el diálogo.' },
      { nombre: 'style: "cancel" | "destructive"', descripcion: 'Tipo de cada botón.' },
      { nombre: 'Alert.prompt', descripcion: 'Diálogo con campo de texto (solo iOS).' },
    ],
    codigo: `Alert.alert('¿Borrar foto?', 'No se puede deshacer.', [
  { text: 'Cancelar', style: 'cancel' },
  { text: 'Borrar', style: 'destructive', onPress: borrar },
]);`,
  },

  // ───────── Pantalla y teclado ─────────
  {
    id: 'safe-area-view',
    nombre: 'SafeAreaView',
    categoria: 'pantalla',
    tipo: 'componente',
    icono: 'phone-portrait-outline',
    resumen: 'Evita que el contenido quede bajo el notch.',
    paraQue:
      'Agrega el margen justo para no tapar la isla, el notch ni la barra de inicio. El de react-native está desaconsejado: hoy se usa react-native-safe-area-context, que funciona en iOS, Android y web.',
    props: [
      { nombre: 'edges', descripcion: 'Qué bordes respetar (safe-area-context).' },
      { nombre: 'useSafeAreaInsets()', descripcion: 'Hook con los márgenes exactos en números.' },
    ],
    codigo: `import { useSafeAreaInsets } from 'react-native-safe-area-context';

const insets = useSafeAreaInsets();
<View style={{ paddingTop: insets.top }} />`,
    aviso: 'Desaconsejado en React Native 0.81+: usá react-native-safe-area-context.',
  },
  {
    id: 'keyboard-avoiding-view',
    nombre: 'KeyboardAvoidingView',
    categoria: 'pantalla',
    tipo: 'componente',
    icono: 'chevron-up-circle-outline',
    resumen: 'Se corre para que el teclado no tape los campos.',
    paraQue:
      'Cuando aparece el teclado, achica o desplaza su contenido para que el campo activo siga visible. En iOS se usa behavior="padding"; en Android el sistema ya ajusta la ventana.',
    props: [
      { nombre: 'behavior', descripcion: 'padding, height o position.' },
      { nombre: 'keyboardVerticalOffset', descripcion: 'Compensa un encabezado fijo.' },
    ],
    codigo: `<KeyboardAvoidingView
  behavior={Platform.OS === 'ios' ? 'padding' : undefined}
  style={{ flex: 1 }}
>
  <TextInput placeholder="Mensaje" />
</KeyboardAvoidingView>`,
  },
  {
    id: 'use-window-dimensions',
    nombre: 'useWindowDimensions',
    categoria: 'pantalla',
    tipo: 'api',
    icono: 'resize-outline',
    resumen: 'Ancho y alto de la ventana, siempre actualizados.',
    paraQue:
      'Hook para adaptar el diseño al tamaño: una columna en el celular y dos en la tablet, o recalcular al girar la pantalla. Reemplaza a Dimensions.get().',
    props: [
      { nombre: 'width / height', descripcion: 'Tamaño de la ventana en puntos.' },
      { nombre: 'scale / fontScale', descripcion: 'Densidad de píxeles y tamaño de letra del sistema.' },
    ],
    codigo: `const { width } = useWindowDimensions();
const columnas = width > 600 ? 2 : 1;`,
  },
  {
    id: 'keyboard',
    nombre: 'Keyboard',
    categoria: 'pantalla',
    tipo: 'api',
    icono: 'keypad-outline',
    resumen: 'Cerrar el teclado y escuchar cuándo aparece.',
    paraQue:
      'Keyboard.dismiss() cierra el teclado. También avisa cuando se muestra u oculta, por ejemplo para esconder una barra mientras se escribe.',
    props: [
      { nombre: 'Keyboard.dismiss()', descripcion: 'Cierra el teclado.' },
      { nombre: 'addListener("keyboardDidShow")', descripcion: 'Avisa cuando aparece (y su altura).' },
      { nombre: 'isVisible()', descripcion: 'Si está abierto ahora.' },
    ],
    codigo: `useEffect(() => {
  const sub = Keyboard.addListener('keyboardDidShow', (e) => setAlto(e.endCoordinates.height));
  return () => sub.remove();
}, []);`,
  },

  // ───────── Según la plataforma ─────────
  {
    id: 'platform',
    nombre: 'Platform',
    categoria: 'plataforma',
    tipo: 'api',
    icono: 'git-branch-outline',
    resumen: 'Saber en qué sistema corre la app.',
    paraQue:
      'Platform.OS devuelve "ios", "android" o "web", y Platform.select elige un valor distinto para cada uno. Sirve para respetar las costumbres de cada sistema.',
    props: [
      { nombre: 'Platform.OS', descripcion: '"ios", "android" o "web".' },
      { nombre: 'Platform.select({ ios, android, default })', descripcion: 'Elige un valor por plataforma.' },
      { nombre: 'Platform.Version', descripcion: 'Versión del sistema operativo.' },
    ],
    codigo: `const sombra = Platform.select({
  ios: { shadowOpacity: 0.2, shadowRadius: 8 },
  android: { elevation: 4 },
});`,
  },
  {
    id: 'touchable-native-feedback',
    nombre: 'TouchableNativeFeedback',
    categoria: 'plataforma',
    tipo: 'componente',
    icono: 'water-outline',
    resumen: 'La onda de toque de Material Design.',
    paraQue:
      'Dibuja la onda (ripple) nativa de Android desde el punto donde se tocó. Hoy se logra lo mismo con la prop android_ripple de Pressable.',
    props: [
      { nombre: 'background', descripcion: 'Ripple(color, sinBorde) para personalizar la onda.' },
      { nombre: 'useForeground', descripcion: 'Dibuja la onda por encima del contenido.' },
    ],
    codigo: `<TouchableNativeFeedback background={TouchableNativeFeedback.Ripple('#34C759', false)}>
  <View style={estilos.boton}><Text>Tocar</Text></View>
</TouchableNativeFeedback>`,
    plataforma: 'android',
  },
  {
    id: 'drawer-layout-android',
    nombre: 'DrawerLayoutAndroid',
    categoria: 'plataforma',
    tipo: 'componente',
    icono: 'menu-outline',
    resumen: 'Menú lateral que se desliza desde el borde.',
    paraQue:
      'El cajón de navegación nativo de Android: se abre deslizando desde el costado o con openDrawer(). En apps con React Navigation se usa su Drawer, que funciona en las dos plataformas.',
    props: [
      { nombre: 'renderNavigationView', descripcion: 'El contenido del menú.' },
      { nombre: 'drawerPosition', descripcion: 'left o right.' },
      { nombre: 'drawerWidth', descripcion: 'Ancho del menú.' },
    ],
    codigo: `<DrawerLayoutAndroid drawerWidth={280} renderNavigationView={() => <Menu />}>
  <Pantalla />
</DrawerLayoutAndroid>`,
    plataforma: 'android',
  },
  {
    id: 'toast-android',
    nombre: 'ToastAndroid',
    categoria: 'plataforma',
    tipo: 'api',
    icono: 'chatbox-ellipses-outline',
    resumen: 'Mensaje breve que desaparece solo.',
    paraQue:
      'Muestra un aviso corto abajo de la pantalla ("Guardado") sin interrumpir. Solo existe en Android; en iOS se usa un banner propio o una librería.',
    props: [
      { nombre: 'ToastAndroid.show(mensaje, duración)', descripcion: 'SHORT o LONG.' },
      { nombre: 'showWithGravity', descripcion: 'Elige arriba, centro o abajo.' },
    ],
    codigo: `ToastAndroid.show('Guardado', ToastAndroid.SHORT);`,
    plataforma: 'android',
  },
  {
    id: 'back-handler',
    nombre: 'BackHandler',
    categoria: 'plataforma',
    tipo: 'api',
    icono: 'arrow-undo-outline',
    resumen: 'Controla el botón o gesto Atrás de Android.',
    paraQue:
      'Permite interceptar Atrás, por ejemplo para preguntar "¿Salir sin guardar?". Si la función devuelve true, el sistema no hace la acción por defecto.',
    props: [
      { nombre: 'addEventListener("hardwareBackPress", fn)', descripcion: 'Escucha el botón Atrás.' },
      { nombre: 'exitApp()', descripcion: 'Cierra la app.' },
    ],
    codigo: `useEffect(() => {
  const sub = BackHandler.addEventListener('hardwareBackPress', () => {
    confirmarSalida();
    return true; // ya lo manejé
  });
  return () => sub.remove();
}, []);`,
    plataforma: 'android',
  },
  {
    id: 'input-accessory-view',
    nombre: 'InputAccessoryView',
    categoria: 'plataforma',
    tipo: 'componente',
    icono: 'reorder-two-outline',
    resumen: 'Barra propia pegada arriba del teclado.',
    paraQue:
      'En iOS, agrega una barra encima del teclado (por ejemplo con "Listo" o atajos) que aparece junto al campo. Se conecta con el TextInput por un nativeID.',
    props: [
      { nombre: 'nativeID', descripcion: 'Mismo valor que inputAccessoryViewID del TextInput.' },
      { nombre: 'backgroundColor', descripcion: 'Color de la barra.' },
    ],
    codigo: `<TextInput inputAccessoryViewID="barra" />
<InputAccessoryView nativeID="barra">
  <Button title="Listo" onPress={Keyboard.dismiss} />
</InputAccessoryView>`,
    plataforma: 'ios',
  },
  {
    id: 'action-sheet-ios',
    nombre: 'ActionSheetIOS',
    categoria: 'plataforma',
    tipo: 'api',
    icono: 'reorder-four-outline',
    resumen: 'La hoja de opciones nativa de iOS.',
    paraQue:
      'Muestra una lista de acciones que sube desde abajo, con "Cancelar" separado y la opción peligrosa en rojo. Solo existe en iOS.',
    props: [
      { nombre: 'showActionSheetWithOptions(opciones, callback)', descripcion: 'Abre la hoja.' },
      { nombre: 'cancelButtonIndex / destructiveButtonIndex', descripcion: 'Qué botón es cada uno.' },
    ],
    codigo: `ActionSheetIOS.showActionSheetWithOptions(
  { options: ['Cancelar', 'Compartir', 'Borrar'], cancelButtonIndex: 0, destructiveButtonIndex: 2 },
  (i) => console.log('Elegiste', i),
);`,
    plataforma: 'ios',
  },

  // ───────── APIs útiles ─────────
  {
    id: 'style-sheet',
    nombre: 'StyleSheet',
    categoria: 'apis',
    tipo: 'api',
    icono: 'brush-outline',
    resumen: 'Define los estilos fuera del render.',
    paraQue:
      'StyleSheet.create agrupa los estilos de un componente, los valida y evita crear objetos nuevos en cada render. También trae utilidades como hairlineWidth y absoluteFill.',
    props: [
      { nombre: 'StyleSheet.create({...})', descripcion: 'Declara los estilos con nombre.' },
      { nombre: 'hairlineWidth', descripcion: 'La línea más fina que se puede dibujar.' },
      { nombre: 'absoluteFill', descripcion: 'Ocupa todo el padre (posición absoluta).' },
    ],
    codigo: `const estilos = StyleSheet.create({
  tarjeta: { padding: 16, borderRadius: 12, backgroundColor: 'white' },
  separador: { height: StyleSheet.hairlineWidth, backgroundColor: '#ccc' },
});`,
  },
  {
    id: 'animated',
    nombre: 'Animated',
    categoria: 'apis',
    tipo: 'api',
    icono: 'pulse-outline',
    resumen: 'El sistema de animación incluido en React Native.',
    paraQue:
      'Anima valores (opacidad, posición, escala) con tiempo o resortes. Con useNativeDriver: true corre en el hilo nativo. Para gestos se recomienda react-native-reanimated.',
    props: [
      { nombre: 'useAnimatedValue(0)', descripcion: 'Crea el valor a animar (en web: useRef(new Animated.Value(0))).' },
      { nombre: 'Animated.timing / spring', descripcion: 'Anima por duración o con un resorte.' },
      { nombre: 'useNativeDriver: true', descripcion: 'Corre en el hilo nativo (transform y opacidad).' },
    ],
    codigo: `const x = useAnimatedValue(0);

Animated.spring(x, { toValue: 1, useNativeDriver: true }).start();

<Animated.View style={{ transform: [{ scale: x }] }} />`,
  },
  {
    id: 'use-color-scheme',
    nombre: 'useColorScheme',
    categoria: 'apis',
    tipo: 'api',
    icono: 'moon-outline',
    resumen: 'Saber si el sistema está en modo claro u oscuro.',
    paraQue:
      'Devuelve "light" o "dark" y se actualiza solo cuando el usuario cambia el modo. Este catálogo lo usa para cambiar todos sus colores.',
    props: [
      { nombre: 'useColorScheme()', descripcion: '"light", "dark" o null.' },
      { nombre: 'Appearance.setColorScheme()', descripcion: 'Fuerza un modo dentro de la app.' },
    ],
    codigo: `const modo = useColorScheme();
const fondo = modo === 'dark' ? '#000' : '#fff';`,
  },
  {
    id: 'linking',
    nombre: 'Linking',
    categoria: 'apis',
    tipo: 'api',
    icono: 'link-outline',
    resumen: 'Abrir enlaces, teléfonos, correos y otras apps.',
    paraQue:
      'Linking.openURL abre una web en el navegador, inicia una llamada (tel:), un correo (mailto:) o un mapa. También recibe los enlaces que abren tu app.',
    props: [
      { nombre: 'openURL(url)', descripcion: 'Abre la URL con la app que corresponda.' },
      { nombre: 'canOpenURL(url)', descripcion: 'Si hay una app que la pueda abrir.' },
      { nombre: 'openSettings()', descripcion: 'Abre los ajustes de tu app.' },
    ],
    codigo: `Linking.openURL('https://reactnative.dev');
Linking.openURL('tel:+5491100000000');`,
  },
  {
    id: 'share',
    nombre: 'Share',
    categoria: 'apis',
    tipo: 'api',
    icono: 'share-outline',
    resumen: 'Abre la hoja nativa para compartir.',
    paraQue:
      'Comparte un texto o enlace por WhatsApp, correo, AirDrop o cualquier app instalada, con el diálogo propio del sistema.',
    props: [
      { nombre: 'Share.share({ message, url, title })', descripcion: 'Abre el diálogo de compartir.' },
      { nombre: 'action', descripcion: 'Si se compartió o se canceló (resultado).' },
    ],
    codigo: `await Share.share({ message: 'Mirá este catálogo de React Native' });`,
  },
  {
    id: 'vibration',
    nombre: 'Vibration',
    categoria: 'apis',
    tipo: 'api',
    icono: 'radio-outline',
    resumen: 'Hace vibrar el dispositivo.',
    paraQue:
      'Para avisos que se sienten: una alarma o un error. Para el "clic" sutil de iOS al tocar, conviene expo-haptics, que es más preciso.',
    props: [
      { nombre: 'Vibration.vibrate(ms o patrón)', descripcion: 'Vibra una vez o con un patrón.' },
      { nombre: 'Vibration.cancel()', descripcion: 'Detiene un patrón en curso.' },
    ],
    codigo: `Vibration.vibrate([0, 120, 80, 120]); // dos pulsos`,
  },
  {
    id: 'pixel-ratio',
    nombre: 'PixelRatio',
    categoria: 'apis',
    tipo: 'api',
    icono: 'grid-outline',
    resumen: 'Densidad de píxeles de la pantalla.',
    paraQue:
      'Indica cuántos píxeles reales hay por punto (2× o 3× en celulares modernos). Sirve para pedir imágenes del tamaño justo y alinear líneas finas.',
    props: [
      { nombre: 'PixelRatio.get()', descripcion: 'Densidad: 1, 2, 3…' },
      { nombre: 'getFontScale()', descripcion: 'Escala del texto elegida por el usuario.' },
      { nombre: 'roundToNearestPixel(n)', descripcion: 'Redondea a un píxel real.' },
    ],
    codigo: `const tamaño = PixelRatio.getPixelSizeForLayoutSize(64); // px reales`,
  },
  {
    id: 'accessibility-info',
    nombre: 'AccessibilityInfo',
    categoria: 'apis',
    tipo: 'api',
    icono: 'accessibility-outline',
    resumen: 'Consultar los ajustes de accesibilidad.',
    paraQue:
      'Indica si hay un lector de pantalla activo o si el usuario pidió "reducir movimiento", para adaptar la app. También permite anunciar un mensaje en voz alta.',
    props: [
      { nombre: 'isScreenReaderEnabled()', descripcion: 'Si VoiceOver o TalkBack están activos.' },
      { nombre: 'isReduceMotionEnabled()', descripcion: 'Si el usuario prefiere menos animación.' },
      { nombre: 'announceForAccessibility(texto)', descripcion: 'Lo lee el lector de pantalla.' },
    ],
    codigo: `const reducir = await AccessibilityInfo.isReduceMotionEnabled();
AccessibilityInfo.announceForAccessibility('Guardado');`,
  },
];

export function buscarComponente(id: string) {
  return componentes.find((c) => c.id === id);
}

/** Siguiente y anterior en el orden del catálogo. */
export function vecinos(id: string) {
  const i = componentes.findIndex((c) => c.id === id);
  return { anterior: componentes[i - 1], siguiente: componentes[i + 1] };
}
