# 6. App (React Native + Expo): conexión con la API, sesión, navegación y utilidades

> Carpeta `mobile/src`. La app es **una sola base de código** que funciona en Android, iOS y la web (react-native-web).

---

## `api/client.js` — el cliente HTTP

### Qué contiene

| Elemento | Qué es |
|---|---|
| `API_URL` | Sale de `EXPO_PUBLIC_API_URL`; en la web publicada es `/api`. Se le quita la `/` del final. |
| `TIMEOUT_MS` | 15 segundos de espera por defecto. |
| `ApiError` | El error que lanza la app. Siempre trae un `message` para mostrar, además del `status` HTTP, un `code` y los `details`. |
| `fieldErrors` | Getter de `ApiError` que convierte la lista `[{ field, message }]` del servidor en `{ campo: mensaje }`. Así **los errores del servidor aparecen debajo de cada input**. |
| `session` | Los tokens guardados en memoria. |
| `onSessionExpired` | Lo que se hace cuando la sesión vence. |
| `refreshing` | La renovación que está en curso, si hay una. |

### Funciones de la sesión

- `setSessionTokens(tokens)`: guarda los tokens en memoria y también en el almacenamiento persistente. Si recibe `null`, los borra.
- `restoreSessionTokens()`: al abrir la app, lee los tokens guardados.
- `getRefreshToken()`: devuelve el refresh token guardado.
- `setOnSessionExpired(fn)`: registra qué hacer cuando la sesión vence.

### `rawRequest(path, { method, body, query, token, timeout })`

1. Arma la *query string* sin los valores vacíos.
2. Crea un `AbortController` y un temporizador que cancela la petición si tarda demasiado.
3. Hace el `fetch` con estos encabezados:
   - `Accept: application/json`;
   - `Content-Type: application/json` si hay cuerpo;
   - `Authorization: Bearer` si hay token.
4. Si la red falla, lanza `ApiError` con el código `TIMEOUT` o `NETWORK_ERROR` y un mensaje en castellano.
5. Si la respuesta es 204, devuelve `null`.
6. Lee el JSON. Si la respuesta no es OK, lanza `ApiError` con el mensaje, el código y los detalles que mandó el servidor.

### `refreshTokens()`

Pide `/auth/refresh` para conseguir tokens nuevos. Si **varias peticiones fallan al mismo tiempo** porque el token venció, todas esperan la misma renovación: guarda la promesa en `refreshing`. Sin esto, se renovaría varias veces y el servidor lo tomaría como un robo de token.

### `api(path, options)` — una petición autenticada

1. Hace la petición con el access token.
2. Si responde 401 y hay refresh token, intenta renovar.
3. Si la renovación también da 401, borra la sesión, avisa (`onSessionExpired`, que lleva al login) y lanza "Tu sesión expiró".
4. Si la renovación salió bien, **repite la petición original** con el token nuevo.

### `publicApi(path, options)`

Una petición sin token. Se usa para el login y el registro.

---

## `api/endpoints.js` — todas las llamadas en un solo lugar

- `data(p)`: se queda solo con el campo `data` de la respuesta.
- Un objeto por módulo:

| Objeto | Qué agrupa |
|---|---|
| `authApi` | Login, registro, verificar email, reenviar el código, olvidé la contraseña, restablecerla, canje OAuth, logout, `me` y cambiar la contraseña. |
| `bodyApi` | Datos corporales. |
| `usersApi` | Usuarios. |
| `foodsApi` | Alimentos, FatSecret, bases externas y código de barras. |
| `aiApi` | El asistente. |
| `diaryApi` | El diario. |
| `exercisesApi` | Los ejercicios. |
| `workoutsApi` | Los entrenamientos. |
| `progressApi` | El progreso. |
| `adminApi` | Las estadísticas del admin. |
| `coachingApi` | Planes y tablero del coach. |
| `reportsApi` | Los informes. |

- Las llamadas lentas tienen un `timeout` más largo: 25 segundos para las bases externas y hasta 90 segundos para la IA.

