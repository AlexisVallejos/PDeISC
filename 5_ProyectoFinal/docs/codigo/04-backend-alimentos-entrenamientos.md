# 4. Backend: alimentos, fuentes externas, micronutrientes, ejercicios y entrenamientos

---

## `nutrition/micros.js` — micronutrientes
- **`MICROS`**: lista de los 11 micronutrientes que guarda la app: fibra, azúcares, grasas saturadas, colesterol, sodio, potasio, calcio, hierro y vitaminas A, C y D.
  - De cada uno guarda la clave para la API, la columna de la base, la unidad y el **valor diario de referencia** (tabla de la FDA, dieta de 2000 kcal).
  - También marca su tipo: `goal` si conviene llegar al valor diario, o `limit` si conviene no pasarse.
- **`MICRO_COLUMNS`**: solo los nombres de las columnas.
- **`microsOf(row)`**: convierte una fila a `{ fiber: 3.2, sodium: null, ... }`. Un `null` significa que el dato no se conoce, que no es lo mismo que cero.
- **`scaleMicros(food, factor)`**: multiplica cada micronutriente por el factor de porción. Los que no se conocen siguen como `null`.
- **`noMicros()`**: todas las columnas en `null`. Se usa en la carga manual, donde no se ingresan micronutrientes.
- **`summarizeMicros(rows, { days })`**: arma el resumen de un día o de un período. Para cada micronutriente:
  1. Junta solo los registros que traen el dato.
  2. Los suma y, si se pidió un promedio, divide por la cantidad de días.
  3. Calcula el **% del valor diario**.
  4. Informa la **cobertura**: en cuántos registros, del total, se conocía el dato.

  Lo desconocido no se cuenta como 0: queda afuera y se informa aparte, así el total no se subestima.

---

## `foods/foods.schemas.js`
- `barcode`: de 6 a 14 dígitos.
- `macro`: un número entre 0 y 5000.
- `listFoodsQuery`: página, búsqueda, categoría y alcance (`all`, `global` o `mine`).
- `foodFields`:
  - nombre de 2 a 150 caracteres, categoría hasta 60, marca hasta 80;
  - porción de 0,1 a 5000 g (100 g si no se indica);
  - macros;
  - código de barras;
  - `isGlobal`, que indica si el alimento va al catálogo de todos.
- `foodSchema`: los campos anteriores más `checkMacros`, que valida contra la porción.
- `updateFoodSchema`: igual que el anterior, pero sin `isGlobal` (no se puede cambiar el dueño) y con todos los campos opcionales.
- Esquemas de búsqueda e importación:
  - para FatSecret, USDA y Open Food Facts: la búsqueda entre 2 y 100 caracteres;
  - los ids solo con números.

## `foods/foods.routes.js` (todas exigen estar logueado)
| Ruta | Qué hace |
|---|---|
| `GET /` | Devuelve el catálogo que el usuario puede ver (paginado y con búsqueda). |
| `GET /categories` | Lista las categorías del catálogo global. |
| `GET /fatsecret/search` y `POST /fatsecret/import` | Buscan en FatSecret e importan un alimento. |
| `GET /external/search` y `POST /external/import` | Buscan en Open Food Facts o USDA e importan un alimento. |
| `GET /barcode/:code` | Busca un producto por su código de barras. |
| `GET /:id`, `POST /`, `PUT /:id`, `DELETE /:id` | El CRUD de alimentos. |

## `foods/foods.service.js`
- **`toFood(row)`**: convierte la fila al formato de la app. `isGlobal` vale verdadero cuando el alimento no tiene dueño (`owner_id IS NULL`). Agrega los micronutrientes y el origen (de qué base externa vino).
- **`buildSearch(search)`** — búsqueda rápida con un índice **FULLTEXT**:
  1. Saca los caracteres especiales del modo booleano de MySQL, para que no rompan la consulta.
  2. Divide el texto en palabras.
  3. Las palabras de 3 o más letras se buscan con `MATCH ... AGAINST ('+pollo* +cocido*')`. El `+` exige que la palabra esté y el `*` acepta lo que empiece así.
  4. Las palabras de menos de 3 letras se buscan con `LIKE '%xx%'`, porque el índice FULLTEXT las ignora.
- **`listFoods(user, filtros)`**:
  1. Según el alcance, filtra los alimentos globales, los propios o ambos.
  2. Agrega la categoría y la búsqueda.
  3. Cuenta el total y trae la página.
- **`listCategories()`**: las categorías distintas del catálogo global.
- **`getFood(user, id)`**: devuelve el alimento si existe y el usuario puede verlo (es global, es suyo o el usuario es admin). Si es privado de otra persona, responde **404 y no 403**, para no revelar que existe.
- **`assertCanEdit(user, row)`**: el catálogo global solo lo editan coaches y admins; un alimento propio, su dueño o un admin.
- **`createFood(user, data)`**:
  1. Un atleta no puede crear alimentos globales.
  2. El dueño queda en `null` si el alimento es global, o es el propio usuario si es personal.
  3. Inserta solo las columnas que llegaron.
