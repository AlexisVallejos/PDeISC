# 2. Backend: autenticación (`modules/auth`)

Cubre el registro con código por email, el login, la recuperación de la contraseña, las sesiones con JWT y el login con Google, Facebook o GitHub.

---

## `auth.routes.js` — las URLs de `/api/auth`

**Limitadores de intentos (contra fuerza bruta):**
- `authLimiter` (17-23): máximo 50 peticiones cada 15 minutos por IP en registro, código, recuperación y OAuth. Cuando se supera, responde 429 `TOO_MANY_REQUESTS`.
- `loginLimiter` (27-34): permite 20 intentos **fallidos** por IP. Con `skipSuccessfulRequests`, los ingresos correctos no cuentan, así que un aula que comparte la misma IP no se bloquea.

En los tests los dos límites suben a 10.000 para que no molesten.

Cada ruta sigue el mismo orden: **limitador → `validate(esquema)` → llamada al service → respuesta JSON `{ data }`**.

| Ruta | Qué hace |
|---|---|
| `POST /register` (36) | Crea la cuenta y responde 201. Devuelve `verificationRequired` o, si no hay correo configurado, la sesión. |
| `POST /verify-email` (40) | Comprueba el código y devuelve la sesión. |
| `POST /resend-code` (44) | Reenvía el código. Responde 204, sin cuerpo, exista o no la cuenta. |
| `POST /forgot-password` (49) | Manda el código para cambiar la contraseña y responde 204. |
| `POST /reset-password` (54) | Cambia la contraseña con el código y devuelve la sesión. |
| `POST /login` (58) | Comprueba email y contraseña y devuelve la sesión. |
| `GET /oauth/providers` (63) | Lista Google, Facebook y GitHub e indica si cada uno está configurado (la app oculta el botón si no lo está). |
| `GET /oauth/:provider/start` (69-81) | Inicia el login social. Ver los pasos abajo. |
| `GET /oauth/:provider/callback` (83-102) | Recibe la vuelta del proveedor. Ver los pasos abajo. |
| `POST /oauth/exchange` (104) | Canjea el código de un solo uso, junto con el verificador PKCE, por la sesión. |
| `POST /refresh` (109) | Entrega tokens nuevos a partir del refresh token. |
| `POST /logout` (113) | Revoca el refresh token de este dispositivo. |
| `POST /logout-all` (118) | Exige estar logueado. Cierra la sesión en todos los dispositivos. |
| `GET /me` (123) | Devuelve los datos públicos del usuario logueado. |
| `PUT /password` (128-132) | Cambia la contraseña. Como se cerraron todas las sesiones, entrega tokens nuevos para este dispositivo. |

**`/oauth/:provider/start`, paso a paso:**
1. Lee el proveedor de la URL y, de la query, `redirect_uri` (a dónde volver) y `code_challenge` (PKCE).
2. `getProvider` comprueba que el proveedor exista y esté configurado.
3. `assertAppRedirect` solo deja volver a la propia app. Esto evita que un atacante use la API para mandar el código a su sitio.
4. `signState` firma un "state" con el proveedor, la URI y el desafío.
5. Redirige al usuario a la pantalla de inicio de sesión de Google, Facebook o GitHub.

**`/oauth/:provider/callback`, paso a paso:**
1. Verifica la firma del `state`. Si alguien lo alteró o venció, responde error.
2. Comprueba que el proveedor de la URL sea el mismo que quedó guardado en el state.
3. Si el usuario canceló, o no llegó `code`, vuelve a la app con `error=cancelled`.
4. `fetchProfile` canjea el `code` con el proveedor y obtiene el perfil (id, email y nombre).
5. `linkSocialAccount` busca o crea al usuario.
6. `createLoginCode` genera un código de un solo uso que vale 2 minutos.
7. Redirige a la app con ese `code`.
8. Si falla cualquier paso, redirige a la app con el error, porque el usuario está en el navegador y no vería un JSON.

---

## `auth.schemas.js` — qué datos acepta cada ruta (zod)

`z.object` **descarta las claves desconocidas**. Por eso, aunque alguien mande `"role": "admin"` en el registro, ese dato nunca llega al service.