---

## `api/socialLogin.js` — login con Google, Facebook o GitHub (PKCE)

- `toHex(bytes)`: convierte bytes en texto hexadecimal.
- `createPkce()`: genera un **verifier** con 32 bytes aleatorios y calcula su **challenge** (SHA-256).
- `nextPkce` y `preparePkce()`: dejan el par **calculado de antemano**, así el botón responde al instante. Cada par se usa una sola vez.
- `fetchProviders()`: pide al servidor qué redes sociales están configuradas.

### `socialLogin(provider)`

1. Toma el par PKCE ya preparado y empieza a calcular el siguiente.
2. Arma la `redirectUri`:
   - en la app instalada es `macroentreno://oauth-callback`;
   - en Expo Go es `exp://…`.
3. Si la API es relativa (`/api`, en la web), le agrega el origen para formar la URL completa.
4. Arma `startUrl` con la `redirect_uri` y el `code_challenge`.
5. **En la web** (`webPopupLogin`):
   - abre una **ventana emergente** chica y centrada en el mismo toque (antes de cualquier `await`, si no el navegador la bloquea) y después la lleva al login del proveedor;
   - cada intento tiene un id: la ventana vuelve a `/oauth-callback?popup=<id>`, que le pasa el resultado a la pestaña de la app por `BroadcastChannel` (o `localStorage`) con `relayPopupResult` y se cierra sola. Solo lo acepta el intento con ese id, así otra pestaña de la app no gasta el código;
   - no usa `window.opener` ni `popup.closed`: Google corta el vínculo entre ventanas por seguridad (Cross-Origin-Opener-Policy) y la ventana "parece" cerrada aunque siga abierta. Por eso espera hasta el resultado, hasta que vence (10 min) o hasta que el usuario toca **Cancelar** (`cancelSocialLogin`);
   - si el navegador **bloquea** la ventana emergente, hace el login en la misma pestaña como antes (verifier en `sessionStorage`).
6. **En el celular**:
   - abre el login en una ventana del sistema **encima de la app** (`openAuthSessionAsync`): en Android una Custom Tab dentro de la propia app (`createTask: false`, sin otra entrada en recientes) y en iOS la hoja de inicio de sesión del sistema. Google no permite iniciar sesión dentro de un WebView propio;
   - si el usuario cancela, lanza un error;
   - si vuelve bien, lee los parámetros y llama a `exchange`.

### `completeWebSocialLogin(queryParams)`

Solo cuando la ventana emergente estaba bloqueada: la pestaña vuelve a `/oauth-callback`, recupera el verifier de `sessionStorage` y lo borra. Si no lo encuentra, el intento venció. Si lo encuentra, hace el canje.

### `SOCIAL_ERRORS` y `exchange(queryParams, verifier)`

- `SOCIAL_ERRORS` son textos **propios**, elegidos según el código de error. El mensaje nunca se lee de la URL, porque cualquiera podría escribir una URL con un mensaje falso.
- `exchange` hace lo siguiente:
  - si llegó un error, lo muestra;
  - si no, canjea `code` + `codeVerifier` en `/auth/oauth/exchange` y recibe la sesión.

---

## `context/AuthContext.jsx` — estado global de la sesión (Context API + useReducer)

- `initialState`: `{ status: 'loading', user: null }`.
- `reducer`: maneja tres acciones:
  - `SIGN_IN` → `signedIn` con el usuario;
  - `UPDATE_USER` → reemplaza los datos del usuario;
  - `SIGN_OUT` → vuelve a `signedOut`.

### `AuthProvider`

1. **Primer `useEffect`**: registra que, si la sesión vence en medio del uso, se ejecute `SIGN_OUT`.
2. **Segundo `useEffect`** — restaura la sesión al abrir la app:
   1. Lee los tokens guardados. Si no hay, cierra la sesión.
   2. Pide `/auth/me`. Si el access token venció, el cliente lo renueva solo.
   3. Guarda una copia del usuario y abre la sesión.
   4. Si **no hay conexión**, entra con la última copia guardada del usuario (modo sin conexión).
   5. Si falla por otro motivo, borra la sesión.

