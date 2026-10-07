# RN0 — Primeros pasos con React Native (Expo + TypeScript)

Dos proyectos independientes con Expo y una presentación para exponerlos.

```
RN0/
├── hola-mundo/              Ejercicio 1: "Hola, mundo" + una pestaña con otro estilo
│   ├── App.tsx              Navegación por pestañas (Inicio · Estilos)
│   └── src/
│       ├── screens/InicioScreen.tsx    Pantalla limpia con el saludo
│       ├── screens/EstilosScreen.tsx   Segunda pestaña: color, modo, saludo y formas editables
│       ├── components/SelectorColor.tsx Círculos para elegir el color de acento
│       ├── components/EditorFormas.tsx Forma de partida + deslizadores de tamaño, redondez y giro
│       ├── components/EditorTipografia.tsx Familia, peso, tamaño, espaciado e interlineado
│       ├── components/EditorCartas.tsx Radio de las esquinas y borde de las cartas
│       ├── components/EditorProfundidad.tsx Elevación de las cartas y separación de capas
│       ├── components/Carta.tsx        Carta con la forma y la sombra elegidas (hilo de UI)
│       ├── components/Deslizador.tsx   Deslizador estilo iOS (Gesture Handler + Reanimated)
│       ├── components/Segmentado.tsx   Control segmentado estilo iOS
│       ├── components/BotonArriba.tsx  Flecha flotante para volver arriba
│       ├── components/PressableScale.tsx Botón con respuesta al press-in + háptica
│       ├── components/useEntrada.ts    Animación de entrada del saludo
│       ├── context/AparienciaContext.tsx Color, modo y saludo (se guardan entre aperturas)
│       ├── paletas.ts                  Los 6 colores de acento, con contraste verificado
│       ├── tema.ts                     Colores de claro/oscuro + acento, estilo del saludo
│       ├── theme.ts                    Escala tipográfica, espaciado, springs
│       └── types/navigation.ts         Tipos de las pestañas
├── componentes/             Ejercicio 2: catálogo de todos los componentes nativos
│   ├── App.tsx              Navegación (stack Catálogo → Detalle), modo claro/oscuro
│   └── src/
│       ├── screens/CatalogoScreen.tsx  Búsqueda, filtros por categoría y lista agrupada
│       ├── screens/DetalleScreen.tsx   Para qué sirve, demo en vivo, props clave y código
│       ├── data/componentes.ts         Las 39 fichas (texto, props, ejemplo de código)
│       ├── demos/                      Una demo interactiva por ficha, separadas por categoría
│       ├── components/                 Fila de lista, ícono, etiquetas, hoja "Apariencia" y piezas de las demos
│       ├── context/AparienciaContext.tsx Color de acento + modo (sistema/claro/oscuro), guardados
│       ├── paletas.ts                  Los 6 colores de acento (mismo archivo que hola-mundo)
│       ├── theme.ts                    Tema claro/oscuro + acento, tipografía, springs
│       └── types/                      Tipos de fichas y navegación
└── presentacion/index.html  Presentación HTML (14 diapositivas) para exponer el trabajo
```

## Cómo cumple la consigna

1. **Primer proyecto con Expo** → `hola-mundo/`.
   - Pantalla limpia con un **"Hola, mundo"** (`InicioScreen`).
   - **Nueva pestaña con estilos diferentes** (`EstilosScreen`): fondo oscuro con degradado, tarjetas de vidrio,
     muestras de tipografía, paleta, formas y profundidad. La barra de pestañas también cambia de estilo
     según la pestaña activa (`tabBarStyle` por pantalla).
   - **Selector de color**: 6 colores de acento (Verde, Azul, Índigo, Naranja, Rosa, Grafito). Cambia toda la app:
     el saludo, el botón, el degradado de fondo (que se funde al cambiar) y la barra de pestañas.
   - **Modo claro y oscuro** (Sistema / Claro / Oscuro) en las dos pestañas; en Inicio hay además un atajo sol/luna.
   - **"Hola, mundo" editable** desde Estilos: texto, tamaño, peso y alineación, con vista previa. Se ve igual en Inicio.
   - **Formas editables**: forma de partida (recto, curvo, píldora, círculo), deslizadores de tamaño, redondez y giro,
     tono del color y "Restablecer". La figura sigue al dedo en el hilo de UI.
   - **Tipografía editable**: familia (Sistema, Serif, Mono), peso, tamaño, espaciado entre letras e interlineado, con
     texto de muestra en vivo. La familia también se aplica al "Hola, mundo" de Inicio.
   - **Forma de las cartas**: radio de las esquinas (con atajos Recta, Suave, Curva y Cápsula) y grosor del borde.
     Cambia todas las cartas de la pantalla a la vez, sin re-render: se calcula en el hilo de UI.
   - **Profundidad**: elevación (sombra) de las cartas y separación entre las capas de la demo.
   - Cada sección tiene su botón **Restablecer**, y todo se **guarda** entre aperturas.
   - **Flecha para volver arriba**: aparece al bajar en Estilos (y también en el catálogo y las fichas de `componentes/`).
