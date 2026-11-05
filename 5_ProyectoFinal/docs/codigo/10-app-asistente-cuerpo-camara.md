# 10. App: asistente con IA, datos corporales y entrenador con cámara

---

## Asistente con IA (`features/assistant/`)

### `AssistantBanner.jsx`
Tarjeta que lleva a `/assistant`. Aparece en el inicio de cada rol, con un subtítulo distinto para cada uno.

### `AssistantSetup.jsx`
- **`SETUP_CODES`** son los errores que **no se arreglan reintentando**: el servidor no tiene clave (`AI_NOT_CONFIGURED`) o la clave es inválida (`AI_INVALID_KEY`).
- En esos casos el usuario ve "El asistente no está disponible" y un botón "Volver a probar". **No se muestran instrucciones técnicas en pantalla**: cómo configurar la clave está explicado en el README del backend.

### `voice.js` (celular) y `voice.web.js` (navegador)
Las dos versiones tienen las mismas funciones, así la pantalla las usa sin preguntar en qué plataforma corre. Expo elige el archivo `.web.js` cuando la app corre en el navegador.

**`useVoiceRecorder()`** devuelve `{ recording, start, stop }`.

**En el celular** (con `expo-audio`):
1. `start` pide permiso para usar el micrófono, configura el modo de grabación y empieza a grabar.
2. `stop` corta la grabación, lee el archivo `.m4a` en base64, lo borra y devuelve `{ audio, mimeType }`.

**En la web** (con `MediaRecorder`):
1. `start` comprueba que el navegador pueda grabar y pide el micrófono. Elige el primer formato compatible: webm, mp4 u ogg. Va guardando los pedazos de audio en `chunks`.
2. `stop`:
   - corta la grabación y apaga el micrófono;
   - une los pedazos en un `Blob`;
   - lo convierte a base64. Lo hace **en bloques de 32 KB** para no superar el límite de argumentos de `String.fromCharCode`.

**Reproducir la respuesta:**
- `playSpeech(base64)`:
  - en el celular guarda el MP3 en la caché y lo reproduce, porque Android no acepta data-URLs;
  - en la web usa un `new Audio(data:…)`. Si el navegador bloquea la reproducción automática, la respuesta igual queda escrita.
- `stopSpeech()`: corta el audio que esté sonando.

### `AssistantScreen.jsx` — el chat

**Constantes**
- `HISTORY = 16`: cuántos mensajes previos se mandan como contexto.
- `MAX_CHARS = 2000`: el largo máximo de un mensaje.
- `SLOW_MS = 15 s`: pasado ese tiempo, se avisa que la respuesta puede tardar.
- `SUGGESTIONS`: preguntas de ejemplo para cada rol. Una de ellas abre la cámara para mandar una foto.
- `errorMessage(err)`: si es un error de validación, muestra el detalle del campo que falló.

**Estado**
- `status`: si el servidor tiene configurada la IA.
- `messages`: la conversación.
- `text` e `image`: lo que se está por enviar.
- `busy`: `'thinking'` (esperando la respuesta) o `'transcribing'` (pasando el audio a texto).
- `failure`: el último mensaje que no se pudo enviar.
- `speakAll`: si todas las respuestas se leen en voz alta.

**Efectos**
- Al salir de la pantalla, corta el audio.
- Si la respuesta tarda más de 15 segundos, marca `slow`.

**`ask(history, { spoken })`**
1. Manda los últimos 16 mensajes a `aiApi.chat`.
2. Agrega la respuesta a la conversación, junto con sus `actions`.
3. Si el usuario habló, o si está activado "leer todo", pide el audio de la respuesta y lo reproduce.
4. Si hay un error:
   - **De configuración o de validación**: saca el mensaje de la conversación y **lo devuelve al campo de texto**, así no se pierde lo escrito.
   - **Cualquier otro**: marca el mensaje como fallido y muestra el botón "Reintentar".

**El resto de las funciones**
- `send(content)`: recorta el texto, arma el mensaje del usuario (con la foto, si hay), reemplaza cualquier mensaje fallido, vacía el campo y llama a `ask`.
- `retry()`: quita la marca de fallido y vuelve a preguntar.
- `clearChat()`: pide confirmación y borra la conversación. Lo que el asistente ya registró **queda guardado**.
- `toggleMic()`:
  1. Si no está grabando, empieza a grabar.
  2. Si está grabando, para la grabación y la manda a `aiApi.transcribe`.
  3. Si entendió algo, lo envía como un mensaje hablado; si no, avisa "No te escuché bien".