### Funciones que ofrece

| Función | Qué hace |
|---|---|
| `startSession({ user, tokens })` | Guarda los tokens y el usuario y despacha `SIGN_IN`. |
| `login(email, password)` | Hace el login y abre la sesión. |
| `register(...)` | Registra al usuario. **No abre la sesión**: primero hay que poner el código. La única excepción es cuando el servidor devuelve tokens porque no tiene correo configurado. |
| `verifyEmail` | Confirma el código y abre la sesión. |
| `resetPassword` | Cambia la contraseña y abre la sesión. |
| `socialLogin` | Login con red social en el celular. |
| `finishWebSocialLogin` | Termina el login con red social en la web. |
| `logout()` | Avisa al servidor (si falla, igual cierra la sesión en el dispositivo), borra los tokens y despacha `SIGN_OUT`. |
| `setUser` | Actualiza los datos del usuario. |
| `refreshUser` | Vuelve a pedir el usuario al servidor. |
| `updateProfile` | Edita el perfil. |
| `changePassword` | Cambia la contraseña. Guarda los **tokens nuevos**, porque el servidor cerró las demás sesiones. |

- `useMemo` evita que todas las pantallas se vuelvan a dibujar si nada cambió.

### `useAuth()`

Hook para usar el contexto. Lanza un error si se usa fuera del `AuthProvider`.

---

## `storage/tokenStorage.js`

- En el celular usa `expo-secure-store`, que guarda los datos **cifrados** en el Keychain (iOS) o el Keystore (Android). En la web usa `localStorage`.
- `read(key)`: lee la clave y convierte el valor desde JSON. Si falla, devuelve `null`.
- `loadSession` / `saveSession`: leen y guardan los tokens. `saveSession(tokens, { remember })`:
  - con **"Recordarme"** marcado los guarda en el almacenamiento persistente (la sesión sobrevive a cerrar la app);
  - desmarcado no los guarda en el disco: en el celular quedan solo en memoria y en la web en `sessionStorage` (dura lo que la pestaña).
- `loadCachedUser` / `saveCachedUser`: leen y guardan la copia del usuario para el modo sin conexión (solo si se recuerda la sesión).
- `loadLoginPrefs` / `saveLoginPrefs`: si "Recordarme" está marcado y el último email usado, para completarlo en el login.
- `clearSession()`: borra tokens y usuario.

`api/client.js` recuerda la elección (`remember`) para que, al renovar los tokens, se guarden en el mismo lugar.

---

## `hooks/useResource.js` — cargar datos de una pantalla

1. Tiene cuatro estados: `data`, `error`, `loading` y `refreshing`.
2. `requestId`: cada carga recibe un número. Si llega una respuesta **vieja** (por ejemplo, el usuario cambió de filtro mientras tanto), se descarta.
3. `fetcherRef` guarda siempre la última versión de la función de carga, con los valores actuales de la pantalla.
4. `load({ pull })`:
   - ejecuta la función;
   - guarda los datos o el error, solo si la respuesta sigue siendo la más reciente;
   - apaga los indicadores de carga.
5. `useFocusEffect`: **recarga cada vez que la pantalla vuelve a mostrarse**, así se ven los cambios hechos en otra pantalla. También recarga cuando cambian las dependencias (`deps`).
6. Devuelve `{ data, error, loading, refreshing, reload, setData }`. `reload` es para "tirar hacia abajo para recargar".

## `hooks/useResponsive.js`

Calcula el ancho y el alto de la pantalla, si está horizontal, si es una tablet (el lado corto mide 600 o más) y cuántas columnas usar: 1, 2 o 3 según el ancho.

---

## Utilidades (`utils/`)