2. **Proyecto con TypeScript que muestra todos los componentes nativos** → `componentes/`.
   - Los **24 componentes de núcleo** de React Native 0.86 (todo lo que se importa de `react-native`
     y se dibuja como `<Etiqueta />`) y **15 APIs** de uso diario, en 7 categorías.
   - Cada ficha explica **para qué se usa**, trae una **demo en vivo**, sus **props clave** y un **ejemplo de código**.
   - Hoja **Apariencia** (botón de paleta arriba a la derecha): el mismo selector de 6 colores y el modo
     **Sistema / Claro / Oscuro**, con vista previa en vivo. Las demos, el código y los controles toman el color elegido.
   - Los componentes de una sola plataforma (`DrawerLayoutAndroid`, `ToastAndroid`, `InputAccessoryView`, …)
     muestran la demo en su sistema y un aviso en el otro.
   - `SafeAreaView` aparece marcado como **desaconsejado** (React Native 0.81+), con la alternativa actual.
     `ProgressBarAndroid` y `Clipboard` no se incluyen porque el núcleo ya los extrajo a paquetes aparte.

| Categoría | Componentes / APIs |
| --- | --- |
| Básicos | View, Text, Image, ImageBackground, TextInput, ScrollView |
| Interacción | Pressable, Button, Switch, TouchableOpacity, TouchableHighlight, TouchableWithoutFeedback |
| Listas | FlatList, SectionList, VirtualizedList, RefreshControl |
| Avisos y superposición | ActivityIndicator, Modal, StatusBar, Alert |
| Pantalla y teclado | SafeAreaView, KeyboardAvoidingView, useWindowDimensions, Keyboard |
| Según la plataforma | Platform, TouchableNativeFeedback, DrawerLayoutAndroid, ToastAndroid, BackHandler, InputAccessoryView, ActionSheetIOS |
| APIs útiles | StyleSheet, Animated, useColorScheme, Linking, Share, Vibration, PixelRatio, AccessibilityInfo |

## Puesta en marcha

Cada proyecto se instala y se corre por separado:

```bash
cd 4_ReactNative/RN0/hola-mundo     # o: cd 4_ReactNative/RN0/componentes
npm install
npx expo start
```

- Celular con **Expo Go**: escanear el QR (PC y celular en la misma red Wi-Fi).
- Web: tecla `w`. Emulador Android: tecla `a`. Simulador iOS (macOS): tecla `i`.

La presentación no necesita instalar nada: abrir `presentacion/index.html` en el navegador.
Se navega con las flechas, la rueda del mouse, deslizando en pantallas táctiles o con los puntos de la derecha.

## Diseño (Apple, con colores a elección)

- **Tipografía del sistema** (SF en iOS, Roboto en Android) con tracking por tamaño: negativo en títulos, ~0 en cuerpo.
- **6 colores de acento** inspirados en los colores de sistema de Apple, cada uno con 5 tonos (`src/paletas.ts`).
  Los dos tonos que llevan texto están verificados (WCAG AA): el "claro" con texto blanco en modo claro y el
  "brillante" con texto negro en modo oscuro.

  | Color | Claro (con blanco) | Brillante (con negro) |
  | --- | --- | --- |
  | Verde | `#1F7A36` · 5,39:1 | `#30D158` · 10,39:1 |
  | Azul | `#0062CC` · 5,80:1 | `#0A84FF` · 5,76:1 |
  | Índigo | `#4A3FD1` · 7,18:1 | `#7D7AFF` · 6,10:1 |
  | Naranja | `#A85200` · 5,42:1 | `#FF9F0A` · 10,22:1 |
  | Rosa | `#C21F4F` · 5,83:1 | `#FF4F78` · 6,64:1 |
  | Grafito | `#3A3A3C` · 11,35:1 | `#AEAEB2` · 9,50:1 |

- **La elección se recuerda** entre aperturas (AsyncStorage; en la web, localStorage).
- **Lista agrupada de iOS** en el catálogo: íconos estilo Ajustes, separadores finos, el fondo de la fila se
  resalta al tocarla.
- **Modo claro y oscuro**: sigue al sistema (`useColorScheme`) o se fuerza desde Apariencia.
- **Encabezado compacto** en el catálogo: al desplazar, el título grande se va y aparece el título chico en la barra,
  como en iOS. Se calcula en el hilo de UI (Reanimated), sin re-render por cuadro.
- **Movimiento** (Reanimated): respuesta en el press-in con escala 0,97 y spring sin rebote (`dampingRatio: 1`),
  vibración leve en iOS/Android. La entrada del "Hola, mundo" sube 16 px con ease-out fuerte
  `cubic-bezier(0.23, 1, 0.32, 1)`. Al cambiar de color, el fondo nuevo se funde sobre el anterior (360 ms). Las pestañas cambian sin animación (son pares, se tocan muchas veces).
  La transición entre pantallas es la nativa; con "reducir movimiento", un fundido.
- **Accesibilidad**: controles de 44 pt como mínimo, etiquetas para lectores de pantalla, el texto respeta
  el tamaño de letra del sistema.
- **Web móvil** (`public/index.html`): `viewport-fit=cover`, `100dvh`, sin flash gris al tocar,
  `overscroll-behavior: none`. Nunca `user-scalable=no`.
