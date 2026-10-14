# 🧩 Cómo está conectado R5

Explica **cómo se conecta cada parte** del sistema y **cómo funciona el ingreso con redes**, con el archivo de cada paso.
Para arrancar: [README.md](README.md) · Para ubicar archivos: [directorio.md](directorio.md)

## 📑 Índice

1. [📍 Mapa general](#-1-mapa-general)
2. [🔌 Las cinco conexiones](#-2-las-cinco-conexiones)
3. [🔄 El recorrido completo](#-3-el-recorrido-completo)
4. [🍪 Sesión y cookies](#-4-sesión-y-cookies)
5. [➕ Cómo agregar una red nueva](#-5-cómo-agregar-una-red-nueva)

---

## 📍 1. Mapa general

```text
                    NAVEGADOR  (http://localhost:5175)
                              │
                              │ ①
                ┌─────────────▼──────────────┐
                │  CLIENTE   React + Vite    │   cliente-router/  · puerto 5175
                └─────────────┬──────────────┘
                              │ ②  todo lo que empieza con /api lo reenvía Vite
                ┌─────────────▼──────────────┐
                │  API   Node + Express      │   api/  · puerto 4005 · solo POST
                └──────┬───────────────┬─────┘
                    ③  │               │  ⑤
          ┌────────────▼─┐     ┌───────▼────────────────────────┐
          │ MySQL · 3306 │     │ Proveedores (por HTTPS)        │
          │ base "r5"    │     │ Google · Facebook · X · GitHub │
          └──────────────┘     │ Discord · Twitch               │
                               └───────▲────────────────────────┘
                                       │ ④ el navegador solo va y vuelve
                                       └── (redirección) ── NAVEGADOR
```

> 🔒 **Regla de oro:** el navegador solo habla con el **cliente**. Con los proveedores habla en un único momento (la redirección donde la persona acepta los permisos). Todo lo demás con ellos lo hace la **API, de servidor a servidor**, para que los secretos nunca pasen por el navegador.

---

## 🔌 2. Las cinco conexiones

| # | Conexión | Cómo viaja | Archivo clave |
|:-:|---|---|---|
| ① | Navegador ↔ Cliente | http, puerto 5175 | `cliente-router/src/App.tsx` |
| ② | Cliente ↔ API | pedidos `POST /api/...` por el proxy de Vite | `cliente-router/vite.config.ts` · `src/services/api.ts` |
| ③ | API ↔ MySQL | pool de `mysql2` | `api/src/services/db.ts` |
| ④ | Navegador ↔ Proveedor | redirección de ida y vuelta | `api/src/oauth/redirectUri.ts` |
| ⑤ | API ↔ Proveedor | `fetch` servidor a servidor | `api/src/oauth/http.ts` · `providers/*.ts` |

### ① Navegador ↔ Cliente

El cliente es una app React con React Router, servida por Vite en el puerto **5175**.

| Ruta | Pantalla |
|---|---|
| `/ingresar` · `/registro` | login y creación de cuenta |
| `/auth/:proveedor/callback` | pantalla a la que vuelve el proveedor |
| `/` | panel del usuario |
| `/usuarios` | panel del administrador |

### ② Cliente ↔ API

Axios usa una dirección **relativa** (`cliente-router/src/services/api.ts`):

```js
export const api = axios.create({
  baseURL: "/api",          // relativa: no dice ni puerto ni protocolo
  withCredentials: true,    // la cookie de sesión viaja sola
});
```

Vite reenvía todo lo que empieza con `/api` a la API (`cliente-router/vite.config.ts`):

```js
server: { proxy: { "/api": "http://localhost:4005" } },
```

```text
 navegador ──► POST /api/auth/login ──► Vite (5175) ──► API (4005)
              (mismo origen)             proxy
```

| ✅ Ventaja | Por qué |
|---|---|
| Un solo origen | las cookies viajan sin restricciones y no hace falta configurar CORS |
| Sin URLs fijas en el código | el cliente no conoce el puerto de la API |

> ⚙️ Si cambiás `PORT` en `api/.env`, cambiá también el `4005` de `vite.config.ts`.
> Todos los endpoints son `POST` (incluso listar y consultar) y están en `api/src/routes/`.

### ③ API ↔ MySQL

- Conexión en `api/src/services/db.ts`: un `pool` de `mysql2` con los datos de `api/.env` (`DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`).
- Consultas parametrizadas (`?`), **un archivo por consulta** en `api/src/services/users/`.

```text
 roles ──< usuarios ──< identidades_oauth
 (admin /   nombre, correo,   (usuario_id, proveedor, proveedor_uid)
  usuario)  password_hash*    UNIQUE(proveedor, proveedor_uid)

 * password_hash puede ser NULL: las cuentas creadas con una red no tienen contraseña
```

`npm run seed` (`api/database/seed-admin.ts`) crea la base, las tablas y el administrador del `.env`; si ya existe, le sincroniza la contraseña.

### ④ Navegador ↔ Proveedor (una redirección)

Al tocar una red, el cliente pide la dirección a la API (`POST /api/auth/oauth/url`) y hace `window.location.assign(url)`. La persona acepta y el proveedor la **devuelve al cliente** con `?code=...&state=...`.

La dirección de vuelta (`redirect_uri`) **debe estar registrada en la consola de cada red** y ser idéntica a la que manda la API. Sale de una sola línea, `api/src/oauth/redirectUri.ts`:

```js
export const redirectUri = (providerName) => `${config.clientUrl}/auth/${providerName}/callback`;
```

| Red | Dirección de vuelta |
|---|---|
| Google · Facebook · X · GitHub · Discord · Twitch | `http://localhost:5175/auth/<red>/callback` |

> `config.clientUrl` sale de `CLIENT_URL` en `api/.env` (por defecto `http://localhost:5175`). Se usa la **misma** función al pedir el permiso y al canjear el código: los proveedores exigen que coincidan.

### ⑤ API ↔ Proveedor (servidor a servidor)

Al volver, el cliente le manda `code` y `state` a la API (`POST /api/auth/oauth/callback`). La API cambia el `code` por un token y pide el perfil con `fetch` (`api/src/oauth/http.ts`: `postForm` y `getJson`, 10 s de tiempo máximo).

| Red | Permisos pedidos | Perfil | Particularidad |
|---|---|---|---|
| 🔴 Google | `openid email profile` | `openidconnect.googleapis.com/v1/userinfo` | usa `email_verified` |
| 🔵 Facebook | `email,public_profile` | `graph.facebook.com/v25.0/me` | Graph API v25.0; el permiso `email` se agrega en la consola de Meta |
| ⚫ X | `users.read tweet.read users.email` | `api.x.com/2/users/me` | **PKCE** obligatorio y `Authorization: Basic` (id:secreto) |
| ⚪ GitHub | `read:user user:email` | `api.github.com/user` + `/user/emails` | el correo puede ser privado: se pide aparte y se elige uno verificado |
| 🟣 Discord | `identify email` | `discord.com/api/users/@me` | exige un `User-Agent` con formato propio |
| 🟪 Twitch | `user:read:email` | `api.twitch.tv/helix/users` | pide además la cabecera `Client-Id` |

Todos los archivos de `api/src/oauth/providers/` tienen la misma forma (`name`, `label`, `isConfigured()`, `buildUrl()`, `fetchProfile()`) y devuelven un perfil normalizado `{ uid, nombre, email, emailVerified }`. `index.ts` los registra.

---

## 🔄 3. El recorrido completo

```text
 👤 Persona toca «Facebook»
 │
 ├─ 1 ── 🖥️ SocialButtons.tsx → AuthPage.tsx
 │
 ├─ 2 ── ⚙️ POST /api/auth/oauth/url                controllers/oauth/url.ts
 │        · getProvider("facebook")                  ¿tiene claves?
 │        · startState()                             crea el "state" → cookie oauth_state (10 min)
 │        · redirectUri("facebook")                  http://localhost:5175/auth/facebook/callback
 │        · provider.buildUrl()                      arma la dirección del proveedor
 │
 ├─ 3 ── 🌐 El navegador va a facebook.com           la persona acepta los permisos
 │
 ├─ 4 ── 🌐 Facebook vuelve a  /auth/facebook/callback?code=...&state=...
 │        🖥️ OAuthCallbackPage.tsx + useOAuthCallback.ts
 │
 ├─ 5 ── ⚙️ POST /api/auth/oauth/callback           controllers/oauth/callback.ts
 │        · checkState()                             compara el state con la cookie (un solo uso)
 │        · provider.fetchProfile()                  canje del code + perfil (servidor a servidor)
 │        · resolveOAuthUser()                       services/oauth/resolveUser.ts
 │        · sendSession()                            cookie "session" (JWT, 8 h)
 │
 └─ 6 ── 🖥️ AuthContext guarda al usuario y va a «/» o «/usuarios» según el rol
```

**Qué decide `resolveOAuthUser`:**

| Caso | Acción |
|---|---|
| Esa cuenta de la red ya entró antes | 🔓 abre su sesión |
| El correo verificado ya existe en `usuarios` | 🔗 vincula la red a esa cuenta |
| No existe | ✨ crea el usuario (rol `usuario`, sin contraseña) |
| La red no da correo verificado | ⛔ error, no se crea nada |

**Seguridad del recorrido:**

| Medida | Cómo |
|---|---|
| `state` anti-CSRF | aleatorio, en cookie `httpOnly`, comparado con `timingSafeEqual` y borrado al usarse |
| PKCE (solo X) | `startState(res, "x", true)` guarda también un `code_verifier` y manda a la URL solo su `SHA-256`; `checkState` lo devuelve al canjear |
| Correo verificado | solo entra quien tiene un correo confirmado en la red |
| Secretos | el canje del código y el pedido del perfil los hace siempre la API |

---

## 🍪 4. Sesión y cookies

| Cookie | Qué guarda | Dura | Opciones |
|---|---|:-:|---|
| `session` | JWT con **solo el id** del usuario (el rol se lee siempre de la BBDD) | 8 h | `httpOnly` · `sameSite=lax` · `secure` solo en producción |
| `oauth_state` | `<red>.<state>` (y `.<verificador PKCE>` en X) | 10 min | las mismas; se borra al usarse |

`api/src/middleware/requireAuth.ts` valida la cookie `session` y carga al usuario real desde MySQL en **cada** pedido.

> 🚀 **En producción:** poné `CLIENT_URL=https://tu-dominio.com`, registrá `https://tu-dominio.com/auth/<red>/callback` en cada red y arrancá la API con `NODE_ENV=production` (activa `secure` en las cookies).

---

## ➕ 5. Cómo agregar una red nueva

| # | Qué hacer | Dónde |
|:-:|---|---|
| 1 | Crear el archivo de la red con la misma forma que los demás | `api/src/oauth/providers/<red>.ts` |
| 2 | Sumar sus dos variables | `api/src/config.ts` y `api/.env.example` |
| 3 | Registrarla | `api/src/oauth/providers/index.ts` |
| 4 | Agregarla al cliente y darle ícono | `cliente-router/src/utils/oauthProviders.ts` · `components/auth/ProviderIcon.tsx` |
| 5 | Registrar su URL de vuelta y cargar las claves | consola de la red · `api/.env` |
| 6 | Sumar su caso a las pruebas | `api/test/oauth.flow.test.ts` |