| Archivo | Qué hace |
|---|---|
| `confirm.js` | `confirm(title, message)` muestra un diálogo Sí/No: `Alert.alert` en el celular y `window.confirm` en la web. Devuelve una promesa con `true` o `false`. `notify` muestra un aviso simple. |
| `constants.js` | `ROLES` (nombre, color e ícono de cada rol), `MEALS` (las 5 comidas con su ícono) y `mealLabel(key)`. |
| `dates.js` | `toIsoDate` da la fecha **local** (no usa `toISOString` porque está en UTC). También tiene `today`, `parseIsoDate`, `addDays`, `formatDayLabel` ("Hoy", "Ayer", "Mañana" o "Lun 3 feb"), `shortWeekday`, `mondayOf` y `formatWeek`. |
| `format.js` | `round1` redondea a 1 decimal; `fmt` formatea con coma argentina; `signed` agrega el `+` a los números positivos. |
| `inputs.js` | **Filtros de tipeo**: no dejan entrar caracteres inválidos (ver abajo). |
| `media.js` | `pickImage(source)`: pide permiso de cámara (si falta, lanza un mensaje claro); abre la cámara o la galería con calidad 0,5 y base64; devuelve `null` si el usuario cancela; arma la data-URL y la rechaza si pesa más de unos 6 MB. |
| `savePdf.js` (celular) | Escribe el PDF en la caché y abre el menú del sistema para **compartirlo**. |
| `savePdf.web.js` (web) | Convierte el base64 en un `Blob`, crea un enlace `<a download>`, lo cliquea y libera la URL a los 30 segundos. Expo elige solo el archivo `.web.js` en el navegador. |

Los tres filtros de `inputs.js`:

- `digits(max)`: borra todo lo que no sea un dígito y corta en `max` caracteres.
- `decimal(int, decimals)`:
  1. Deja solo los dígitos, el punto y la coma.
  2. Busca el primer separador. Si no hay ninguno, devuelve la parte entera recortada.
  3. Si hay separador, recorta la parte entera a `int` dígitos y la decimal a `decimals`, y quita los separadores repetidos.

  Por ejemplo, `"72,555"` queda `"72,5"`.
- `dateMask(text)`: deja solo los números (hasta 8) y pone los guiones solo. `19980421` queda `1998-04-21`.

### `utils/validation.js` — validación en la app (las mismas reglas que el servidor)

**Constantes**

- `EMAIL_MAX`, `NAME_MAX`, `PASSWORD_MAX`: los mismos topes que el servidor.
- `EMAIL_RE`: la misma expresión regular que usa zod en el servidor.
- `ALLOWED_EMAIL_DOMAINS`: los mismos dominios que acepta el servidor en el registro.

**Funciones de cuenta**

- `isEmail` / `validateEmail`: controlan el largo y el formato.
- `validateName`: entre 2 y 100 caracteres, sin caracteres invisibles y con al menos una letra.
- `validateLogin`: email válido y contraseña no vacía, de hasta 72 bytes.
- `validatePassword`: mínimo 8 caracteres, máximo 72 caracteres **y** 72 bytes, con letras y números.
- `validateRegisterEmail`: además de un email válido, exige uno de los dominios permitidos.
- `validateCode`: exactamente 6 dígitos.
- `validateRegister`: junta todo lo anterior y además pide que las dos contraseñas coincidan.

**`validateNumbers(values, fields, { required, positive, min, max, integer })`**

Para cada campo devuelve **un solo mensaje**, controlando en este orden:

1. Requerido.
2. Debe ser un número.
3. No puede ser negativo.
4. Debe ser mayor a 0.
5. Mínimo X.
6. Máximo X.
7. Sin decimales.
8. Como máximo un decimal.

**Otras funciones**