- `attach(source)`: elige una foto con `pickImage` y la deja lista para mandar.

**Qué se dibuja**
- **Encabezado**: los botones de borrar la conversación y de leer en voz alta.
- **Lista de mensajes**:
  - si la IA no está configurada, muestra `AssistantSetup`;
  - si no hay mensajes, muestra las sugerencias;
  - si hay, muestra las burbujas: verdes las del usuario y grises las del asistente.
- **Acciones del asistente**: debajo de cada respuesta aparecen enlaces, por ejemplo "2 comidas registradas en cena", que llevan al diario o a los entrenos. Solo se muestran al atleta, que es quien tiene esas pestañas.
- **Indicador de espera**: "Pensando…", "Escuchando lo que dijiste…" o "Sigo trabajando…".
- **Barra de escritura**:
  - botones de cámara y galería;
  - el campo de texto, que se puede agrandar;
  - un botón **enviar**, si hay texto; si no, un botón de **micrófono**, que se pone rojo mientras graba;
  - un contador de caracteres que aparece cerca del límite.

---

## Datos corporales (`features/body/BodyProfileScreen.jsx`)

**Constantes y funciones auxiliares**
- `SEX` y `PACE`: las opciones de sexo y de ritmo. `EMPTY`: el formulario vacío.
- `onlyDecimal(text)`: deja solo números y un decimal, con hasta 5 caracteres.
- `asDate(text)`: es la máscara de la fecha, que pone los guiones sola.
- `toPayload(form)`: si el formulario tiene errores (`validateBody`), devuelve `null`. Si está bien, convierte los textos en números.

**`BodyProfileScreen`**
Carga en paralelo los datos guardados y las opciones (niveles de actividad y objetivos), y le pasa todo a `BodyForm`.

**`initialForm(profile)`**
Si el usuario ya tiene datos guardados, los pasa a texto para mostrarlos en los inputs. Si no, usa `EMPTY`.

**`BodyForm`**
1. **Vista previa en vivo**: cada vez que cambia el formulario y queda válido, espera **500 ms** y pide `bodyApi.preview`, que calcula sin guardar. Así el plan se recalcula mientras el usuario escribe.
2. **Errores en el momento**:
   - un campo que ya tiene algo escrito se valida mientras se tipea (la fecha recién al completar los 10 caracteres);
   - los campos vacíos se marcan recién al tocar "Guardar" (`submitted`);
   - todos estos errores se combinan con los que devuelve el servidor.
3. **`save()`**:
   1. Si hay errores, muestra "Revisá los datos marcados en rojo".
   2. Si no, llama a `bodyApi.save` con `applyGoals: true`, que **copia las kcal y los macros calculados a las metas del diario**.
   3. Refresca el usuario y vuelve atrás.
4. **`logWeight()`**: registra la pesada de hoy, con el mismo límite de 30 a 350 kg, y recarga.
5. **Qué se dibuja** (en la PC, el formulario a la izquierda, de 620 px, y el resultado a la derecha):
   - **Tus datos**: el sexo, la fecha de nacimiento, la altura, el peso y el % de grasa, cada uno con su rango en la ayuda.
   - **Nivel de actividad**: opciones tipo radio (`Option`), con su factor.
   - **Objetivo**: déficit, recomposición, mantenimiento o volumen. Si el objetivo tiene ritmo, aparecen las opciones lento, moderado y rápido, con su explicación.
   - **Tu plan**:
     - las kcal grandes y los tres macros, con los g/kg de proteína;
     - el metabolismo basal, el gasto diario y el cambio por semana;
     - el IMC, la masa magra, el agua y la fibra;
     - el método y la edad;
     - los **avisos** del cálculo y un recordatorio de que es una estimación.
   - **Registrar peso**: un campo para el peso y las últimas 6 pesadas.
- **`Option`, `Macro` y `Row`**: tres componentes de presentación: una opción tipo radio, un macro con su color y una fila "etiqueta → valor".

