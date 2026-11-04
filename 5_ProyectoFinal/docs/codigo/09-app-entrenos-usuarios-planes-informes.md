# 9. App: entrenamientos, usuarios, planes de alimentación, perfil, progreso e informes

---

## Entrenamientos (`features/workouts/`)

### `WorkoutsScreen.jsx`
La pestaña "Entrenos". Muestra `WorkoutList` sin `userId`, es decir, las sesiones del propio atleta.

### `WorkoutList.jsx` — las sesiones de una semana
1. Guarda el **lunes** de la semana que se está viendo.
2. Carga las sesiones de lunes a domingo. Si recibe `userId`, son las sesiones de ese atleta (vista del coach).
3. **`open(params)`**: abre el formulario de la sesión. Si hay `userId`, se lo pasa, así el coach carga la rutina a ese atleta.
4. **Navegación entre semanas**:
   - `‹` y `›` restan o suman 7 días.
   - Tocar el centro vuelve a la semana actual.
5. **"Nueva sesión"**: si la semana que se está viendo es la actual, usa la fecha de hoy; si no, usa el lunes de esa semana.
6. **"Entrenar con cámara"**: aparece solo para el propio atleta.
7. Las sesiones se muestran en una grilla de `WorkoutCard`.

### `WorkoutCard.jsx`
- **`volumeOf(w)`**: el volumen de la sesión, que es la suma de repeticiones × kg de todas las series de todos los ejercicios.
- La tarjeta muestra:
  - el día ("Hoy", "Ayer"…), el título y el volumen;
  - el estado: "Pendiente de realizar" o "Realizada";
  - "Asignada por <coach>", si la sesión la creó otra persona;
  - cada ejercicio con sus series en formato `10×60` (repeticiones × kg);
  - las notas.

### `ExercisePicker.jsx` — modal para elegir un ejercicio
1. Carga el catálogo de ejercicios **solo la primera vez** que se abre.
2. `groups` (`useMemo`): calcula los grupos musculares sin repetir, con "Todos" al principio.
3. `filtered`: deja solo los ejercicios del grupo elegido.
4. Hay un campo "O escribí uno nuevo…". El botón `+` se activa cuando el texto tiene 2 caracteres o más.
5. Al tocar un ejercicio, devuelve `{ exerciseId, name }`.

### `WorkoutFormScreen.jsx` — crear o editar una sesión

**Funciones auxiliares**
- `emptySet(prev)`: crea una serie nueva copiando las repeticiones y los kilos de la anterior, así cargar varias series iguales es rápido.
- `withKey(exercise)`: le da a cada ejercicio una clave única para la lista de React.
- `fromCamera(prev, counted)`: reemplaza las repeticiones por las que **contó la cámara** y conserva los kilos y el RPE que ya estaban cargados.

**Estado inicial**
- `date`: la fecha que llega por parámetro o la de hoy.
- `status`: arranca **planificada** si la sesión la carga el coach (porque hay `userId`) o si la fecha es futura. Si no, arranca **realizada**.
- `ownerId`: el atleta dueño de la sesión.

**Al editar**
Carga la sesión y pasa los números a texto para mostrarlos en los inputs.

**Funciones**
- `updateExercise(index, change)`: actualiza un ejercicio sin modificar el original (de forma inmutable, con `map`).
- `canCount`: el conteo con cámara solo está disponible en la web, para el atleta y en sus propias sesiones.
- `countWithCamera(exercise, rule)`:
  1. `requestCoach` registra qué hacer cuando la cámara termine: reemplazar las series.
  2. Si el ejercicio se mide en repeticiones, manda la cantidad objetivo.
  3. Abre `/coach/[rule]` con el nombre del ejercicio y la cantidad de series.
- `SET_INPUT`: cómo se filtra cada campo de una serie:
  - repeticiones: enteras, hasta 4 dígitos;
  - **kilos: con 2 decimales**, para poder cargar discos de 1,25 kg;
  - RPE: entero, hasta 2 dígitos.
- `updateSet(...)`: filtra el valor, actualiza esa serie y borra su error.
- **`validate()`**, con los mismos límites que el servidor:
  - título de 2 a 120 caracteres y notas de hasta 1000;
  - entre 1 y 30 ejercicios;
  - por cada serie: repeticiones entre **1 y 1000**, kilos entre 0 y 2000 y RPE entre 1 y 10. El error se guarda con la clave `"ejercicio.serie"` para mostrarlo debajo de esa fila.
- **`save()`**:
  1. Valida. Si hay errores, arriba aparece "Revisá los campos marcados".
  2. Arma el cuerpo de la petición. Si la sesión es de otro atleta, no manda el estado, porque solo el atleta puede confirmar que la hizo.
  3. Crea o actualiza la sesión y vuelve atrás.
- `remove()`: pide confirmación y borra la sesión.