- `registerSchema`: nombre, email de un dominio permitido y contraseña fuerte.
- `code`: exactamente 6 dígitos (`/^\d{6}$/`), sin los espacios de los extremos.
- `verifyEmailSchema`: email y código. `resendCodeSchema`: email y propósito (`verify` o `reset`; por defecto `verify`).
- `forgotPasswordSchema`: email. `resetPasswordSchema`: email, código y contraseña nueva fuerte.
- `loginSchema`: email y contraseña (sin pedir fortaleza).
- `refreshSchema` y `logoutSchema`: el token, de hasta 2000 caracteres.
- `oauthParams`: solo `google`, `facebook` o `github`.
- `oauthStartQuery`: `redirect_uri` y un `code_challenge` que sea un SHA-256 en hexadecimal (64 caracteres).
- `oauthExchangeSchema`: el código y un `codeVerifier` de 43 a 128 caracteres (lo que fija el estándar PKCE).
- `changePasswordSchema`: la contraseña actual es opcional, porque una cuenta creada con red social no tiene; la nueva tiene que ser fuerte.

---

## `auth.service.js` — la lógica

- **`BCRYPT_ROUNDS = 10`**: costo del hash. Cada contraseña tarda unos milisegundos en procesarse, lo que encarece los ataques de fuerza bruta.
- **`DUMMY_HASH`**: hash de relleno. Cuando el email no existe se compara igual contra él, así la respuesta tarda lo mismo y nadie puede deducir qué emails están registrados midiendo el tiempo.
- **`findUserById(id)`**: un `SELECT` con las columnas del usuario y el nombre del coach (`USER_COLUMNS`/`USER_FROM` salen de `users.mapper.js`).
- **`session(row)`**: si la cuenta está desactivada responde 403; si no, devuelve `{ user, tokens }` con el usuario sin datos sensibles y un par de tokens nuevo.
- **`findByEmail(email)`**: busca al usuario por email.

### `register({ name, email, password })`
1. Busca si el email ya existe.
2. Si existe y **ya está verificado**, o es una cuenta social, responde 409 "Ya existe una cuenta".
3. Genera el hash de la contraseña. La contraseña nunca se guarda en texto plano.
4. Si existía una cuenta **sin verificar**, le actualiza el nombre y el hash. Así, si alguien registró tu email antes, no te bloquea: quien recibe el código es el dueño del email.
5. Si no existía, la inserta con el rol `athlete`, porque el registro público nunca crea coaches ni admins.
6. Si está en producción y no hay correo configurado, marca la cuenta como verificada y devuelve la sesión directamente.
7. Si no, manda el código y devuelve `{ verificationRequired: true, email }`.

### `verifyEmail({ email, code })`
1. Busca la cuenta. Si no existe, responde el mismo error que con un código incorrecto, para no revelar qué emails existen.
2. `consumeCode` comprueba el código.
3. Marca `email_verified_at`. `COALESCE` conserva la fecha si ya tenía una.
4. Devuelve la sesión.

### `resendCode({ email, purpose })`
Si la cuenta no existe, está desactivada o (en el caso de `verify`) ya está verificada, **no hace nada y responde igual**. Si no, manda un código nuevo.

Con el propósito `reset` también se oculta el aviso "esperá un minuto" (`CODE_RECENTLY_SENT`): si no, al pedirlo dos veces seguidas se sabría qué emails tienen cuenta.

### `forgotPassword({ email })`
Igual que el anterior, pero con el propósito `reset`. El error "ya te mandé un código hace menos de un minuto" se oculta, porque revelaría que la cuenta existe.

### `resetPassword({ email, code, newPassword })`
1. Busca la cuenta y consume el código.
2. Guarda el nuevo hash y marca el email como verificado, porque recibir el código demuestra que el email es suyo.
3. `revokeAllForUser`: cierra todas las sesiones abiertas (si alguien robó la cuenta, queda afuera).
4. Devuelve una sesión nueva.

### `login({ email, password })`
1. Busca la cuenta por email.
2. Si no existe: compara contra `DUMMY_HASH`, para gastar el mismo tiempo, y responde "Email o contraseña incorrectos".
3. Si no tiene contraseña porque es social: avisa que entre con Google, Facebook o GitHub.
4. Compara la contraseña con `bcrypt.compare`. Si no coincide, responde el mismo mensaje genérico.
5. Si el email no está verificado: reenvía el código (ignorando el aviso de "hace menos de un minuto") y responde 403 `EMAIL_NOT_VERIFIED`. La app usa ese código de error para llevar al usuario a la pantalla del código.
6. Si todo está bien, devuelve la sesión.