- **`updateFood` / `deleteFood`**: buscan el alimento, comprueban el permiso y lo modifican o lo borran.
- **`saveExternalFood(user, source, food)`**:
  1. Recorta el nombre y la marca al largo de las columnas.
  2. Hace un `INSERT ... ON DUPLICATE KEY UPDATE`: si ese alimento externo ya se había importado (la clave única es fuente + id externo), **actualiza sus valores en vez de duplicarlo**.
  3. Lo devuelve.
- **`importFatSecretFood`**: trae el detalle del alimento desde FatSecret y lo guarda.
- **`searchExternal(source, search)`**: busca en USDA o en Open Food Facts y agrega a cada resultado cuántos micronutrientes informa.
- **`importExternal(user, source, id)`**: trae el alimento por su id y lo guarda. Si no existe, responde 404.
- **`findByBarcode(user, barcode)`**:
  1. Busca primero en el catálogo, priorizando los alimentos propios.
  2. Si no lo encuentra, lo busca en Open Food Facts y, si aparece, **lo guarda**, así el próximo escaneo ya no consulta afuera.
  3. Si no aparece en ningún lado, devuelve `found: false` y la app ofrece cargarlo a mano.

## `foods/fatsecret.js` — cliente de FatSecret (OAuth 1.0)
- **`setFatSecretFetch(fn)`**: los tests reemplazan `fetch` para no salir a internet.
- **`enc(value)`**: codificación RFC 3986, que además codifica `! ' ( ) *`. La firma OAuth 1.0 la exige así.
- **`signedQuery(params)`** — firma la petición:
  1. Agrega los parámetros OAuth: la clave, un `nonce` aleatorio (para que dos peticiones nunca sean iguales), el método `HMAC-SHA1`, la hora y la versión.
  2. Ordena los parámetros alfabéticamente y los codifica.
  3. Arma la "base de la firma": `GET&url&parámetros`.
  4. Calcula el HMAC-SHA1 con el secreto y lo agrega como `oauth_signature`.
- **`call(method, params)`**:
  1. Si no hay claves configuradas, responde 503.
  2. Agrega la región y el idioma si están configurados.
  3. Hace la petición con un límite de 10 segundos.
  4. Si falla la red, o FatSecret devuelve un error, responde 502 y guarda el código de error de FatSecret.
- **`list` / `num` / `round`**: ayudas. FatSecret devuelve un objeto cuando hay un solo resultado y un array cuando hay varios; `list` lo convierte siempre en array.
- **`metricGrams(serving)`**: los gramos de la porción. Toma g o ml tal cual (los ml se toman como gramos) y convierte las onzas a gramos.
- **`baseServing(servings)`**: elige la porción de 100 g; si no existe, la porción por defecto; si tampoco, la primera que tenga medida.
- **`normalize(food)`**: lleva todos los valores a **100 g** (`factor = 100 / gramos de la porción`) y les da el formato de la tabla `foods`.
- **`searchFoods(search)`**:
  1. Prueba `foods.search.v5`.
  2. Si responde el error 10 (método no disponible en el plan gratuito), usa `foods.search` y pide el detalle de cada resultado **en paralelo**.
  3. Normaliza los resultados, descarta los que no tienen porción en gramos y cuenta los micronutrientes de cada uno.
- **`getFoodDetail(id)`**: trae el detalle de un alimento. Si no informa gramos, responde 400.

## `foods/openfoodfacts.js` — productos envasados (gratis, sin clave)
- **`get(url)`**:
  1. Hace la petición con su propio User-Agent, que es lo que pide Open Food Facts.
  2. Si responde 404, devuelve `null`.
  3. Si falla, responde 502.
- **`num`, `round`, `scaled`**: Open Food Facts informa los minerales en gramos; `scaled` los pasa a mg o µg.
- **`MAX_PER_100G` + `plausible()`**: descartan los valores imposibles. Los cargan voluntarios y a veces se equivocan de unidad, como "11 g de colesterol" en un alfajor.
- **`normalizeProduct(product)`**:
  1. Toma las kcal. Si no están, las calcula desde los kJ (÷ 4,184).
  2. Usa el nombre en español o, si no hay, el nombre general. Si no hay nombre o no hay kcal, descarta el producto.
  3. Toma la primera marca.
  4. Si la cantidad dice ml, l o cl, marca el producto como líquido ("por 100 ml").
  5. Devuelve los macros y los micronutrientes cada 100 g.
- **`getProductByBarcode(code)`**: busca el producto por su código.
- **`searchProducts(search)`**: busca primero **productos vendidos en Argentina**; si no hay ninguno, busca en todo el mundo.

