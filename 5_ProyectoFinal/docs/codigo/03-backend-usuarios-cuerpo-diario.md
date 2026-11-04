# 3. Backend: usuarios, admin, datos corporales, planes del coach y diario

---

## `users/users.mapper.js`
- **`toPublicUser(row)`**: convierte una fila de la tabla `users` en lo que se envía a la app. **Nunca incluye el hash de la contraseña**. En su lugar manda `hasPassword` (si la cuenta tiene clave), además de `emailVerified`, `hasBodyProfile` (si ya cargó sus datos corporales), `isActive` convertido a booleano y las metas agrupadas en `goals`.
- **`USER_COLUMNS` / `USER_FROM`**: las columnas y el `FROM` que comparten todas las consultas de usuario. El `LEFT JOIN users c` une la tabla consigo misma para traer el **nombre del coach**.

## `users/users.schemas.js`
- `goals`: metas enteras: kcal entre 800 y 10000, proteína hasta 1000 g, carbohidratos hasta 2000 g y grasa hasta 1000 g. `.partial()` hace que todos los campos sean opcionales.
- `roleEnum`: solo `admin`, `coach` o `athlete`.
- `listUsersQuery`: página, rol y búsqueda de hasta 100 caracteres.
- `updateMeSchema`: lo que cada usuario puede cambiar de sí mismo: nombre, avatar (una URL de hasta 500 caracteres) y metas. **No incluye ni el rol ni el email**.
- `createUserSchema`: alta hecha por el admin, con las mismas reglas que el registro y un `coachId` opcional.
- `updateUserSchema`: edición hecha por el admin, todos los campos opcionales.

## `users/users.routes.js` (todas exigen estar logueado: `router.use(authenticate)`)
| Ruta | Quién | Qué hace |
|---|---|---|
| `GET /me` | todos | Devuelve el perfil propio. |
| `PATCH /me` | todos | Edita el nombre, el avatar o las metas propias. |
| `GET /` | admin y coach | Lista usuarios. Si quien pide es coach, **se le fuerza** `coachId = su id` y `role = athlete`, así solo ve a sus atletas aunque pida otra cosa. |
| `GET /:id` | admin y coach | Ver un usuario. `resolveTargetUser` comprueba que el coach solo pueda ver a sus propios atletas. |
| `PUT /:id/goals` | admin y coach | Ajusta las metas del atleta. |
| `POST /` | admin | Crea un usuario de cualquier rol (así un admin da de alta a un coach). |
| `PUT /:id` | admin | Edita un usuario. **Un admin no puede quitarse el rol ni desactivar su propia cuenta** (60-62), para que el sistema nunca quede sin administrador. |
| `DELETE /:id` | admin | Borra un usuario. Un admin no puede borrarse a sí mismo. |

## `users/users.service.js`
- **`getUser(id)`**: busca un usuario; si no existe responde 404, y si existe lo devuelve pasado por `toPublicUser`.
- **`listUsers({ page, limit, role, search, coachId })`**:
  1. Arma dos listas, `where` (condiciones) y `params` (valores), solo con los filtros que llegaron.
  2. Para buscar usa `LIKE '%texto%'` en el nombre y el email. El texto va como parámetro, así que no hay riesgo de inyección SQL.
  3. Hace una consulta para contar el total y otra para traer la página (`LIMIT` y `OFFSET = (página − 1) × límite`).
  4. Devuelve `{ data, meta }` con la información de la paginación.
- **`assertCoach(coachId)`**: si se indica un coach, comprueba que exista, que tenga el rol `coach` y que esté activo.
- **`buildUpdate(data)`**: arma de forma dinámica `SET columna = ?` **solo con los campos que llegaron**. Traduce los nombres de la app a las columnas de la base (por ejemplo, `coachId` pasa a `coach_id`) y `isActive` a 1 o 0.
- **`updateUser(id, body)`** (dentro de una transacción):
  1. Bloquea la fila del usuario con `FOR UPDATE`.
  2. Calcula el rol final. Si no es atleta, le quita el coach. Si es atleta, valida el coach.
  3. Ejecuta el `UPDATE` con los campos que cambiaron.
  4. Si cambió el coach, cierra la asignación anterior (`ended_at = NOW()`) y abre una nueva, así queda el historial de asignaciones.
  5. Si el usuario **era coach** y deja de serlo o lo desactivan, cierra todas sus asignaciones y **deja libres a sus atletas** (`coach_id = NULL`).
  6. Si se desactivó la cuenta o cambió el rol, revoca sus sesiones, para obligarlo a loguearse con los permisos nuevos.
