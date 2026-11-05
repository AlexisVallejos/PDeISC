# 8. App: pantallas de inicio, diario de comidas y catálogo

> Casi todas las pantallas cargan sus datos de la misma forma, con `useResource(...)`:
> - si falló y no hay datos, muestran `ErrorState` (con un botón "Reintentar");
> - mientras cargan, muestran `Loading`;
> - con los datos, muestran el contenido dentro de `<Screen>`, donde se puede tirar hacia abajo para recargar.

---

## Inicio según el rol (`features/home/`)

### `AdminHome.jsx` — panel del administrador
1. Carga `adminApi.stats()`.
2. Muestra un banner del asistente.
3. Muestra la tarjeta **"Gestión de entrenadores"** con tres botones:
   - "Reportes mensuales";
   - "Crear entrenador": abre el formulario de usuario con el rol ya en `coach`;
   - "Asignar atletas a entrenadores".
4. Muestra 8 `StatTile`:
   - usuarios, atletas, entrenadores y atletas sin coach;
   - comidas y sesiones de los últimos 7 días;
   - alimentos globales y personales.
5. Lista los últimos 5 usuarios con su `RoleBadge`. Al tocar uno, se abre para editarlo.

### `AthleteHome.jsx` — inicio del atleta
1. Carga **dos cosas en paralelo** con `Promise.all`: el diario de hoy y el progreso de los últimos 7 días.
2. Saluda con el primer nombre (`name.split(' ')[0]`) y muestra el nombre de su entrenador.
3. Muestra dos `QuickAction`: "Registrar comida" y "Nueva sesión". Cada uno abre su formulario con la fecha de hoy.
4. Si el atleta todavía no cargó sus datos corporales (`!user.hasBodyProfile`), muestra la tarjeta "Calculá tus calorías y macros", que lleva a `/body`.
5. Muestra un acceso al asistente y los botones "Mi plan de alimentación" y "Mis informes semanales".
6. Muestra una grilla con:
   - la tarjeta "Hoy", con `MacroSummary`;
   - la tarjeta "Últimos 7 días", con `KcalBarChart` y el texto "X de Y días en objetivo · N sesiones".
- **`QuickAction`**: una tarjeta que se puede tocar, con un ícono en un círculo y el texto. Tiene una versión destacada en verde.

### `CoachHome.jsx` — tablero del entrenador
1. Estados: `search` (lo que se escribe en el buscador) y `date` (el día elegido). Carga `coachingApi.dashboard(date)`.
2. Filtra los clientes **en el celular**, sin pedir de nuevo al servidor: se queda con los que tienen el texto buscado en el nombre o el email.
3. Muestra un `DateSwitcher` para cambiar el día. Al cambiarlo, borra los datos (`setData(null)`) para no mostrar los del día anterior mientras carga.
4. Muestra el título "Semana del …" y 3 contadores: clientes, clientes con comidas ese día y sesiones de la semana.
5. Muestra una tarjeta por cliente con:
   - las kcal y la proteína del día;
   - los días con comidas, los días en objetivo, las sesiones realizadas y las pendientes;
   - un botón "Ver seguimiento", que abre `/athlete/:id`.

---

## Diario de comidas (`features/diary/`)

### `DiaryScreen.jsx` — la pestaña Diario
1. Guarda la fecha elegida y carga `diaryApi.day(date)`.
2. **`handleDelete(entry)`**: pide confirmación, borra el registro y recarga. Si falla, muestra un aviso.
3. **`changeDate`**: borra los datos y cambia la fecha.
4. Dibuja `DiaryDay` y le pasa tres funciones:
   - `onAdd(meal)`: abre el formulario con la comida ya elegida;
   - `onEdit(entry)`: abre el formulario con el id del registro;
   - `onDelete`.

### `DiaryDay.jsx` — un día del diario (lo usan el atleta, que puede editarlo, y el coach, que solo lo lee)
1. `byMeal`: separa los registros por comida: desayuno, almuerzo, merienda, cena y snack.
2. En modo solo lectura (`readOnly`), el coach ve únicamente las comidas que tienen registros.
3. `summary`: el resumen de macros y la tarjeta de micronutrientes. Con `Columns`, en la PC va **a la izquierda** y las comidas a la derecha.
4. Muestra una tarjeta por comida:
   - en el título: las kcal de esa comida, sumadas con `reduce`, y un botón `+` (solo si se puede editar);
   - una fila por alimento, con su nombre, los gramos y `MacroInline`;
   - al tocar la fila se edita; el ícono de tacho la borra.

### `DiaryEntryScreen.jsx` — registrar o editar una comida (la pantalla más completa)