## `foods/usda.js` — alimentos genéricos de EE. UU. (gratis, con clave)
- **`call(path, body)`**: GET o POST con la `api_key`. Si responde 429 (se superó el límite de consultas), devuelve un mensaje claro.
- **`NUTRIENTS`**: el número de cada nutriente en USDA, por ejemplo 291 = fibra y 307 = sodio.
- **`nutrientMap(food)`**: la búsqueda y el detalle devuelven los nutrientes con formatos distintos. Esta función los unifica en un `Map` por número.
- **`normalizeFood(food)`**:
  1. Busca las kcal en los nutrientes 208, 957 o 958, o las calcula desde los kJ (268).
  2. Si no las encuentra, descarta el alimento.
  3. Toma las proteínas (203), los carbohidratos (205) y las grasas (204).
  4. Mapea los micronutrientes.
- **`searchFoods(search)`**: busca solo en los tipos "Foundation" y "SR Legacy", que son análisis de laboratorio.
- **`getFood(fdcId)`**: el detalle de un alimento por su id.

---

## `exercises/exercises.routes.js` — catálogo de ejercicios
- `toExercise(row)`: convierte los nombres de la base al formato de la app.
- `exerciseSchema`:
  - nombre de 2 a 120 caracteres;
  - grupo muscular de 2 a 40;
  - equipamiento hasta 60;
  - una URL de imagen válida.
- `getExercise(id)`: busca el ejercicio. Si no existe, responde 404.
- `GET /`: lista los ejercicios, con filtro por grupo muscular y búsqueda por nombre (`LIKE`), ordenados por grupo y nombre.
- `GET /muscle-groups`: los grupos musculares, sin repetir.
- `POST /` y `PUT /:id` (coach o admin): insertan o actualizan solo los campos que llegaron.
- `DELETE /:id` (**solo admin**): borra el ejercicio. Afecta a todos los usuarios.

## `workouts/workouts.schemas.js`
- `setSchema`:
  - repeticiones de 1 a 1000, enteras;
  - peso de 0 a 2000;
  - RPE de 1 a 10, opcional.
- `exerciseSchema`:
  - un ejercicio del catálogo (`exerciseId`) **o** un nombre libre;
  - notas hasta 500;
  - de 1 a 30 series.
- `workoutSchema`:
  - fecha y estado (`planned` o `completed`);
  - título de 2 a 120 caracteres y notas hasta 1000;
  - `userId` opcional, para que el coach cargue la sesión a un atleta;
  - de 1 a 30 ejercicios.
- `listQuery`: rango de fechas y un límite de 1 a 200.

## `workouts/workouts.routes.js`
- `GET /`: las sesiones del usuario, o de un atleta si quien pide es su coach o un admin.
- `GET /:id`: busca la sesión y comprueba el permiso sobre su dueño.
- `POST /`:
  1. Decide para quién es la sesión.
  2. Si un atleta carga una sesión para una fecha futura, se guarda como **planificada**.
- `PUT /:id`:
  1. Solo **el propio atleta** puede cambiar el estado: confirma que la hizo.
  2. No se puede marcar como completada una sesión futura.
- `DELETE /:id`: comprueba el permiso y la borra.

## `workouts/workouts.service.js`
- **`hydrate(workoutRows)`** — evita el problema **N+1**: en vez de hacer una consulta por cada sesión, hace solo 2 en total.
  1. Trae todos los ejercicios de esas sesiones (`IN (?)`), junto con su grupo muscular y su imagen.
  2. Trae todas las series de esos ejercicios.
  3. Agrupa las series por ejercicio en un `Map`.
  4. Agrupa los ejercicios por sesión en otro `Map`.
  5. Arma el objeto final de cada sesión.
- **`SELECT_WORKOUT`**: la consulta base, que trae además el nombre de quien creó la sesión.
- **`listWorkouts(userId, { from, to, limit })`**: filtra por usuario y por fechas, ordena de la más nueva a la más vieja y le aplica `hydrate`.
- **`getWorkoutRow(id)`**: devuelve la fila de la sesión o responde 404. **`getWorkout(id)`**: la sesión completa, ya hidratada.
- **`insertExercises(conn, workoutId, exercises)`**:
  1. Busca los nombres de los ejercicios del catálogo que se usaron.
  2. Por cada ejercicio:
     - si el id no existe, lo deja en `null`;
     - usa el nombre libre o el del catálogo;
     - lo inserta con su posición.
  3. Inserta todas las series de ese ejercicio juntas, en un solo `INSERT ... VALUES ?`.
- **`createWorkout(ownerId, creatorId, data)`** (dentro de una transacción): inserta la sesión. Si la crea otra persona (el coach), queda siempre **planificada**. Después inserta los ejercicios.
- **`replaceWorkout(id, data)`** (dentro de una transacción):
  1. Actualiza los datos generales y, si llegó, el estado.
  2. Borra los ejercicios: las series se borran solas, en cascada.
  3. Vuelve a insertar todo.
- **`deleteWorkout(id)`**: borra la sesión. Sus ejercicios y series se borran en cascada.
