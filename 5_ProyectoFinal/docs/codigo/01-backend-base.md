# 1. Backend: arranque, configuración, middlewares y utilidades

> Carpeta `backend/src`. Los números entre paréntesis son líneas del archivo.
> Patrón general de la API: **routes** (URL + permisos + validación) → **service** (lógica y SQL) → **MySQL**.

---

## `server.js` — punto de entrada del servidor

Es lo que corre `npm start`. No define rutas: prepara todo y pone la API a escuchar.

| Líneas | Qué hace |
|---|---|
| 1-6 | Importa las migraciones, el generador de informes semanales, la app Express, la configuración, la base y el estado de la IA. |
| 8 | Pide una conexión al *pool* de MySQL. Se usa `await` en el nivel superior (módulos ES). |
| 9 | Corre todas las migraciones (crea tablas/columnas que falten) y **siempre** libera la conexión con `finally`, aunque fallen. |
| 10 | Crea la app Express con todas las rutas (`createApp`, ver `app.js`). |
| 13 | `app.listen(puerto, '0.0.0.0')`: escucha en todas las interfaces de red, así el celular de la misma red WiFi puede conectarse. |
| 14-17 | Si no se pudo abrir el puerto (por ejemplo, ya está ocupado), muestra el error y cierra el proceso con código 1. |
| 18-19 | Muestra la URL de la API y el estado del asistente con IA. |

### `logAiStatus()` (23-28)
1. Pide a `aiStatus()` si hay clave de OpenAI.
2. Si no la hay, avisa que el asistente está desactivado y cómo activarlo (nunca imprime la clave).
3. Si la hay, muestra el modelo; si hay una advertencia (clave con formato raro), la muestra.

### Tareas periódicas (31-43)
- **Informes semanales (31-34):** `generateReports` llama a `generateDueWeeklyReports()` y, si falla, solo lo registra (no tira abajo el servidor). Se ejecuta una vez al arrancar y después cada hora con `setInterval`. `unref()` hace que el temporizador no impida que Node se cierre.
- **Limpieza de tokens (37-43):** borra de `refresh_tokens` los que vencieron hace más de un día. Corre al arrancar y cada 24 h.

### `shutdown()` (45-51)
Al recibir `SIGINT` (Ctrl+C) o `SIGTERM` (el sistema pide cerrar): detiene los dos temporizadores, deja de aceptar conexiones (`server.close`), cierra el pool de MySQL y termina el proceso con código 0. Es un **apagado ordenado**: no corta peticiones a la mitad.

---

## `app.js` — `createApp()`

Arma la aplicación Express sin ponerla a escuchar. Se separa de `server.js` para que los **tests** y **Vercel** (`api/`) puedan usar la misma app.

| Líneas | Qué hace |
|---|---|
| 22 | Crea la app. |
| 24 | `trust proxy`: en Vercel la petición pasa por un proxy; así `req.ip` es la IP real del usuario (lo necesita el límite de intentos de login). |
| 26 | `helmet()`: agrega encabezados HTTP de seguridad (anti-clickjacking, anti-sniffing, etc.). |
| 27 | `cors`: decide qué orígenes (dominios web) pueden llamar a la API. `*` = todos; si no, la lista separada por comas de `CORS_ORIGIN`. |
| 29 | Monta las rutas de IA **antes** del lector de JSON porque reciben fotos y audio (más pesados). |
| 30 | `express.json({ limit: '100kb' })`: convierte el cuerpo JSON en `req.body` y rechaza cuerpos gigantes. |
| 31 | `morgan('dev')`: imprime cada petición en consola (menos en los tests). |
| 33-36 | `GET /api/health`: hace `SELECT 1` para comprobar que la base responde y devuelve `status: ok`. |
| 38-48 | Monta cada módulo en su prefijo: `/api/auth`, `/api/users`, `/api/foods`, `/api/diary`, `/api/exercises`, `/api/workouts`, `/api/progress`, `/api/admin`, `/api/coaching`, `/api/body`, `/api/reports`. |
| 50 | Si ninguna ruta respondió → 404 en JSON. |
| 51 | Manejador de errores central (siempre al final). |

---

## `config/db.js` — conexión a MySQL

- **`pool` (5-12):** un *pool* reutiliza conexiones en vez de abrir una por consulta.
  - `...env.db`: host, puerto, usuario, clave, base y SSL salen del `.env`.
  - `waitForConnections` + `connectionLimit`: si están todas ocupadas, la consulta espera en fila.
  - `dateStrings: true`: las fechas llegan como texto `AAAA-MM-DD` (evita corrimientos de zona horaria).
  - `decimalNumbers: true`: los `DECIMAL` llegan como número, no como texto.
  - `charset: 'utf8mb4'`: admite tildes, ñ y emojis.