### `refresh(refreshToken)`
`consumeRefreshToken` valida y revoca el token usado. Después busca al usuario y entrega una sesión nueva: es la **rotación de tokens**.

### `logout(refreshToken, { allDevices, userId })`
Con `allDevices`, revoca todos los tokens del usuario; si no, solo el que recibió.

### `socialName(name)`
Recorta el nombre a 100 caracteres sin partir emojis (`Array.from` separa por carácter real). Si queda vacío, usa "Usuario".

### `linkSocialAccount(provider, profile)`
1. Si el proveedor no mandó un id de usuario, responde 400.
2. Normaliza el email (sin espacios y en minúsculas). Si es más largo de lo que entra en la columna, lo descarta.
3. Llama a `linkInTransaction`.
4. Si dos callbacks llegan a la vez, el segundo choca con la clave única (`ER_DUP_ENTRY`) y **reintenta una sola vez**.
5. Si la cuenta está desactivada, responde 403. Si no, devuelve el id.

### `linkInTransaction(provider, profile)` (dentro de una transacción)
1. ¿Ya existe el vínculo proveedor + id en `social_accounts`? Entonces devuelve ese usuario.
2. Si hay email, busca una cuenta con ese email:
   - Solo la vincula si el proveedor **verificó** el email y la cuenta es un atleta **sin contraseña**.
   - En cualquier otro caso responde 409: "Iniciá sesión con tu email y contraseña". Esto evita el robo de cuentas: alguien podría crear en Facebook una cuenta con un email ajeno sin verificarlo.
3. Si no encontró ninguna cuenta, crea un atleta con el nombre, el email (verificado solo si el proveedor lo confirmó) y el avatar.
4. Registra el vínculo en `social_accounts` y devuelve el id.

### `sessionForUser(userId)`
Devuelve la sesión de un usuario por su id. Se usa en el canje del login social.

### `changePassword(userId, { currentPassword, newPassword })`
1. Busca el hash actual.
2. Si la cuenta tiene contraseña, exige la actual y la compara. Si no coincide, responde 400.
3. Si la nueva es igual a la actual, responde 400 `SAME_PASSWORD`.
4. Guarda el hash nuevo y cierra todas las sesiones.

---

## `emailCodes.js` — códigos de 6 dígitos por email

- Constantes: el código vence a los **10 minutos**, se invalida después de **5 intentos** fallidos y hay que esperar **60 segundos** para pedir otro.
- **`hashCode(userId, purpose, code)`**: SHA-256 de `usuario:propósito:código`. En la base se guarda solo ese hash: aunque alguien la robe, no puede leer los códigos.
- **`MESSAGES`**: asunto y texto del email según sea para confirmar la cuenta o para cambiar la contraseña.

### `sendCode(user, purpose)`
1. Si se mandó un código hace menos de 60 segundos, responde 429 `CODE_RECENTLY_SENT` (anti-spam).
2. Genera el código con `crypto.randomInt`, un azar criptográficamente seguro, y lo completa a 6 dígitos con ceros adelante.
3. Borra el código anterior del mismo tipo, porque solo vale el último.
4. Guarda el hash con un vencimiento de `NOW() + 10 minutos`.
5. Manda el email en texto y en HTML. El nombre pasa por `escapeHtml` para que nadie pueda inyectar HTML en el email.

### `consumeCode(userId, purpose, code)` (en una transacción)
1. Lee el código con `FOR UPDATE`: bloquea la fila para que dos intentos simultáneos no se cuenten mal.
2. Si no existe, venció o ya tuvo 5 intentos, el resultado es inválido.
3. Si el hash no coincide, suma un intento y el resultado es inválido.
4. Si coincide, **borra** el código (un solo uso) y el resultado es válido.
5. Si el resultado fue inválido, responde 400 `INVALID_CODE`.

### `escapeHtml(value)`
Reemplaza `& < > " '` por sus entidades HTML.

---

## `oauth.js` — piezas del login social (con PKCE)

**PKCE** (Proof Key for Code Exchange): la app inventa un secreto (el *verifier*) y le manda a la API solo su hash (el *challenge*). Al final, para canjear el código, tiene que presentar el secreto original. Si otra app intercepta el código, no le sirve sin ese secreto.

- **`getProvider(name)`**: devuelve el proveedor. Si no existe responde 400; si no está configurado, 501.
- **`assertAppRedirect(uri, webOrigin)`**:
  1. Si la URI no es válida, responde 400.
  2. Si es el mismo origen web que la API, la acepta: es la app web en el mismo dominio.
  3. Si no, el esquema tiene que estar permitido (`macroentreno`, y en desarrollo también `exp`/`exps`).
  4. Con `macroentreno://` solo se permite el destino `oauth-callback`.