**Constantes y funciones auxiliares**
- `EXTERNAL`: el texto de ejemplo y la ayuda de Open Food Facts (`off`) y de USDA.
- `MICRO_PREVIEW` / `microPreview(food, grams)`: muestra los micronutrientes que **se conocen** del alimento, calculados para los gramos elegidos.
- `scale(food, grams)`: calcula `factor = gramos / porción` y con eso las kcal y los macros de esa cantidad.

**Estado principal**
- `meal`: la comida elegida.
- `mode`: de dónde se toma el alimento: `catalog`, `off`, `usda`, `fatsecret`, `manual` o `photo`.
- `search` y `results`: lo que se busca y lo que se encontró.
- `food`: el alimento elegido.
- `form`: los gramos, o los macros si es carga manual.
- `original`: los valores originales cuando se edita, para saber qué cambió.

**Efectos**
1. **Edición** (cuando llega un `id`):
   1. Carga el día y busca el registro. Si no existe, muestra un error.
   2. Pone la pantalla en modo `manual` y completa el formulario.
   3. Guarda una copia en `original`.
2. **Búsqueda en el catálogo, con *debounce***: espera 300 ms después de la última tecla para buscar, así no hace una petición por cada letra. Si el texto cambia antes, cancela el temporizador.
3. **Búsqueda en FatSecret**: pide al menos 2 letras y espera 500 ms, porque es un servicio externo.

**Funciones**
- `searchExternal()`: Open Food Facts y USDA **buscan solo al tocar "Buscar"**, para respetar los límites de uso de esas bases.
- `pickExternal(item)` / `pickFatSecret(item)`: **importan** el alimento al catálogo, lo dejan elegido y completan los gramos con la porción del envase o con 100. Mientras importa, la fila muestra una ruedita.
- `changeMode(next)`: limpia los resultados y el alimento elegido, y cambia de modo.
- `NUMERIC` + `set(key)`: cada campo numérico pasa por el filtro `decimal()`, que **no deja tipear** letras ni un segundo decimal. Al escribir, se borra el error de ese campo.
- `visible`: en FatSecret, con menos de 2 letras, no se muestran resultados viejos.
- `searchable`: verdadero cuando se está eligiendo un alimento, es decir, no es carga manual ni foto.
- `preview` (`useMemo`): las kcal y los macros calculados para los gramos escritos. Solo se recalculan cuando cambian el alimento o los gramos.
- **`save()`**:
  1. **Si se eligió un alimento**:
     - exige que haya uno elegido;
     - valida los gramos (mayores a 0 y hasta 5000);
     - manda solo `foodId` + `grams`, porque **los macros los calcula el servidor**.
  2. **Si es carga manual**:
     - valida los números: los gramos y las kcal son obligatorios; los máximos son 5000 g y 10000 kcal;
     - si los números están bien, controla la **coherencia** entre los macros y las calorías (`validateMacroConsistency`). **Excepción:** al editar un registro que viene del catálogo no se controla, porque si solo cambiaste los gramos el servidor recalcula los macros;
     - valida el nombre (de 2 a 150 caracteres);
     - si hay errores, los muestra y no envía nada.
  3. **Si se está editando**: manda **solo lo que cambió**. Si cambiaron únicamente los gramos, el servidor recalcula los macros.
  4. Llama a `create` o `update` y vuelve atrás. Si el servidor responde con errores, los muestra debajo de cada campo.
- `remove()`: pide confirmación, borra el registro y vuelve.

**Qué se dibuja**
- Un pie fijo con los botones "Eliminar" y "Agregar" (o "Guardar cambios").
- El selector de comida (`Chips`).
- Dos accesos rápidos (`QuickTile`): **Foto con IA** y **Asistente**. (El escáner de código de barras se quitó: solo servía para productos envasados y no para comidas.)
- El selector "Buscar en": Mi catálogo, Open Food Facts, USDA, FatSecret o Carga manual.
- Según el modo:
  - la tarjeta de la foto (`FoodPhotoCard`);
  - el buscador con sus resultados, o la tarjeta del alimento elegido con la cantidad y la vista previa de los macros;
  - el formulario manual.
- Si el catálogo no encuentra nada, ofrece **buscar lo mismo en FatSecret**.

### `FoodPhotoCard.jsx` — foto del plato con IA
- `CONFIDENCE`: el texto que se muestra según la confianza del análisis.
- `scaled(item)`: recalcula los macros de cada alimento para los gramos que eligió el usuario.
- `choose(source)`:
  1. Abre la cámara o la galería con `pickImage`.
  2. Guarda la imagen y la analiza enseguida.