- **`createUser(...)`**: valida el coach, guarda el hash de la contraseña y lo inserta **ya verificado**, porque lo creó un admin. Si es atleta con coach, registra la asignación.
- **`deleteUser(id)`**: hace el `DELETE`. Si no borró ninguna fila responde 404. Los datos relacionados se borran solos por `ON DELETE CASCADE`.

## `admin/admin.routes.js` — `GET /api/admin/stats` (solo admin)
1. Calcula la fecha de hace 6 días.
2. Lanza **6 consultas en paralelo** con `Promise.all`: usuarios por rol, alimentos globales y personalizados, registros del diario de la semana, entrenamientos completados de la semana, atletas sin coach y los últimos 5 usuarios.
3. Recorre los roles para sumar los totales y los usuarios activos.
4. Devuelve todo listo para el panel del administrador.

---

## Datos corporales (`modules/body`)

### `energy.js` — el cálculo nutricional (funciones puras: no tocan la base)
- **`ACTIVITY`**: factores de actividad, de 1,2 (sedentario) a 1,9 (muy activo), con sus textos para el formulario.
- **`GOALS`**: objetivos posibles:
  - déficit: −0,5 / −0,75 / −1 % del peso por semana, con 2,2 g de proteína por kg;
  - recomposición: 95 % del gasto;
  - mantenimiento: 100 %, con 1,8 g de proteína por kg;
  - volumen: +0,25 / +0,35 / +0,5 % del peso por semana.
- **`KCAL_PER_KG = 7700`**: la energía aproximada de 1 kg de tejido corporal.
- **`round(n, step)`**: redondea a 1, 10, 0,1 o 0,05 sin los errores de coma flotante (`toFixed`).
- **`ageFrom(birthDate, today)`**: resta los años y le quita 1 si este año todavía no cumplió.
- **`energyPlan(p)`**, paso a paso:
  1. Calcula la edad, la altura en metros y el **IMC** = peso / altura².
  2. Si se cargó el % de grasa, calcula la **masa magra** = peso × (1 − %grasa).
  3. **Metabolismo basal (BMR)**:
     - con masa magra usa **Katch-McArdle**: 370 + 21,6 × masa magra;
     - sin masa magra usa **Mifflin-St Jeor**: 10·peso + 6,25·altura − 5·edad, más 5 en hombres o menos 161 en mujeres.
  4. **Gasto total (TDEE)** = BMR × factor de actividad.
  5. **Calorías objetivo**:
     - si el objetivo tiene ritmo: TDEE + (%semanal × peso × 7700 / 7), es decir, el cambio de peso semanal pasado a kcal por día;
     - si no tiene ritmo: TDEE × factor (0,95 o 1).
  6. **Límites de seguridad**:
     - nunca más del 25 % de déficit;
     - nunca por debajo del basal;
     - nunca más del 20 % por encima del gasto.

     Cada vez que se aplica un límite, se agrega una nota que lo explica.
  7. **Peso de referencia para la proteína**: con masa magra, masa magra / 0,85; con obesidad (IMC ≥ 30), el peso que correspondería a un IMC de 25; en los demás casos, el peso real.
  8. **Proteína** = g/kg del objetivo (+0,2 g si es un déficit rápido) × peso de referencia.
  9. **Grasa**: entre el 25 % y el 35 % de las kcal, y como mínimo 0,8 g/kg.
  10. **Carbohidratos** = (kcal − proteína·4 − grasa·9) / 4. Son lo que queda.
  11. **Avisos**: IMC bajo con déficit, menor de 18 años, IMC ≥ 30 sin % de grasa.
  12. Devuelve la edad, el IMC y su categoría, el método usado, el BMR, el TDEE, el cambio semanal en kg, las metas, la proteína por kg, el agua (35 ml/kg) y la fibra (14 g cada 1000 kcal).

