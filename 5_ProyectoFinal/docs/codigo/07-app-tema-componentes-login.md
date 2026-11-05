# 7. App: tema visual, componentes reutilizables y pantallas de acceso

---

## `theme/index.js` — colores, tamaños y modo claro u oscuro

- **`palettes`**: dos paletas, una oscura y una clara, basadas en los colores de sistema de iOS. Cada una tiene el fondo, las tarjetas, el verde de acento y un color por macro (proteína violeta, carbos celeste, grasa amarillo). En el modo claro los colores son más oscuros para que se lean bien sobre el fondo blanco.
- **`current`**: guarda qué tema está activo.
- **`colors`**: un objeto con **getters**. Por eso `colors.text` devuelve siempre el color del tema que esté activo en ese momento, sin cambiar nada en los demás archivos.
- **`createStyles(factory)`**: hace lo mismo que `StyleSheet.create`, pero se recalcula cuando cambia el tema.
  - Usa un `Proxy`: cada vez que se lee `styles.card`, pide los estilos del tema actual.
  - Guarda una copia por tema, así los estilos se calculan una sola vez por tema.
- **Constantes de diseño**:
  - `spacing`: espacios de 4 a 32 px.
  - `radius`: redondeo de bordes.
  - `font`: la escala tipográfica de iOS.
  - `tracking`: el espaciado entre letras de los títulos.
  - `numeric`: números de ancho fijo, para que no "bailen" cuando cambian.
  - `continuous`: esquinas redondeadas continuas (*squircle*) en iOS.
  - `MAX_CONTENT_WIDTH = 1280`: el ancho máximo del contenido en PC.
- **`ThemeProvider`**:
  1. Guarda la preferencia del usuario: `system`, `light` o `dark`.
  2. Escucha el tema del teléfono con `Appearance`.
  3. Al arrancar, lee la preferencia guardada y se suscribe a los cambios del sistema. Al desmontarse, se da de baja.
  4. `scheme`: si la preferencia es `system`, sigue al teléfono; si no, usa la elegida.
  5. Asigna `current` **durante el render**, para que los hijos ya lean los colores nuevos.
  6. `setPreference` cambia el tema y lo guarda en el dispositivo.
- **`useTheme()`**: lee el contexto del tema. Los componentes lo llaman para volver a dibujarse cuando cambia el tema.

---

## Componentes reutilizables (`components/`)