- **(15)** Cada conexión nueva fija la zona horaria de Argentina (−03:00).
- **`query(sql, params)` (18-21):** ejecuta una consulta **parametrizada** (los `?` se reemplazan de forma segura → evita inyección SQL) y devuelve solo las filas.
- **`transaction(work)` (24-37):**
  1. Toma una conexión propia.
  2. `beginTransaction()`.
  3. Ejecuta la función `work(conn)` con esa conexión.
  4. Si todo salió bien → `commit()` y devuelve el resultado.
  5. Si algo falló → `rollback()` (deshace todo) y relanza el error.
  6. `finally` → devuelve la conexión al pool.

---

## `config/env.js` — configuración desde variables de entorno

- **(1)** `dotenv/config` carga el archivo `.env` en `process.env`.
- **`required(name, devFallback)` (4-11):** devuelve la variable si existe; si falta y estamos en producción (o no hay valor por defecto) **corta el arranque** con un error claro. En desarrollo usa el valor de prueba.
- **`list(value)` (13-17):** convierte `"a, b,c"` en `['a','b','c']` (separa por coma, recorta espacios y descarta vacíos).
- **`env` (19-102):** objeto único con toda la configuración:
  - `nodeEnv`, `port`, `corsOrigin`.
  - `db`: datos de conexión; `ssl` solo si `DB_SSL=true`.
  - `dbConnectionLimit`: en Vercel conviene pocas conexiones por instancia.
  - `jwt`: secretos obligatorios en producción, vida del token de acceso (15 min) y del refresh (30 días).
  - `oauth.publicApiUrl`: URL pública de la API para armar el callback del login social (obligatoria en producción; se le quita la `/` final). `appSchemes`: a qué esquemas de app se permite volver (`macroentreno`; en desarrollo también `exp`/`exps` de Expo Go).
  - `fatsecret`, `foodSources` (Open Food Facts y USDA), `openai` (clave recortada, modelos de chat, transcripción y voz).
  - `mail`: SMTP para mandar códigos; a la clave se le quitan los espacios (Gmail la muestra en grupos de 4).
  - `allowedEmailDomains`: dominios permitidos en el registro, en minúsculas.
  - `social`: IDs y secretos de Google, Facebook y GitHub.

---

## `config/migrations.js` — migraciones automáticas

Todas son **aditivas e idempotentes**: se pueden ejecutar mil veces sin romper ni borrar datos (preguntan antes si la columna/tabla existe).

- **`runMigrations(conn)` (5-12):** llama a cada migración en orden.
- **`migrateBodyProfile` (15-35):**
  1. `SHOW COLUMNS ... LIKE 'sex'`: ¿ya existe la columna?
  2. Si no, agrega a `users`: sexo, fecha de nacimiento, altura, peso, % de grasa, nivel de actividad, objetivo y ritmo (todas opcionales `NULL`).
  3. Crea `body_weights` (historial de peso): clave primaria `(user_id, date)` → un peso por día; `ON DELETE CASCADE` → si se borra el usuario se borra su historial.
- **`migrateTypicalFoods` (41-51):**
  1. Lee `database/seeds/typical-foods.json` (99 comidas argentinas: milanesa, empanadas, asado…).
  2. Trae los nombres (en minúsculas) de los alimentos globales ya cargados.
  3. Arma un `Set` para buscar rápido y filtra los que **faltan**.
  4. Si no falta ninguno, termina.
  5. Si faltan, los inserta todos en un solo `INSERT ... VALUES ?` con sus macros y micronutrientes.
- **`migrateEmailVerification` (54-72):**
  1. Si no existe `email_verified_at`, la crea y marca como verificadas a todas las cuentas que ya existían (no se les pide código).
  2. Crea `email_codes`: guarda el **hash** del código (no el código), intentos, vencimiento; un código vigente por usuario y propósito (`verify` o `reset`).
- **`migrateOAuthLoginCodes` (75-85):** tabla de códigos de un solo uso del login social (se guardan en la base porque en Vercel cada instancia tiene su propia memoria).
- **`migrateFoodSources` (88-97):** agrega `barcode` con índice y suma `usda` a las fuentes externas posibles.
- **`migrateCoaching` (100-114):**
  1. Fija zona horaria.
  2. Lee `001-coaching.sql`, lo parte por `;` y ejecuta cada sentencia.
  3. Si `workouts` no tiene `status`, la agrega; los entrenamientos creados por otro (el coach) quedan como `planned`.
  4. Registra las asignaciones coach-atleta existentes en `coach_assignments` como "línea base", sin duplicar las abiertas.

---

## `middlewares/auth.js`

### `authenticate(req, res, next)` (8-32) — protege rutas
1. Lee el encabezado `Authorization` y lo separa en esquema y token.
2. Si no es `Bearer <token>` → 401 "Falta el token".
3. `jwt.verify` comprueba la firma con el secreto y el algoritmo permitido.
   - Token vencido → 401 `TOKEN_EXPIRED` (la app usa ese código para renovar la sesión sola).
   - Firma inválida → 401 `TOKEN_INVALID`.
4. Si el token no es de tipo `access` (por ejemplo, alguien manda un refresh) → inválido.
5. Busca al usuario en la base **en cada petición**: así un cambio de rol o una baja se aplica al instante.
6. Si no existe → 401; si está desactivado → 403.
7. Guarda `req.user = { id, role, coachId }` y sigue (`next()`).