### `body.schemas.js`
- **`BODY_LIMITS`**: edad 14-101, altura 100-250 cm, peso 30-350 kg, grasa 3-60 %. La app usa exactamente los mismos.
- **`yearsSince(fecha)`**: la edad a hoy.
- **`birthDateError(value)`**: devuelve **un solo mensaje**, en este orden:
  1. el formato no es `AAAA-MM-DD`;
  2. la fecha no existe (arma la fecha en UTC y compara el mes y el día: el 31 de febrero se convertiría en marzo);
  3. la fecha es futura;
  4. la edad queda fuera de 14-101.
- **`birthDate`**: el texto pasa por `birthDateError` dentro de `superRefine`.
- **`measure(nombre, unidad, {min, max})`**: crea un validador de número con un único mensaje: vacío, "Mínimo X", "Máximo X" o "Usá como máximo un decimal" (comprueba que `v × 10` sea entero).
- **`bodyProfileSchema`**: sexo, fecha de nacimiento, altura, peso, % de grasa (opcional), actividad, objetivo y ritmo.
- **`saveBodySchema`**: lo mismo, más `applyGoals` (si las metas calculadas se copian a las del diario).
- **`weightLogSchema`**: un peso y una fecha opcional que no puede ser futura.

### `body.routes.js`
- `GET /options`: los niveles de actividad y los objetivos, con sus textos, para armar el formulario.
- `GET /`: los datos y el plan del usuario, o de un atleta si quien consulta es su coach o un admin.
- `POST /preview`: **calcula sin guardar** (la vista previa en vivo del formulario).
- `PUT /`: guarda los datos. `POST /weight`: registra una pesada.

### `body.service.js`
- **`toProfile(row)`**: si `sex` está vacío, todavía no cargó sus datos y devuelve `null`. Si no, convierte los `DECIMAL` en números.
- **`getBody(userId)`**: lee el perfil y las últimas 30 pesadas. Calcula el plan si hay perfil y da vuelta la lista de pesadas (`reverse`) para que queden de la más vieja a la más nueva, que es el orden que necesita el gráfico.
- **`saveBody(userId, data)`** (dentro de una transacción):
  1. Calcula el plan.
  2. Actualiza los datos en `users`.
  3. Guarda la pesada de hoy.
  4. Si se pidió `applyGoals`, copia las kcal y los macros calculados a las metas.
- **`logWeight(userId, {weightKg, date})`**: guarda la pesada. Si es la más reciente, también actualiza el peso actual. Una pesada vieja no pisa el peso de hoy.
- **`upsertWeight`**: `INSERT ... ON DUPLICATE KEY UPDATE`. Si ese día ya tenía una pesada, la reemplaza.

---

## Planes de alimentación del coach (`modules/coaching`)

### `coaching.routes.js`
- `planSchema`: atleta, título (2-120), notas (hasta 3000), fechas, y de 1 a 100 ítems (alimento, gramos entre 0,1 y 5000, comida, día de la semana 0-7, donde 0 significa todos los días). El `refine` exige que el fin sea posterior al inicio y que el plan dure **como máximo un año**.
- **`athleteTarget(req, id)`**: comprueba el permiso con `resolveTargetUser` y además que el destinatario sea un atleta.
- **`accessiblePlan(req)`**: busca el plan y comprueba que quien lo pide tenga acceso a ese atleta.
- **`GET /dashboard`** (solo coach): el resumen semanal de sus clientes.
  1. Calcula el lunes y el domingo de la semana.
  2. En paralelo trae: sus atletas, las kcal y comidas por día y los entrenamientos por día.
  3. Para cada atleta calcula: los días con registros, los días que cumplió la meta (±10 % de las kcal), el promedio de kcal, las sesiones completadas, las planificadas y el detalle del día elegido.