- **`publicOrigin(req)`** / **`callbackUrl(req, provider)`**: arman la URL pública de la API y del callback a partir de `PUBLIC_API_URL`, o del host de la petición en desarrollo.
- **`signState(data)`**: JWT de tipo `oauth_state` que vence en 10 minutos.
- **`verifyState(state)`**: verifica la firma y el tipo. Si falla, responde "La sesión de inicio expiró".
- **`createLoginCode(userId, challenge)`**:
  1. Limpia los códigos vencidos.
  2. Genera 32 bytes aleatorios en hexadecimal.
  3. Guarda el hash, el usuario, el challenge y un vencimiento de 120 segundos.
  4. Devuelve el código.
- **`consumeLoginCode(code, codeVerifier)`** (en una transacción):
  1. Busca el código por su hash con `FOR UPDATE`.
  2. Lo **borra siempre**, aunque después falle la verificación: es de un solo uso.
  3. Si no existe, venció, o `sha256(verifier)` no coincide con el challenge, responde 401.
  4. Si todo está bien, devuelve el id del usuario.
- **`appRedirect(appUri, params)`**: agrega `code` o `error` como parámetros a la URI de la app.

---

## `socialProviders.js` — Google, Facebook y GitHub

- **`fetchJson(url, options)`**: `fetch` con un tiempo límite de 10 segundos. Si no hay conexión, responde 502 `PROVIDER_UNAVAILABLE`. Devuelve `{ ok, body }`.
- **`providerError`**: 401 "Google (o el que sea) rechazó el inicio de sesión".

Cada proveedor tiene `label`, `isConfigured()` (¿hay ID y secreto?), `authorizeUrl()` y `fetchProfile()`:

| Proveedor | `authorizeUrl` | `fetchProfile` |
|---|---|---|
| **Google** | `accounts.google.com` con `scope: openid email profile` y `prompt: select_account` (siempre deja elegir la cuenta). | 1) Canjea el `code` por un `access_token` en `oauth2.googleapis.com/token` (POST de formulario con el secreto). 2) Pide `userinfo`. 3) Devuelve el id (`sub`), el email solo si `email_verified`, el nombre y la foto. |
| **Facebook** | `facebook.com/v21.0/dialog/oauth` con `public_profile,email`. | 1) Canjea el código en Graph. 2) Pide `me?fields=id,name,email,picture`. 3) Marca `emailVerified: false`, porque Facebook no informa si el email está verificado y entonces no se lo usa para vincular cuentas. |
| **GitHub** | `github.com/login/oauth/authorize` con `read:user user:email`. | 1) Canjea el código (POST JSON). 2) Pide `/user`. 3) Pide `/user/emails` y usa el email **principal y verificado**. 4) Usa el nombre o, si no tiene, el login. |

---

## `tokens.js` — JWT de acceso y de renovación

- **`JWT_ALGORITHMS = ['HS256']`**: fija el algoritmo. Se rechaza un token con otro algoritmo, incluso `none`, que es un ataque conocido.
- **`signAccessToken(user)`**: firma `{ sub: id, role, type: 'access' }` con una vida de 15 minutos.
- **`createRefreshToken(userId)`**:
  1. Firma `{ sub, type: 'refresh', jti }`. El `jti` es un UUID aleatorio, para que dos tokens nunca sean iguales.
  2. Calcula el vencimiento (30 días).
  3. Guarda en `refresh_tokens` **el hash** del token, no el token.
  4. Lo devuelve.
- **`issueTokens(user)`**: arma `{ accessToken, refreshToken, tokenType: 'Bearer', expiresIn }`.
- **`consumeRefreshToken(token)`** (la rotación):
  1. Verifica la firma y que el tipo sea `refresh`.
  2. Busca el hash en la base. Si no existe, el token es desconocido.
  3. Si **ya estaba revocado**, alguien está reusando un token viejo, posiblemente robado: se cierran **todas** las sesiones del usuario y se responde `REFRESH_REUSED`.
  4. Si no, lo marca como revocado y devuelve el id del usuario (después se emite un par nuevo).
- **`revokeRefreshToken(token)`**: revoca un token.
- **`revokeAllForUser(userId)`**: revoca todos los tokens del usuario.