---

## Entrenador con cámara (`features/coach/`, solo en la web)

Funciona **en el navegador** con **MediaPipe Pose**, un modelo de Google que encuentra 33 puntos del cuerpo en cada cuadro del video. Todo el análisis se hace en el dispositivo: **el video no se envía a ningún servidor**.

### Flujo general
1. **Preparación** (`SessionSetup`): se elige cuántas series, el objetivo y el descanso. Se ve un maniquí 3D haciendo el ejercicio.
2. **En vivo** (`CoachSession.web.jsx`):
   1. la cámara toma un cuadro;
   2. MediaPipe devuelve los puntos del cuerpo;
   3. se suavizan;
   4. el *tracker* cuenta las repeticiones y detecta los errores;
   5. el *narrador* decide qué decir;
   6. se dibuja el esqueleto sobre el video.
3. **Resumen** (`SessionSummary`): las series, la calidad de la técnica y el error más frecuente. Ofrece guardar la sesión o devolver las series al formulario que abrió la cámara.

### Archivos

| Archivo | Qué hace |
|---|---|
| `exercises.js` | `COACH_EXERCISES`: los 8 ejercicios con sus pasos, consejos y una versión más fácil. `fold()` quita tildes y pasa a minúsculas. **`ruleFor(nombre)`** reconoce el ejercicio por su nombre con expresiones regulares ("sentadilla", "squat" → squat). El orden importa: "plancha lateral" se busca antes que "plancha". `NOT_PUSHUP` evita que "flexión de bíceps" se tome como una flexión de brazos. |
| `bridge.js` | Conecta el formulario de la sesión con la cámara. `requestCoach(fn)` guarda qué hacer con el resultado y devuelve un id; `resolveCoach(id, resultado)` le entrega las series contadas a quien las pidió. Vive en memoria. |
| `pose/geometry.js` | `LM`: los índices de los puntos de MediaPipe (hombro 11/12, cadera 23/24…). `angle(a,b,c)`: el ángulo en `b`, calculado con el **producto escalar** (`acos` del coseno). `inclination`: el ángulo respecto de la vertical. `sideScore`/`bestSide`: qué lado del cuerpo ve mejor la cámara. `isAboveLine`: si un punto queda por encima de una recta. |
| `pose/smoothing.js` | Aplica el **filtro One Euro** a cada punto: suaviza mucho cuando el punto está quieto (saca el temblor) y poco cuando se mueve rápido (no se queda atrás). Si el cuerpo desaparece más de 500 ms, o un punto salta muy lejos, empieza de cero. |
| `pose/framing.js` | `checkFraming`: decide **qué consejo dar** según dónde está el cuerpo: "No te veo", "Correte al centro", "Alejate un poco" (si está cortado arriba o abajo) o "Acercate" (si se ve muy chico). `missingParts` dice qué partes del cuerpo no se ven. |
| `pose/rules.js` | Las **reglas de cada ejercicio**. En los de repeticiones (`reps`), el ángulo que se mide va de `rest` (de pie) a `peak` (lo más abajo): por ejemplo, en la sentadilla, cadera–rodilla–tobillo de 160° a 100°. En los que se sostienen (`hold`), como las planchas, se acumulan segundos con buena postura. Cada regla tiene `checks` con el mensaje que se muestra si fallan ("Mantené el pecho arriba" si el torso se inclina más de 50°). La función `profile` exige estar de costado. |
| `pose/engine.js` | El **tracker**, explicado en detalle más abajo. |
| `pose/script.js` | El **narrador**: decide qué decir y **casi siempre se calla**. Habla para decir que te ve (una vez), para corregir después de una repetición mal hecha, para decir "una más", cada 5 repeticiones y para contar los segundos de la plancha. `numberWords` pasa números a palabras ("veinticuatro"). También arma los textos de inicio, de fin de serie y del resumen. |
| `pose/phrases.js` | `phrasesFor` arma la lista de frases que probablemente se digan, para **cargar los audios antes** de empezar. `allSentences` arma todas las frases posibles, que se usan para grabar el paquete de voces. |
| `pose/session.js` | Configuración de la sesión: series de 1 a 5, repeticiones de 5 a 30, segundos de 10 a 90 y descanso. `clampConfig` lleva los valores a ese rango. Se guarda en `localStorage`. Para el resumen: `sumSets` (totales), `tempo` (el tiempo promedio por repetición), `quality` (el % de repeticiones bien hechas) y `worstError` (la corrección que más se repitió). |
| `pose/overlay.js` | Dibuja sobre un `<canvas>`: el esqueleto (verde mientras se juzga, rojo en las articulaciones que fallan), el ángulo medido con sus grados y las esquinas que marcan dónde pararse. |
| `pose/demo.js` + `demoScene.web.js` + `ExerciseDemo.web.jsx` | El **maniquí 3D** que hace el ejercicio. `figureAt(id, p)` calcula la pose para un avance `p` entre 0 y 1; `bend` resuelve dónde va la rodilla o el codo (**cinemática inversa** de dos segmentos). La escena usa WebGL y, si no está disponible, muestra las instrucciones escritas. |
| `landmarker.web.js` | Carga MediaPipe, primero de una copia local y si no desde la CDN. Elige el modelo `full` si hay GPU y `lite` si no; guarda uno por calidad para no cargarlo dos veces. |
| `voice.web.js` | La voz del entrenador. Usa un **paquete de audios ya grabados** y, si falta alguno, la voz del navegador (`pickVoice` elige la mejor voz en español, priorizando la rioplatense). Tiene una cola: lo urgente interrumpe; lo demás espera su turno y solo se guarda la última frase en espera. `warmVoice` precarga los audios. |
| `SessionSetup.web.jsx` | La pantalla de preparación. `Stepper` es un selector − valor +. `minutes()` estima cuánto va a durar la sesión. |
| `SessionSummary.jsx` | El resumen final y los botones: usar las series en el formulario, guardar la sesión, repetir o ajustar. |
| `RepDots.jsx` | Un punto por repetición: verde si contó, rojo si no y vacío hasta llegar al objetivo. |
| `CoachCatalog.jsx` / `CoachSessionScreen.jsx` / `CoachSession.jsx` | El catálogo de ejercicios para elegir; la ruta `/coach/[rule]`, que lee los parámetros (`positive()` valida los números); y la versión del celular, que **explica** que el análisis funciona en el navegador y muestra las indicaciones. |