- `analyze(img)`:
  1. Llama a `aiApi.foodPhoto(imagen, aclaración)`.
  2. Convierte cada alimento detectado en un ítem editable: `{ base, grams, include: true }`.
- `update(key, patch)`: modifica un ítem (los gramos, o si se incluye o no).
- `gramsError`: los gramos pueden ser como máximo 5000.
- `chosen`: los ítems marcados, con gramos válidos.
- `total`: la suma de las kcal y los macros de los ítems elegidos.
- `save()`: crea un registro en el diario por cada ítem elegido y vuelve.
- **Qué se dibuja**:
  - sin foto: una explicación y los botones "Sacar foto" y "Galería";
  - con foto:
    1. la imagen y la descripción del plato con su confianza;
    2. cada alimento con una **casilla para incluirlo o no**, sus macros y un campo para los gramos;
    3. el total y el botón "Agregar N alimentos";
    4. una **aclaración** opcional (hasta 300 caracteres, con contador) para volver a analizar, por ejemplo "la milanesa es de pollo".
  - Si la foto no es de comida, lo avisa.

---

## Catálogo (`features/catalog/`)

### `CatalogScreen.jsx` (coach y admin)
Tiene dos pestañas con `Chips`: **Alimentos**, que abre `FoodList` mostrando el catálogo global, y **Ejercicios**, que abre `ExerciseList`.

### `FoodsScreen.jsx`
"Mis alimentos" del atleta: muestra `FoodList` con sus alimentos propios.

### `FoodList.jsx` — lista paginada
1. `load(page)`:
   1. Arma la consulta con el alcance, la búsqueda y la página.
   2. Si es la página 1, **reemplaza** la lista; si no, **agrega** los resultados al final ("Cargar más").
2. `useEffect` con *debounce* de 300 ms: vuelve a cargar cuando cambia el alcance o la búsqueda.
3. `canEdit(food)`: un alimento global lo editan los coaches y admins; uno propio, su dueño o un admin.
4. **Qué se dibuja**:
   - el botón "Nuevo alimento" (el atleta ve "Crear alimento personal");
   - el filtro "Todos / Catálogo / Mis alimentos" y el buscador;
   - la lista en dos columnas en la PC. Si el alimento se puede editar, la fila abre el formulario; si no, muestra la categoría;
   - "Cargar más" si quedan páginas.

### `FoodFormScreen.jsx` — crear, editar o borrar un alimento
1. `isStaff`: el coach y el admin ven el interruptor **"Agregar al catálogo global"**, que viene activado.
2. Al editar, carga el alimento y completa el formulario.
3. `NUMERIC` + `set`: filtran lo que se tipea; los números aceptan **un solo decimal**.
4. **`save()`**:
   1. Valida los números: la porción es obligatoria y mayor a 0; todos los valores van hasta 5000.
   2. Si los números están bien, controla la **coherencia nutricional** contra la porción.
   3. Valida los textos: nombre de 2 a 150 caracteres, categoría hasta 60, marca hasta 80 y descripción hasta 120.
   4. Arma el cuerpo de la petición. Si no tiene categoría, usa "General" o "Personal".
   5. Crea el alimento, enviando `isGlobal`, o lo actualiza.
   6. Si el servidor responde con errores, los muestra debajo de cada campo.
5. `remove()`: pide confirmación y lo borra. Los registros del diario que ya lo usaban se conservan.
6. **Qué se dibuja**: una tarjeta con el nombre, la categoría y la marca, y otra con los valores de la porción. Al pie aclara cómo se controlan las calorías.

### `ExerciseList.jsx`
1. Carga los ejercicios y los agrupa por grupo muscular con `reduce`: `(acc[grupo] ||= []).push(e)`.
2. Muestra una tarjeta por grupo con la cantidad de ejercicios y la lista en dos columnas en la PC.
3. Al tocar un ejercicio, se abre para editarlo.

### `ExerciseFormScreen.jsx`
1. Carga los grupos musculares del servidor y los combina con los que trae la app (con `Set`, sin repetir).
2. Al editar, carga el ejercicio.
3. Para el grupo muscular hay `Chips` con los grupos existentes y un campo para escribir uno nuevo.
4. **`save()`**:
   1. Valida: nombre de 2 a 120 caracteres, grupo de 2 a 40, equipamiento hasta 60 y una URL `http` o `https`.
   2. Crea o actualiza el ejercicio.
   3. Si el servidor responde 409, muestra "Ya existe un ejercicio con ese nombre".
5. `remove()`: pide confirmación y lo borra. Las sesiones ya cargadas conservan el nombre del ejercicio.