| Función | Qué controla |
|---|---|
| `validateMacroConsistency` | La misma regla que `checkMacros` del servidor: los macros no pueden pesar más que la porción, y las kcal deben parecerse a 4·P + 4·C + 9·G. |
| `validateText(value, { min, max, required, label })` | Texto obligatorio u opcional, con largo mínimo y máximo y sin caracteres de control. |
| `validateIsoDate` | Formato `AAAA-MM-DD`, que la fecha exista y que el año esté entre 2000 y 2100. |
| `validateDateRange` | Que las dos fechas sean válidas, que el fin no sea anterior al inicio y que el rango sea de hasta 366 días. |
| `validateUrl` | Opcional. Hasta 500 caracteres y solo `http` o `https`. |
| `toNumber` | Convierte `"72,5"` en `72.5`; si está vacío, devuelve `undefined`. |
| `BODY_LIMITS`, `yearsSince`, `validateBirthDate` | Lo mismo que el servidor: edad entre 14 y 101 años, fecha real y no futura. |
| `validateMeasure` | Número con coma o punto, dentro del rango y con 1 decimal como máximo. |
| `validateBody(form)` | Valida todo el formulario de datos corporales. |

---

## Navegación (Expo Router: **cada archivo en `app/` es una ruta**)

### `app/_layout.jsx` — la raíz

- `RootLayout` envuelve toda la app en tres capas:
  - `SafeAreaProvider`, que respeta la muesca y las barras del sistema;
  - `ThemeProvider`, con el tema claro u oscuro;
  - `AuthProvider`, con la sesión.
- `RootNavigator`:
  1. Mientras `status === 'loading'`, muestra "Restaurando sesión…".
  2. `Stack.Protected guard={signedIn}`: el grupo `(app)` **solo existe si hay sesión**. Si no la hay, redirige a `/login`.
  3. `Stack.Protected guard={!signedIn}`: `login`, `register`, `verify-email` y `forgot-password` **solo existen sin sesión**. Al iniciar sesión, la app sale de ahí sola.
  4. `oauth-callback` está siempre disponible.
- `ThemedStatusBar`: íconos claros sobre fondo oscuro y viceversa.

### `app/oauth-callback.jsx`

- **En la web**, al montarse (una sola vez, gracias a `useRef`), llama a `finishWebSocialLogin(params)`. Si sale bien, va al inicio; si falla, muestra el error con un botón para volver al login.
- **En el celular** redirige al inicio, porque el código ya lo procesó el navegador de la app.

### `app/(app)/_layout.jsx` — las pantallas con sesión, **protegidas por rol**

| Quién | Pantallas |
|---|---|
| Todos | Las pestañas, cambiar la contraseña (modal), alimentos, el plan de alimentación, los informes y el asistente. |
| Solo el atleta | Registrar una comida, los datos corporales y entrenar con la cámara. |
| Atleta, coach y admin | El formulario de entrenamiento. |
| Coach y admin | El formulario del plan, el detalle de un atleta y el formulario de ejercicio. |
| Solo el admin | Los reportes de entrenadores y el formulario de usuario. |

Si alguien escribe a mano la URL de una pantalla de otro rol, esa ruta **no existe** para él. El servidor, además, vuelve a controlar el permiso.

### `app/(app)/(tabs)/_layout.jsx` — la barra de pestañas

- `icon(name)`: muestra el ícono con contorno cuando la pestaña está en reposo y relleno cuando está activa.
- Cada rol ve pestañas distintas:

| Rol | Pestañas |
|---|---|
| Atleta | Inicio, Diario, Entrenos, Progreso y Perfil. |
| Coach | Mis atletas, Catálogo y Perfil. |
| Admin | Panel, Usuarios, Catálogo y Perfil. |

- La barra va **siempre abajo**.
- En pantallas anchas (700 px o más), el texto va al lado del ícono y la pestaña activa queda resaltada como una "pastilla".
- `titleInset` alinea el título y la barra con el contenido centrado, que tiene un ancho máximo de 1280 px.

### `app/(app)/(tabs)/index.jsx`

Muestra un inicio distinto según el rol: `AdminHome`, `CoachHome` o `AthleteHome`.

### Archivos de una sola línea

Los archivos de una línea en `app/` (`login.jsx`, `diary.jsx`, etc.) solo **reexportan** la pantalla real que está en `features/`. Así las rutas quedan separadas del código de cada pantalla.
