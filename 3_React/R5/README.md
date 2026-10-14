# 🔐 R5 · Usuarios con ingreso por redes sociales

Sistema con **React Router** (copia del R3) al que se le sumó **ingreso y creación de cuenta** con
**Google · Facebook (Meta) · X · GitHub · Discord · Twitch**. Sigue funcionando el ingreso con correo y contraseña.

| | |
|---|---|
| 🖥️ **Cliente** (React + Vite) | `cliente-router/` → http://localhost:5175 |
| ⚙️ **API** (Express) | `api/` → http://localhost:4005 |
| 🗄️ **Base de datos** | MySQL → `localhost:3306` |

📚 **Otros documentos:** [directorio.md](directorio.md) (qué hay en cada carpeta) · [arquitectura.md](arquitectura.md) (cómo se conecta todo)

---

## 📑 Índice

1. [🚀 Iniciar el proyecto](#-iniciar-el-proyecto)
2. [🔑 Configurar cada red](#-configurar-cada-red)
3. [🧭 Cómo funciona el ingreso](#-cómo-funciona-el-ingreso)
4. [🔒 Seguridad y reglas](#-seguridad-y-reglas)
5. [🩺 Si algo falla](#-si-algo-falla)

---

## 🚀 Iniciar el proyecto

Todos los comandos se corren desde la carpeta **`R5/`** (la que tiene `api/` y `cliente-router/`).

### ✅ Requisitos

| Necesitás | Versión | Cómo verificar |
|---|---|---|
| Node.js | 18.11 o superior | `node -v` |
| MySQL (XAMPP alcanza) | usuario `root`, sin contraseña | puerto 3306 en verde |

### 🟢 Primera vez (una sola vez)

| Paso | Qué hacer | Comando |
|:---:|---|---|
| **1** | Prender **MySQL** en el Panel de XAMPP → botón **Start** | — |
| **2** | Instalar dependencias | `npm install` <br> `cd api && npm install && cd ..` <br> `cd cliente-router && npm install && cd ..` |
| **3** | Crear el archivo de configuración | `cp api/.env.example api/.env` (macOS/Linux) o `Copy-Item api\.env.example api\.env` (PowerShell) |
| **4** | Completar `api/.env` (tabla de abajo) | — |
| **5** | Crear la base, las tablas y el administrador | `npm run seed` |

> 💡 Instalá **entrando a cada carpeta** (`cd api`…). Con `npm --prefix` npm agrega una dependencia falsa al `package.tson`.

**Qué completar en `api/.env`:**

| Variable | Qué poner |
|---|---|
| `JWT_SECRET` | un texto largo y propio. Generalo con: `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"` |
| `DB_USER` · `DB_PASSWORD` | `root` y vacío (XAMPP tal como viene) |
| `DB_NAME` | `r5` (la crea el paso 5) |
| `ADMIN_EMAIL` · `ADMIN_PASSWORD` | tu administrador. Contraseña: 8+ caracteres con mayúscula, minúscula, número y símbolo |
| Claves de las redes | las que tengas ([ver cómo obtenerlas](#-configurar-cada-red)). Las que queden vacías se ven como «Próximamente» |

### ▶️ Todos los días

```bash
npm run dev
```

Levanta la **API y el cliente juntos**. Tenés que ver estas dos líneas (el orden puede variar):

```text
[0] API en http://localhost:4005
[1]   ➜  Local:   http://localhost:5175/
```

👉 Abrí **http://localhost:5175** y entrá con el administrador (`ADMIN_EMAIL` / `ADMIN_PASSWORD`) o registrate.

### 📌 Comandos útiles

| Quiero… | Comando |
|---|---|
| Usar el sistema | prender MySQL → `npm run dev` |
| Cambiar la contraseña del admin | editar `ADMIN_PASSWORD` → `npm run seed` |
| Que se apliquen cambios del `.env` | `Ctrl + C` y `npm run dev` otra vez (la API lee el `.env` solo al arrancar) |
| Correr las pruebas | `npm test` (con MySQL prendido) |
| Compilar el cliente | `npm run build` |
| Frenar todo | `Ctrl + C` |

### 🔌 Puertos

| Puerto | Qué es |
|:---:|---|
| 3306 | MySQL |
| 4005 | API |
| 5175 | Cliente |

Son fijos: si uno está ocupado, Vite avisa en vez de cambiar de puerto. Para ver quién lo usa: `netstat -ano | findstr :5175`

---

## 🔑 Configurar cada red

> 📍 **Todas las redes usan la misma regla:** la **URL de retorno** es `http://localhost:5175/auth/<red>/callback`.
> Las claves van en `api/.env` y después hay que **reiniciar la API**.

### Resumen

| Red | Dónde se crea la app | URL de retorno | Variables del `.env` |
|---|---|---|---|
| 🔴 **Google** | console.cloud.google.com | `http://localhost:5175/auth/google/callback` | `GOOGLE_CLIENT_ID` · `GOOGLE_CLIENT_SECRET` |
| 🔵 **Facebook** | developers.facebook.com | `http://localhost:5175/auth/facebook/callback` | `FACEBOOK_APP_ID` · `FACEBOOK_APP_SECRET` |
| ⚫ **X** | developer.x.com | `http://localhost:5175/auth/x/callback` | `X_CLIENT_ID` · `X_CLIENT_SECRET` |
| ⚪ **GitHub** | github.com/settings/developers | `http://localhost:5175/auth/github/callback` | `GITHUB_CLIENT_ID` · `GITHUB_CLIENT_SECRET` |
| 🟣 **Discord** | discord.com/developers/applications | `http://localhost:5175/auth/discord/callback` | `DISCORD_CLIENT_ID` · `DISCORD_CLIENT_SECRET` |
| 🟪 **Twitch** | dev.twitch.tv/console/apps | `http://localhost:5175/auth/twitch/callback` | `TWITCH_CLIENT_ID` · `TWITCH_CLIENT_SECRET` |

Elegí una y seguí sus pasos:

<details>
<summary><b>🔴 Google</b></summary>

1. [console.cloud.google.com](https://console.cloud.google.com) → creá un proyecto → **APIs y servicios** → **Pantalla de consentimiento de OAuth** (tipo *Externo*). En modo *Prueba*, agregá tu Gmail en **Usuarios de prueba**.
2. **Credenciales** → **Crear credenciales** → **ID de cliente de OAuth** → **Aplicación web**.
3. **Orígenes autorizados de JavaScript:** `http://localhost:5175`
4. **URI de redireccionamiento autorizados:** `http://localhost:5175/auth/google/callback`
5. Copiá el ID y el secreto al `.env`.
</details>

<details>
<summary><b>🔵 Facebook (Meta)</b></summary>

Facebook Login es el inicio de sesión de Meta: **un solo botón** cubre «Facebook» y «Meta».

1. [developers.facebook.com](https://developers.facebook.com) → **Mis apps** → **Crear app** → caso de uso **Autenticar y solicitar datos de usuarios con el inicio de sesión con Facebook**.
2. **Configuración de la app → Básica:** copiá el **ID de la app** y la **Clave secreta**. En **Dominios de la app** poné `localhost`.
3. **Casos de uso → Personalizar → Permisos:** agregá **`email`** (queda «Listo para las pruebas»). Sin esto Facebook responde *Invalid Scopes: email*.
4. **Inicio de sesión con Facebook → Configuración → URI de redireccionamiento de OAuth válidos:** `http://localhost:5175/auth/facebook/callback`
5. **Roles de la app:** con la app en modo **Desarrollo** solo entran cuentas con rol (administrador, desarrollador o probador).

La cuenta de Facebook tiene que tener el **correo confirmado**; si solo tiene teléfono, Facebook no lo devuelve y no se puede entrar.
</details>

<details>
<summary><b>⚫ X (Twitter)</b></summary>

1. [developer.x.com](https://developer.x.com) → **Developer Portal** → creá un proyecto y una app.
2. **User authentication settings → Set up:**
   - **App permissions:** *Read*
   - **Type of App:** *Web App, Automated App or Bot* (cliente confidencial)
   - **Callback URI:** `http://localhost:5175/auth/x/callback`
   - **Website URL:** `https://example.com` (X rechaza `localhost` acá con «Not a valid URL format»; el campo es solo informativo)
   - Si aparece **Request email from users**, activalo.
3. **Keys and tokens → OAuth 2.0 Client ID and Client Secret:** generá y copiá los dos.

X usa PKCE (la API lo hace sola). Si la app no tiene el correo habilitado, el ingreso se rechaza.
</details>

<details>
<summary><b>⚪ GitHub</b></summary>

1. [github.com/settings/developers](https://github.com/settings/developers) → **OAuth Apps** → **New OAuth App**.
2. **Homepage URL:** `http://localhost:5175`
3. **Authorization callback URL:** `http://localhost:5175/auth/github/callback`
4. Creá la app y generá un **Client secret**.

Si tu correo de GitHub es privado no hay problema: la API usa el correo verificado.
</details>

<details>
<summary><b>🟣 Discord</b></summary>

1. [discord.com/developers/applications](https://discord.com/developers/applications) → **New Application** → nombre `Sistema usuarios R5` → **Create**.
2. Menú **OAuth2:** copiá el **Client ID**, tocá **Reset Secret** y copiá el **Client Secret** (se muestra una sola vez).
3. En **Redirects → Add Redirect** poné `http://localhost:5175/auth/discord/callback` → **Save Changes**.

Entra cualquier cuenta de Discord con el correo **verificado**.
</details>

<details>
<summary><b>🟪 Twitch</b></summary>

1. [dev.twitch.tv/console/apps](https://dev.twitch.tv/console/apps) → **Register Your Application** (necesitás la verificación en dos pasos activada).
2. **Name:** `Sistema usuarios R5`
3. **OAuth Redirect URLs:** `http://localhost:5175/auth/twitch/callback`
4. **Category:** *Website Integration* · **Client Type:** *Confidential* → **Create**.
5. En **Manage** copiá el **Client ID** y tocá **New Secret**.

Twitch solo devuelve el correo si la cuenta lo tiene verificado.
</details>

### 🌫️ Redes sin configurar

Si una red no tiene claves en el `.env`, su botón se ve **apagado** (borde punteado) y al tocarlo abre el aviso **«Próximamente»**. Apenas cargás las claves y reiniciás la API, el botón se activa solo.

---

## 🧭 Cómo funciona el ingreso

```text
 👤 Persona      🖥️ Cliente          ⚙️ API               🌐 Red (Google, etc.)
    │  toca botón    │                   │                        │
    │───────────────►│  POST oauth/url   │                        │
    │                │──────────────────►│ crea "state"           │
    │                │◄──────────────────│ devuelve la URL        │
    │◄───────────────│  redirige ────────┼───────────────────────►│
    │                                                             │ acepta permisos
    │◄────────────────────  vuelve con ?code=...&state=...  ──────│
    │───────────────►│  POST oauth/callback (code + state)        │
    │                │──────────────────►│ canjea code ──────────►│
    │                │                   │◄────── perfil ─────────│
    │                │◄──────────────────│ abre la sesión         │
    │◄───────────────│  entra al sistema │                        │
```

**Qué hace la API con el perfil que recibe:**

| Situación | Resultado |
|---|---|
| Esa cuenta de la red ya entró antes | 🔓 abre su sesión |
| El correo verificado ya tiene una cuenta | 🔗 **vincula** la red a esa cuenta y abre la sesión |
| No existe | ✨ **crea la cuenta** (rol `usuario`, sin contraseña) y abre la sesión |
| La red no da un correo verificado | ⛔ no entra: se avisa en pantalla |

Detalle técnico completo, archivo por archivo: [arquitectura.md](arquitectura.md).

### 🗄️ Base de datos (3FN)

```text
roles ──< usuarios ──< identidades_oauth
                         (usuario_id, proveedor, proveedor_uid)
```

- `usuarios.password_hash` admite `NULL`: las cuentas creadas con una red no tienen contraseña (pueden definir una desde **Mi perfil**).
- `identidades_oauth`: `UNIQUE(proveedor, proveedor_uid)` y `UNIQUE(usuario_id, proveedor)`; se borra en cascada con el usuario.

### 🔗 Endpoints (todos `POST`)

| Ruta | Quién |
|---|---|
| `/api/auth/registro` · `/login` · `/logout` | público |
| `/api/auth/oauth/proveedores` · `/oauth/url` · `/oauth/callback` | público |
| `/api/auth/sesion` · `/perfil` | usuario con sesión |
| `/api/usuarios/listar` · `/crear` · `/actualizar` · `/eliminar` | solo administrador |

---

## 🔒 Seguridad y reglas

| Tema | Cómo se resuelve |
|---|---|
| Contraseñas | bcrypt |
| Sesión | cookie `httpOnly` de 8 horas; el rol se lee de la BBDD en cada pedido |
| SQL | consultas parametrizadas |
| Redes | `state` aleatorio de un solo uso (anti-CSRF) · secretos solo en la API · el `code` se canjea en el servidor · límite de intentos fallidos |
| Cabeceras | `helmet`, CORS solo para el cliente, todos los endpoints `POST` |

**Validaciones:**

| Campo | Regla |
|---|---|
| Nombre | 2 a 80 caracteres, solo letras y espacios (si la red trae números o símbolos, se limpian) |
| Correo | formato válido, hasta 120 caracteres |
| Contraseña | 8 a 72 caracteres, con mayúscula, minúscula, número y un carácter especial |

> ⚠️ **Límite conocido:** el registro con correo y contraseña no verifica el correo. Quien se registre a mano con un correo ajeno podría quedar vinculado a esa cuenta cuando su dueño entre con una red. En un sistema real se agrega verificación de correo.

---

## 🩺 Si algo falla

### Al arrancar

| Síntoma | Causa y arreglo |
|---|---|
| `ECONNREFUSED 127.0.0.1:3306` | MySQL apagado → prendelo en XAMPP |
| `Access denied for user` | `DB_USER` o `DB_PASSWORD` mal en `api/.env` |
| `Faltan variables obligatorias en .env` | falta `JWT_SECRET`, `DB_HOST`, `DB_USER` o `DB_NAME` |
| `Port 5175 is already in use` | ya hay otro `npm run dev` corriendo → cerralo |
| La pantalla carga pero los pedidos fallan | la API no está corriendo (o cambiaste `PORT` y falta actualizar `cliente-router/vite.config.ts`) |
| No puedo entrar como administrador | `npm run seed` de nuevo: sincroniza la contraseña con `ADMIN_PASSWORD` |

### Al ingresar con una red

| Síntoma | Causa y arreglo |
|---|---|
| Botón apagado / «Próximamente» | la red no tiene claves en `api/.env`, o las cargaste y no reiniciaste la API |
| `redirect_uri_mismatch` · «Invalid OAuth2 redirect_uri» · «redirect_uri is not associated» | la URL de retorno cargada en la red no es **exactamente** `http://localhost:5175/auth/<red>/callback` |
| Facebook: *Invalid Scopes: email* | falta agregar el permiso `email` en Casos de uso ([ver Facebook](#-configurar-cada-red)) |
| Facebook: «URL bloqueada» o URI no válido | revisá que la URI esté en *URI de redireccionamiento de OAuth válidos* y `localhost` en *Dominios de la app* |
| «No pudimos validar tu cuenta de X» | el detalle está en la consola de la API (línea `[oauth:x]`); casi siempre es el secreto mal copiado |
| «no nos compartió un correo verificado» | la cuenta no tiene el correo confirmado o no se dio el permiso de correo |