- `GET /plans`: los planes de un atleta. `POST /plans` (coach o admin): crea un plan.
- `GET /plans/:id` y `GET /plans/:id/pdf`: ver el plan o descargarlo en PDF.
- `POST /plans/:id/archive`: archiva el plan.
- `POST /plans/:id/apply` (solo el atleta dueño del plan): carga en el diario las comidas del plan para un día.

### `nutrition.service.js`
- **`getPlan(id)`**: trae el plan con los nombres del atleta y del coach, más sus ítems ordenados por día y por comida (`FIELD` ordena desayuno → almuerzo → merienda → cena → snack).
- **`listPlans(athleteId)`**: los últimos 100 planes.
- **`createPlan`** (dentro de una transacción):
  1. Junta los ids de los alimentos sin repetir (`Set`).
  2. Comprueba que existan y que sean globales o del propio atleta, para que no se puedan usar alimentos privados de otro usuario.
  3. Inserta el plan.
  4. Para cada ítem calcula `factor = gramos / porción` y guarda los macros y micronutrientes multiplicados por ese factor. Así el plan **queda fijo** aunque después se edite el alimento.
- **`archivePlan(id)`**: le pone fecha de archivado si todavía no tenía una.
- **`applyPlan(plan, athleteId, date)`**:
  1. Rechaza las fechas futuras.
  2. Calcula el día de la semana, con lunes = 1 y domingo = 7.
  3. Filtra los ítems de ese día o de "todos los días".
  4. Dentro de la transacción, bloquea el plan y comprueba que esté vigente en esa fecha.
  5. Si ya se aplicó ese día, no lo repite (devuelve `alreadyApplied`).
  6. Inserta cada comida en el diario y registra que el plan se aplicó.

---

## Diario de comidas (`modules/diary`)

### `diary.schemas.js`
- `MEALS`: desayuno, almuerzo, merienda, cena y snack.
- `createEntrySchema`:
  1. Pide la fecha, la comida y los gramos (0,1-5000), más un `foodId` **o** una carga manual (nombre y kcal).
  2. El `refine` exige que esté una de esas dos opciones.
  3. En la carga manual, los macros que falten cuentan como 0 y `checkMacros` comprueba que cierren con las calorías.
- `updateEntrySchema`: todos los campos son opcionales, también con `checkMacros`.

### `diary.routes.js`
- `GET /?date=` puede leerlo el dueño, su coach o un admin. Crear, editar y borrar es solo sobre el diario propio; el admin puede corregir cualquiera.

### `diary.service.js`
- **`toEntry(row)`**: convierte la fila al formato de la app (con micronutrientes, salvo que se pida lo contrario).
- **`scaleFood(food, grams)`**: `factor = gramos / porción`. Multiplica las kcal, los macros y los micronutrientes y redondea a 1 decimal.
- **`sum(entries, key)`**: suma un campo de todos los registros.
- **`getDay(userId, date)`**:
  1. Trae los registros del día ordenados por comida.
  2. Trae las metas del usuario.
  3. Devuelve los registros, los totales, las metas y el resumen de micronutrientes.
- **`getOwnedEntry(user, id)`**: si el registro no existe responde 404, y si es de otra persona y quien pide no es admin responde 403.
- **`createEntry(user, data)`**:
  1. Si es una carga manual, usa los valores que mandó el usuario, sin micronutrientes.
  2. Si tiene `foodId`, busca el alimento (comprobando que pueda verlo) y **calcula** los valores con `scaleFood`. El cliente no puede inventarlos.
  3. Inserta el registro y lo devuelve.
- **`updateEntry(user, id, data)`**:
  1. Comprueba que el registro sea suyo.
  2. Renombra `date` a `entry_date` (la columna).
  3. Si cambiaron los gramos de un alimento del catálogo y no mandó macros, los recalcula.
  4. Actualiza solo los campos presentes.
- **`deleteEntry`**: comprueba que el registro sea suyo y lo borra.