**Qué se dibuja**
- Un `DateSwitcher`: si se elige una fecha futura, la sesión pasa sola a "Pendiente".
- El selector **Pendiente / Realizada**, que ve solo el atleta en sus propias sesiones.
- El título y las notas.
- Una tarjeta por ejercicio con:
  - una tabla `# | Reps | Kg | RPE` y un botón para quitar cada serie (la última no se puede quitar);
  - los botones "Agregar serie" y **"Contar con cámara"**.
- "Agregar ejercicio" abre el `ExercisePicker`. Cada ejercicio nuevo arranca con 3 series.

---

## Usuarios (`features/users/`)

### `UsersScreen.jsx` — gestión de usuarios (alta, baja y edición; solo admin)
1. Tiene filtros por rol, un buscador y paginación. Cualquier cambio de filtro vuelve a la página 1 (`changeFilter`).
2. Cada fila muestra el nombre (marcado "(inactivo)" si corresponde), el email, el coach y el `RoleBadge`. Al tocarla, se abre para editar.
3. Si hay más de una página, aparecen los botones Anterior / Siguiente con "página / total".

### `UserFormScreen.jsx` — crear o editar un usuario (admin)
1. `isSelf`: indica si el admin se está editando a sí mismo. En ese caso **no puede cambiar su rol ni borrarse ni desactivarse**.
2. El rol inicial puede llegar como `coach` desde el botón "Crear entrenador".
3. Carga la lista de coaches, para poder asignarle uno a un atleta, y, si está editando, los datos del usuario.
4. **`save()`**:
   1. Valida el nombre, el email (obligatorio al crear) y la contraseña (solo al crear).
   2. Si el rol no es atleta, `coachId` se manda en `null`.
   3. Crea o actualiza el usuario. Si el servidor responde 409, muestra "Ya existe un usuario con ese email".
5. **`remove()`**: pide confirmación y avisa que también se borran el diario y los entrenamientos.
6. **Qué se dibuja**:
   - el nombre, el email y la contraseña inicial;
   - `Chips` para elegir el rol, con la explicación de qué puede hacer cada uno;
   - si es atleta, `Chips` con los coaches **activos**;
   - un botón para ver el seguimiento del atleta;
   - el interruptor "Cuenta activa".

### `AthleteDetailScreen.jsx` — un atleta visto por su coach
1. Carga el atleta. El diario se carga **solo cuando se abre la pestaña Diario**: si no, devuelve `null`.
2. Muestra un encabezado con un avatar hecho con la inicial del nombre, el nombre, el email y el rol.
3. Tiene 5 pestañas:
   - **Semana**: `WeeklyReview`. Al tocar un día, salta al Diario en esa fecha.
   - **Diario**: `DiaryDay` en **solo lectura**.
   - **Rutinas**: `WorkoutList` del atleta, con el botón "Asignar rutina".
   - **Progreso**: `ProgressView`.
   - **Objetivos**: `GoalsForm`, que guarda con `updateGoals`.
4. Tiene botones para ir al plan de alimentación y a los informes PDF de ese atleta.

### `GoalsForm.jsx` — metas diarias (lo usan el perfil del atleta y el coach)
1. `toForm`: convierte las metas en textos para los inputs.
2. Los campos solo aceptan dígitos, hasta 5 (`digits(5)`).
3. **`save()`**:
   1. Valida que sean enteros, con **kcal entre 800 y 10000**, proteína hasta 1000 g, carbohidratos hasta 2000 g y grasa hasta 1000 g.
   2. Controla la **coherencia**: 4·P + 4·C + 9·G tiene que dar las kcal, con un margen de ±15 %.
   3. Llama a `onSave` con los números redondeados. Si sale bien, el botón muestra "Guardado ✓".
4. Quien usa el formulario le pasa `key={id}`, así se reinicia cuando cambia de usuario.

---

## Planes de alimentación (`features/nutrition/`)

### `NutritionPlansScreen.jsx` — ver los planes
- `WEEKDAYS`: los días, con el índice 0 = "Todos los días".
- `weekday`: el día de la semana de la fecha elegida, de 1 a 7, donde 7 es el domingo.
- `run(fn)`: una función auxiliar que activa `busy` y muestra el error si algo falla.
- **`apply(plan)`**:
  1. Pide confirmación al atleta.
  2. Llama a `applyPlan`, que copia al diario las comidas de ese día.
  3. Avisa cuántas comidas agregó, o que el plan ya se había aplicado.
- Por cada plan muestra:
  - el título, el atleta y el coach;
  - la vigencia, y si está fuera de vigencia para la fecha elegida;
  - las indicaciones;
  - el **menú del día**: las comidas de "todos los días" más las de ese día;
  - el total del día.
- Botones:
  - "Agregar estas comidas a mi diario" (solo el atleta; se desactiva si el plan no está vigente o si la fecha es futura);
  - "Descargar plan completo en PDF";
  - "Archivar plan" (solo el coach o el admin).