### `pose/engine.js` — `createTracker(rule)`: cómo cuenta las repeticiones
**No usa ni la cámara ni la pantalla.** Recibe poses y devuelve un estado: `reps`, `badReps`, `holdMs`, `progress`, `message`, `failing`, etc.

**Constantes que lo hacen robusto:**

| Constante | Para qué sirve |
|---|---|
| `ARM_MS = 1000` | Hay que estar 1 segundo quieto en la posición de inicio antes de que empiece a contar, así sentarse o acercarse caminando no cuenta como repetición. |
| `MIN_REP_MS = 600` | Un movimiento más rápido que esto es ruido, no una repetición. |
| `MAX_JUMP = 55°` | Si el ángulo salta más que eso en un cuadro, es un error de detección y se ignora. |
| `LOST_GRACE_MS = 600` | Si una mano tapa la rodilla un momento, no se pierde la repetición. |
| `SMOOTHING = 5` | Se usa la **mediana** de los últimos 5 ángulos. |
| `lockSide` | Siempre juzga el mismo lado del cuerpo; solo cambia si el otro se ve claramente mejor durante 400 ms. |

**`update(lm, now)`, paso a paso:**
1. Comprueba que se vean los puntos que necesita la regla. Si no, explica qué hacer (`lose`).
2. Calcula qué *checks* fallan y qué articulaciones pintar de rojo.
3. **Ejercicios que se sostienen (`hold`):**
   - si la postura está mal, el reloj se detiene y se muestra la corrección;
   - si está bien durante 0,8 s, empieza a sumar tiempo.
4. **Ejercicios de repeticiones (`reps`):**
   1. Calcula el ángulo y descarta los saltos.
   2. Calcula el **avance**: `progress = (rest − ángulo) / (rest − peak)`, entre 0 y 1.
   3. Si todavía no arrancó, espera la posición de inicio durante 1 segundo y muestra "¡Listo! Arrancá".
   4. Cuando el avance pasa de **0,25**, empezó una repetición: guarda el punto más profundo al que llegó y los errores de técnica.
   5. Cuando vuelve por debajo de **0,1**, terminó la repetición:
      - si llegó al fondo (avance ≥ 1) y no tuvo errores durante 3 cuadros o más, **cuenta**: "¡Bien! Van N";
      - si llegó al fondo pero con mala técnica, **no cuenta** y muestra la corrección;
      - si llegó solo a la mitad (avance ≥ 0,35), **no cuenta**: "Bajá más…".