| Componente | Qué muestra y cómo funciona |
|---|---|
| **`Button`** | Botón con forma de cápsula. Tiene 6 variantes de color: `primary`, `secondary`, `tinted`, `outline`, `danger` y `ghost`. **En la web de PC** (700 px o más) ocupa solo el ancho de su texto y es más bajo, como un botón de escritorio; con `block` ocupa todo el ancho. Cuando se lo presiona se achica un poco (`scale 0.97`). Mientras carga (`loading`) muestra un indicador y queda desactivado. |
| **`Card`** | Una tarjeta con título opcional, un elemento a la derecha y el contenido. |
| **`Chips`** | Para elegir **una opción entre varias** (filtros, comidas, roles). Con `scroll` las opciones van en una fila que se desplaza; con `scroll={false}` bajan de renglón cuando no entran. |
| **`Columns`** | **Dos columnas en la PC** (1000 px o más): `side` es la angosta, de 400 px, y `children` la principal. En el celular las dos van una debajo de la otra. |
| **`ListColumns`** | Pone las filas de una lista en dos columnas en la PC. |
| **`DateSwitcher`** | La barra `‹ Hoy ›`. Las flechas restan o suman un día; si se toca la fecha, vuelve a hoy. |
| **`FieldRow`** | Pone campos lado a lado. Si no entran (cada uno pide 130 px como mínimo), bajan de renglón. |
| **`Grid`** | Una grilla de 1, 2 o 3 columnas, según el ancho que calcula `useResponsive`. |
| **`ListItem`** | Una fila con ícono, título, subtítulo y una flecha `›` si se puede tocar. |
| **`Logo`** | El logo blanco en el modo oscuro y el negro en el claro. |
| **`MacroRing`** | Un anillo chico con el % de un macro. Se pone **rojo** si el valor se pasa de la meta en más de un 10 %. |
| **`MacroSummary`** | El anillo grande de las kcal, con "Te quedan / Te pasaste X kcal", y los 3 anillos de los macros. Mide **la tarjeta** (`onLayout`) y no la pantalla, para decidir si poner los anillos lado a lado. |
| **`MacroInline`** | Una línea de texto: `kcal · P C G`, con los colores de cada macro. |
| **`MicroList`** | Una barra por micronutriente contra su valor diario (ver los colores abajo). En la PC, si `wide`, va en dos columnas. Avisa cuando faltan datos de algunos alimentos. |
| **`ProgressRing`** | Un anillo hecho con SVG. Dibuja dos círculos: el fondo, atenuado, y el progreso, con `strokeDasharray` y `strokeDashoffset` (el largo del trazo = la circunferencia × el %). Está rotado −90° para que empiece arriba. |
| **`RoleBadge`** | Una etiqueta de color con el rol: Admin en rojo, Entrenador en naranja y Atleta en verde. |
| **`Screen`** | El contenedor de **todas** las pantallas. Tiene scroll, la opción de tirar hacia abajo para recargar (`RefreshControl`), el ancho máximo centrado y un pie fijo opcional (`footer`), por ejemplo para el botón de guardar. **Volver arriba:** en `onScroll` mira si se bajó más de 400 px (`SHOW_TOP_AFTER`); si es así, aparece un botón verde con una flecha. Entra y sale con un fundido (`Animated.timing` sobre `fade`, guardado en `useState` para que no se recree). Al tocarlo, `scrollTo({ y: 0, animated })` sube con animación suave, salvo que el usuario tenga activado "reducir movimiento". |
| **`StatTile`** | Una tarjeta con un dato destacado: ícono y etiqueta de color arriba y el valor grande abajo. |
| **`Loading`** | Una ruedita de carga con texto. |
| **`ErrorState`** | Un ícono que distingue si hay **"Sin conexión"** o si "Algo salió mal", con un botón para reintentar. |
| **`EmptyState`** | El mensaje que se muestra cuando una lista está vacía. |
| **`FormError`** | Un recuadro rojo con el error general del formulario, el que no corresponde a ningún campo. |
| **`TextField`** | Un input con la etiqueta arriba, se pone **verde al enfocarse** y **rojo cuando hay error**. Debajo muestra el error o, si no hay, una ayuda (`hint`). El texto mide 17 px para que Safari no haga zoom. Usa `forwardRef` para poder mover el foco de un campo al siguiente. |
| **`ThemeSwitch`** | Para elegir el tema: Automático, Claro u Oscuro. |
| **`ThemeToggleButton`** | Un botón de sol o luna que cambia el tema rápido. |
| **`components/index.js`** | Reexporta todos los componentes, así se importan desde un solo lugar. |

**`ProgressRing`: cómo se anima (`useEased(target)`)**

- Anima el número hasta `target` con `requestAnimationFrame` y una curva *ease-out cubic*, en 700 ms.
- Si el valor cambia a mitad de camino, sigue desde donde está, sin saltar.
- Si el usuario activó "reducir movimiento" en el sistema, no anima.

**Colores de las barras de `MicroList`**

- Si el nutriente es un límite (sodio, azúcar): naranja al llegar al 80 % y rojo al pasarse.
- Si es una meta (fibra, vitaminas): verde al cumplirla.

**`KcalBarChart`: el gráfico de barras de las kcal por día**

Está hecho solo con `View`, sin librerías.

1. `max` es el mayor valor entre la meta × 1,2 y el día más alto, así la línea de la meta siempre entra.
2. La línea punteada de la meta va a la altura `goal / max × alto`.
3. Cada barra mide `kcal / max × alto`, con una altura mínima para que se vea.
4. `barColor`:
   - gris si no hay registros;
   - verde si está dentro de ±10 % de la meta;
   - naranja si se pasó;
   - verde suave si le faltó.