### `NutritionPlanFormScreen.jsx` — crear un plan (coach)
1. Estado:
   - el título y las notas;
   - las fechas: hoy y 27 días después;
   - los ítems del menú;
   - el día y la comida elegidos;
   - el buscador.
2. Busca en el catálogo global solo cuando se toca "Buscar" (`searchTerm`).
3. `setGrams(index, valor)`: filtra el número y borra el error de ese ítem.
4. **`validate()`**, con las mismas reglas que el servidor:
   - fechas válidas, el fin no anterior al inicio y como máximo un año;
   - título de 2 a 120 caracteres y notas de hasta 3000;
   - de 1 a 100 alimentos, cada uno con una cantidad de entre 0,1 y 5000 g.
5. **`save()`**: valida y crea el plan con `createPlan`. Convierte la coma de los gramos en punto.
6. **Qué se dibuja**:
   - las indicaciones, con un contador `n/3000`;
   - las fechas con **máscara** `AAAA-MM-DD`;
   - `Chips` del día y de la comida;
   - el buscador; cada resultado se agrega al menú con un toque;
   - la lista del menú, con su cantidad editable y un botón "Quitar".

---

## Perfil (`features/profile/`)

### `ProfileScreen.jsx`
- Muestra un encabezado con la foto (o la inicial), el nombre, el email y el rol.
- **Opciones**: el selector de tema y un acceso al asistente con IA.
- **Datos personales**:
  - para editar el nombre, con la misma validación que el registro;
  - el botón "Guardar nombre" se activa solo si el nombre cambió.
- **Mis objetivos diarios** (solo el atleta):
  - el botón "Calcular con mi peso y objetivo" lleva a `/body`;
  - `GoalsForm`;
  - un aviso de que su coach también puede ajustar las metas.
- **Enlaces**:
  - "Mis alimentos";
  - "Cambiar contraseña", o "Crear contraseña" si la cuenta es de una red social;
  - "Cerrar sesión", que pide confirmación.
- El pie muestra la versión de la app y la URL de la API.

### `ChangePasswordScreen.jsx`
1. Si la cuenta ya tiene contraseña, pide la actual.
2. La nueva tiene que ser fuerte y **distinta de la actual**, y las dos repeticiones tienen que coincidir.
3. Llama a `changePassword` y avisa: "Se cerró la sesión en tus otros dispositivos".

---

## Progreso e informes

### `progress/ProgressScreen.jsx`
Muestra un botón a los informes PDF, `WeeklyReview` (la semana en curso) y `ProgressView`.

### `progress/ProgressView.jsx`
1. Tiene un selector de rango: 7, 14 o 30 días. Carga el progreso del usuario o del atleta indicado.
2. Muestra 4 `StatTile`: kcal promedio, proteína promedio, días en objetivo y sesiones.
3. **Gráfico de calorías**: con 30 días muestra **un día de cada dos**, para que entren las barras. Abajo tiene la leyenda de colores (`Legend`).
4. Muestra los micronutrientes como promedio diario.
5. **Fuerza**: por cada ejercicio, el mejor peso y cuántas sesiones tiene. También la **diferencia de volumen** con la sesión anterior: verde si subió, rojo si bajó, o "1ra vez".

### `reports/WeeklyReview.jsx` — vista previa de una semana
1. Botones Anterior y Siguiente. Siguiente se desactiva en la semana actual.
2. Si la semana todavía no terminó (`partial`), avisa que el PDF se genera al cerrar el domingo.
3. Muestra:
   - contadores: días con comidas, sesiones y días en objetivo;
   - el gráfico de la semana con los promedios;
   - la **comparación con la semana anterior**: sesiones, volumen y el cambio de peso máximo en cada ejercicio;
   - el **detalle por día**. Si se pasó `onSelectDate`, tocar un día lo abre en el diario.

### `reports/WeeklyReportsScreen.jsx` — informes guardados
1. Lista los informes. Cada uno es **desplegable**:
   - `toggle(id)` lo abre o lo cierra;
   - el detalle se pide al servidor **solo la primera vez** y se guarda en `details`.
2. El detalle muestra el resumen, la evaluación, cada día y los botones "Descargar PDF semanal" y "Cerrar".
3. "Generar última semana cerrada": pide generar el informe y recarga la lista.

### `reports/CoachReportsScreen.jsx` — informe mensual de los coaches (admin)
- **`shiftMonth(AAAA-MM, ±1)`**: cambia de mes. `new Date` resuelve solo el paso de un año a otro.
- Hay botones de mes anterior y siguiente. **No se puede ir a meses futuros.**
- Accesos: "Crear entrenador" y "Asignar atletas".
- "Descargar reporte de todos los entrenadores": el PDF general.
- Una tarjeta por coach con:
  - los clientes atendidos, los nuevos y los clientes al cierre;
  - la actividad: comidas y sesiones;
  - las rutinas y los planes que creó;
  - los botones "Descargar PDF del entrenador" y "Editar entrenador".
- Al final explica cómo se calcula cada número (la metodología).