### `authorize(...roles)` (35-40)
Función que **devuelve un middleware**. Si el rol del usuario no está en la lista → 403. Uso: `authorize('admin')`.

## `middlewares/errorHandler.js`
- **`notFoundHandler`:** responde 404 con el método y la ruta pedida.
- **`errorHandler(err, ...)`:** traduce cualquier error a `{ error: { code, message, details } }`:
  1. `ZodError` (validación) → 400 `VALIDATION_ERROR` con la lista `campo + mensaje` (la app lo muestra debajo de cada input).
  2. `HttpError` (errores propios) → su estado y código.
  3. JSON mal formado → 400; cuerpo muy grande → 413.
  4. `ER_DUP_ENTRY` (clave única de MySQL repetida) → 409.
  5. Base caída o mal configurada → 503.
  6. Cualquier otro → se registra en consola y se responde 500 **sin detalles internos** (no filtra información).

## `middlewares/validate.js` — `validate(schemas)`
Recibe esquemas zod para `params`, `query` y `body`. Para cada parte presente ejecuta `.parse()`: si los datos no cumplen, zod lanza un error (lo atrapa el errorHandler); si cumplen, deja los datos **limpios y convertidos** (por ejemplo `"5"` → `5`) en `req.valid`.

---

## `utils/access.js` — `resolveTargetUser(req, requestedUserId, { coachCan })`
Decide sobre qué usuario actúa una petición tipo "ver el diario de X":
1. Sin `userId` o con el propio id → actúa sobre uno mismo.
2. Busca al usuario pedido; si no existe → 404.
3. Admin → puede sobre cualquiera.
4. Coach → solo si la ruta lo permite (`coachCan`), el objetivo es atleta y **está asignado a ese coach**.
5. En cualquier otro caso → 403.

## `utils/dates.js`
- **`today()`**: fecha de hoy `AAAA-MM-DD`.
- **`toIsoDate(date)`**: arma el texto con año, mes (+1 porque en JS enero es 0) y día con cero adelante (`padStart`).
- **`addDays(iso, n)`**: separa la fecha, crea un `Date` sumando días (JS acomoda solo el cambio de mes/año) y la vuelve a texto.
- **`dateRange(from, to)`**: lista de todas las fechas entre dos, inclusive (para gráficos por día).

## `utils/httpError.js`
- **`HttpError`**: clase que extiende `Error` y agrega `status` HTTP, `code` de negocio y `details`.
- Atajos: `badRequest` (400), `unauthorized` (401), `forbidden` (403), `notFound` (404), `conflict` (409), `badGateway` (502, falló un servicio externo), `unavailable` (503).

## `utils/mailer.js`
- **`setMailSender(fn)`**: para los tests, reemplaza el envío real por una función que captura el email.
- **`mailConfigured()`**: `true` si hay host, usuario y clave SMTP.
- **`sendMail({ to, subject, text, html })`**:
  1. Si hay un emisor de prueba, lo usa.
  2. Sin SMTP: en producción tira 503; en desarrollo imprime el email (con el código) en la consola.
  3. Con SMTP: crea el transporte de nodemailer **una sola vez** (`??=`), con `secure` si el puerto es 465, y envía.

## `utils/validation.js` — piezas de validación reutilizables (zod)
- **`idParam`**: el `:id` de la URL convertido a entero positivo.
- **`isoDate`**: formato `AAAA-MM-DD` **y** fecha real (rechaza `2025-02-30`: al convertirla y volver a texto no da lo mismo).
- **`pagination` / `paginationMeta`**: página ≥ 1, límite 1-100 (por defecto 20); calcula el total de páginas.
- **`EMAIL_MAX` = 190** (largo de la columna), **`PASSWORD_MAX` = 72** (bcrypt ignora lo que pase de 72 bytes).
- **`emailField`**: recorta espacios, pasa a minúsculas y **después** valida formato y largo.
- **`registerEmailField`**: además exige un dominio conocido (Gmail, Outlook, Yahoo, iCloud, Proton). Si el formato ya es inválido, no repite el error.
- **`nameField`**: 2-100 caracteres, al menos una letra (`\p{L}` cualquier alfabeto) y sin caracteres de control o invisibles.
- **`passwordField`**: 8-72 caracteres, máximo 72 **bytes** (tildes y emojis ocupan más), al menos una letra y un número.
- **`loginPasswordField`**: en el login solo exige que no esté vacía y que no pase de 72 bytes.
- **`checkMacros(v, ctx, gramsKey)`**: coherencia nutricional:
  1. Si falta alguno de kcal/proteína/carbos/grasa, no controla.
  2. Si P + C + G pesan más que la porción (+0,5 g de tolerancia) → error en `fat`.
  3. Calcula `4·P + 4·C + 9·G`; si las kcal se alejan más de 30 kcal **o** del 30 % → error en `kcal` indicando el valor esperado.