5. **`isSetDone`**: la serie termina al llegar al objetivo de repeticiones o de segundos.

### `CoachSession.web.jsx` — la pantalla en vivo
- **Fases**: `setup`, `starting`, `live`, `done` o `error`. Para los errores (sin permiso, sin cámara, sin HTTPS, o el modelo no cargó) muestra un mensaje claro (`PROBLEMS`).
- **`start()`**:
  1. Comprueba que la página sea HTTPS y que haya cámara.
  2. Pide la cámara (`getUserMedia`, 1280×720).
  3. Carga MediaPipe.
  4. Crea el tracker y el narrador, y pasa a `live`.
- **`loop()`**, que corre **en cada cuadro**:
  1. Detecta la pose y la suaviza.
  2. Mide los cuadros por segundo. Si durante 3 segundos analiza menos de 14 cuadros por segundo, **cambia al modelo `lite`** sin cortar la sesión.
  3. Si está en el descanso, cuenta el tiempo y después anuncia la serie siguiente.
  4. Si no, actualiza el tracker, le pregunta al narrador qué decir, dibuja el esqueleto y muestra "+1" o "No contó".
  5. Para no hacerlo más lento, actualiza la pantalla de React **como máximo cada 100 ms**.
  6. Cuando la serie termina, llama a `completeSet`.
- **`completeSet()`**: guarda la serie. Si era la última, llama a `finish()`; si no, anuncia el fin de la serie y empieza el descanso.
- **`finish()`**: guarda también una serie que quedó a la mitad, si se hizo algo. Apaga la cámara, pasa al resumen y lo dice en voz alta.
- **Otras funciones**: activar y desactivar la voz (se recuerda la preferencia), la pantalla completa, la pausa y los datos de depuración (`?debug`) para calibrar los ángulos.
- **Al terminar**:
  - si la cámara la abrió el formulario de una sesión, `resolveCoach` le devuelve las series y vuelve atrás;
  - si no, ofrece guardarla como una sesión nueva en Entrenos.

---

## Ayuda por pantalla (`features/help/`)

### `guides.js` — el contenido
- `img`: las capturas reales de cada pantalla (`mobile/assets/help/*.jpg`), cargadas con `require` para que Expo las incluya en la app.
- `guide(key, title, intro, steps)` y `step(icon, title, text)`: arman cada guía con su título, una frase y los pasos con su ícono.
- `GUIDES`: 17 guías (inicio de cada rol, diario, registrar comida, entrenos, progreso, perfil, datos corporales, asistente, planes, informes, cámara, catálogo, usuarios y reportes).
- **`guideFor(pathname, role)`**: elige la guía según la ruta. En `/` depende del rol (`home-athlete`, `home-coach`, `home-admin`); en las demás usa el primer tramo de la ruta (`/diary-entry` → `diary-entry`).

### `HelpContext.jsx` — cuándo se abre
- `store`: en la web usa `localStorage`; en el celular, `SecureStore`.
- **`HelpProvider`** (envuelve todas las pantallas en `app/(app)/_layout.jsx`):
  1. Con `usePathname` sabe en qué pantalla está y busca su guía.
  2. Arma la clave `macroentreno.help.<idUsuario>.<pantalla>`.
  3. Si esa clave no existe (primera visita de **ese** usuario a **esa** pantalla), abre la guía y guarda la clave. Así aparece una sola vez.
  4. `cancelled` evita abrirla si el usuario ya se fue a otra pantalla mientras se leía el almacenamiento.
- **`HelpButton`**: el ícono **?** del encabezado. Solo aparece si la pantalla tiene guía y la vuelve a abrir.
- **`HelpModal`**: la ventana con la captura, los pasos y el botón "Entendido". En la PC (760 px o más) pone la imagen a la izquierda y el texto a la derecha.