5. Abajo muestra el día de la semana (el de hoy en negrita) y un punto celeste si ese día entrenó.

---

## Pantallas de acceso (`features/auth/`)

### `AuthLayout.jsx`

Es el marco de las pantallas de acceso:

- usa `SafeAreaView`, que respeta la muesca del celular;
- tiene el botón del tema arriba a la derecha;
- usa `KeyboardAvoidingView` para que en iOS el teclado no tape los campos;
- tiene scroll y una tarjeta centrada de 400 px como máximo;
- muestra el logo, el título y el subtítulo.

### `LoginScreen.jsx`

**Estado:** `form` (los campos), `errors` (el error de cada campo), `formError` (el error general) y `loading`. `passwordRef` sirve para pasar del email a la contraseña con la tecla "siguiente".

**`set(key)`:** devuelve una función que actualiza un campo **y borra su error**, así el error desaparece mientras el usuario corrige.

**`submit()`:**
1. `validateLogin`: si hay errores, los muestra y **no llama al servidor**.
2. Llama a `login(email, contraseña)`. Al abrirse la sesión, la navegación pasa sola a la app, porque `Stack.Protected` detecta el cambio.
3. Si el servidor responde `EMAIL_NOT_VERIFIED`, lleva a la pantalla del código, pasándole el email.
4. Cualquier otro error: los errores de cada campo van debajo de su input (`fieldErrors`) y el mensaje general va arriba.

**Enlaces y botones:**
- "¿Olvidaste tu contraseña?" lleva el email ya escrito.
- Muestra los botones de redes sociales y el enlace para registrarse.

### `RegisterScreen.jsx`

1. `validateRegister` controla:
   - el nombre;
   - que el email sea de un **dominio conocido**;
   - que la contraseña sea fuerte;
   - que las dos contraseñas coincidan.
2. Llama a `register`. Si el servidor responde `verificationRequired`, va a `/verify-email` con el email.
3. Los errores se muestran igual que en el login.

### `VerifyEmailScreen.jsx`

- Recibe el `email` por parámetro de la URL.
- El campo del código **solo acepta números** (`replace(/\D/g,'')`) y como máximo 6 dígitos. Con `autoComplete="one-time-code"` el celular **sugiere el código** que llegó.
- `submit`:
  1. `validateCode` comprueba que sean 6 dígitos.
  2. Llama a `verifyEmail`. Al abrirse la sesión, la app entra sola.
- `resend`: pide un código nuevo y muestra "Te mandamos un código nuevo". Si pasó menos de un minuto, el servidor avisa que hay que esperar.
- "Cambiar email" vuelve al registro.

### `ForgotPasswordScreen.jsx` — dos pasos (`step`)

1. **Paso `email`:** `sendCode` valida el email, llama a `forgotPassword` y pasa al paso `code`. El servidor responde lo mismo exista o no la cuenta.
2. **Paso `code`:** `submit` valida el código (6 dígitos), la contraseña nueva y que las dos coincidan, y llama a `resetPassword`, que abre la sesión y entra a la app.
3. **`run(work)`:** una función auxiliar que comparten los dos pasos. Limpia el error, activa `loading`, ejecuta la tarea y, si falla, muestra los errores.
4. El botón "Reenviar código" vuelve a pedirlo.

### `SocialButtons.jsx`

- **`PROVIDERS`:** Google, Facebook y GitHub, cada uno con su ícono y su color.
- **Al montarse:** pide al servidor qué proveedores están configurados (`fetchProviders`) y guarda `{ google: true, ... }`.
- **`handlePress(provider)`:**
  1. Si el proveedor no está configurado, avisa y no hace nada.
  2. Si está configurado:
     - marca ese botón como ocupado (aparece una ruedita);
     - llama a `socialLogin`;
     - si el usuario canceló (`CANCELLED`), no muestra ningún error.
- **Botones:** los proveedores que no están configurados se ven semitransparentes (`opacity 0.45`).
