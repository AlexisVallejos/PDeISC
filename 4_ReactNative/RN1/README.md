# DAMAC — Acceso de usuarios (React Native + Expo + TypeScript)

App con login que consulta una API Node.js conectada a MySQL (XAMPP). Si los datos son
correctos, navega a la pantalla de **Bienvenida** pasando los datos del usuario por **props**.

```
damac-acceso/
├── api/                  Backend Node.js + Express + MySQL
│   ├── database.sql      Base de datos, tabla y usuarios de prueba
│   └── server.js         API: POST /api/login, GET /api/health
└── app/                  App Expo (TypeScript)
    ├── App.tsx           Navegación (stack Login → Bienvenida)
    └── src/
        ├── screens/LoginScreen.tsx       Formulario de ingreso (hoja junto al video de marca)
        ├── screens/BienvenidaScreen.tsx  Recibe los datos y los pasa por props a <Bienvenida />
        ├── components/Form.tsx           Formulario "inset grouped" estilo iOS
        ├── components/VideoMarca.tsx     Video de marca del login (mudo, en bucle)
        ├── components/Logo3D.tsx         Logo 3D animado e interactivo (pantalla de Bienvenida)
        ├── components/PressableScale.tsx Botón con respuesta al press-in + háptica
        ├── theme.ts                      Colores semánticos, escala tipográfica, springs
        └── assets/video/                 damac-login.mp4 + póster (panel de video del login)
        ├── services/api.ts               Llamada a la API
        └── types/                        Tipos de usuario y navegación
```

## Cómo cumple la consigna

1. **Página principal con formulario** → `LoginScreen`. Si la API responde `ok: true`,
   navega (React Navigation) a `Bienvenida`.
2. **Datos por props** → `BienvenidaScreen` recibe `route.params.usuario` y renderiza
   `<Bienvenida nombre usuario email rol ultimoAcceso onCerrarSesion />` con props tipadas
   (`BienvenidaProps`).
3. **Backend** → API en Node.js (`api/server.js`) que busca el usuario en MySQL y devuelve JSON:
   - `200 { ok: true, mensaje, usuario: {...} }` si existe.
   - `401 { ok: false, mensaje: "Usuario o contraseña incorrectos" }` si no.

## Puesta en marcha

### 1. Base de datos (XAMPP)
1. Abrir el panel de XAMPP y encender **MySQL**.
2. En phpMyAdmin → *Importar* → elegir `api/database.sql` (o por consola):
   ```bash
   C:\xampp\mysql\bin\mysql.exe -u root < api/database.sql
   ```

### 2. API
```bash
cd api
npm install
npm start
```
Probar: http://localhost:3000/api/health → `{"ok":true,"db":"conectada"}`

Variables opcionales: `PORT`, `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`.

### 3. App
```bash
cd app
npm install
npx expo start
```
- Celular físico con **Expo Go**: escanear el QR (PC y celular en la misma red Wi-Fi).
  La app detecta sola la IP de la PC. Si Windows pregunta, permitir Node en el firewall.
- Web: tecla `w`. Emulador Android: tecla `a`.
- Para forzar otra URL de API, crear `app/.env` con `EXPO_PUBLIC_API_URL=http://192.168.x.x:3000`.

## Usuarios de prueba

| Usuario | Contraseña |
| ------- | ---------- |
| admin   | 1234       |
| alexis  | damac2026  |
| maria   | maria123   |

Las contraseñas se guardan como hash SHA-256 y la consulta es parametrizada (sin inyección SQL).

## Diseño (Apple × industrial)

- **Tipografía del sistema** (SF / Roboto) con tracking por tamaño: negativo en títulos, ~0 en cuerpo.
- **Formulario agrupado** estilo iOS: etiqueta arriba, valor abajo, separador fino. Los valores largos
  envuelven en vez de truncarse. Inputs de 17 pt (nunca disparan el zoom de Safari).
- **Movimiento**: springs con `dampingRatio: 1` por defecto; `0.8` solo cuando hubo momentum (soltar el
  logo 3D de Bienvenida). Entradas con ease-out fuerte `cubic-bezier(0.23, 1, 0.32, 1)` y menos de
  450 ms. El formulario aparece a los 120 ms. Transición entre pantallas: la nativa de la
  plataforma; con "reducir movimiento", fundido.
- **Respuesta al presionar** en el press-in (escala 0.97 + háptica de selección), no al soltar.
- **Web móvil** (`app/public/index.html`): `viewport-fit=cover`, `100dvh`, sin flash gris al tocar,
  `overscroll-behavior: none`, `theme-color` igual al panel de marca. Nunca `user-scalable=no`.

## Video del login

- El login muestra `app/assets/video/damac-login.mp4` (960×1080, 36 s, **sin audio**, en bucle) a la izquierda
  del formulario; en pantallas angostas va arriba, detrás de la hoja. Es el panel `DamacArLoginPanel` del proyecto
  Remotion `damac-login-video` (Accesorios Damac SRL). Ya trae el logo y la bajada, por eso no hay logo aparte.
- Reproduce con `expo-video` (iOS, Android y web): mudo, `mixWithOthers` (no corta la música del usuario),
  `contentFit: cover` (el logo está en el centro, así que el recorte lo respeta).
- Se pausa cuando el login pierde el foco (por ejemplo, al entrar a Bienvenida) y se reanuda al volver.
- El póster (`damac-login-poster.jpg`) queda debajo: se ve al instante y mientras el video carga. Con "reducir
  movimiento" se muestra solo el póster.
- Para cambiar el video: reemplazar los dos archivos de `app/assets/video/` por una salida nueva de Remotion
  (`npm run render:ar` y `npm run poster:ar`).

## Logo 3D (pantalla de Bienvenida)

- Extrusión de 14 capas cuyo desplazamiento depende de la rotación: la profundidad gira con la letra.
- Entrada: la "D" llega girando en 3D; "AMAC" aparece letra por letra; un reflejo recorre el logo.
- **Arrastrar** el logo lo inclina 1:1 con resistencia elástica; al soltar vuelve con un spring
  que hereda la velocidad del dedo. **Tocar** repite el giro (con vibración háptica).
- Respeta "reducir movimiento" del sistema.

## Deploy en Easypanel (todo en la nube)

Arquitectura: **2 servicios** en el mismo proyecto de Easypanel.

```
Easypanel
├── damac-db   (MySQL)        ← base de datos, solo red interna
└── damac-app  (App, Docker)  ← API Node + web Expo, mismo dominio
       ├── /api/login, /api/health
       └── /  (web compilada)
```

La API crea la tabla aislada `damac_usuarios` y los usuarios de prueba al arrancar:
no hace falta importar `database.sql`.

### Pasos

1. Subir `4_ReactNative/RN1` al repositorio de GitHub `AlexisVallejos/PDeISC`.
2. En Easypanel: **Create Project** → nombre `damac`.
3. Crear la base desde **+ Service → MySQL**:
   - Service name: `damac-db`.
   - Database: `damac_acceso`.
   - User: se puede dejar el usuario generado por Easypanel.
   - No exponer el puerto de MySQL públicamente.
   - En **Credentials**, copiar usuario, contraseña, host interno y puerto.
4. Crear la aplicación desde **+ Service → App**:
   - Service name: `damac-app`.
   - Source: **GitHub**.
   - Repository: `AlexisVallejos/PDeISC`.
   - Branch: `main`.
   - Build Path: `/4_ReactNative/RN1`.
   - Builder: **Dockerfile**.
   - Dockerfile: `Dockerfile`.
5. En **Environment**, pegar estas variables reemplazando los valores de MySQL:
   ```env
   NODE_ENV=production
   HOST=0.0.0.0
   PORT=3000
   DB_HOST=<host interno mostrado en Credentials>
   DB_PORT=3306
   DB_USER=<usuario mostrado en Credentials>
   DB_PASSWORD=<contraseña mostrada en Credentials>
   DB_NAME=damac_acceso
   ```
6. En **Domains**, agregar un dominio automático o propio:
   - Protocol: `HTTP`.
   - Target port: `3000`.
   - Marcarlo como dominio principal y habilitar HTTPS.
7. Presionar **Deploy** y revisar primero el build y luego los logs del servicio.
8. Probar `https://<tu-dominio>/api/health`: debe responder
   `{"ok":true,"db":"conectada"}`. Después abrir `https://<tu-dominio>/`.

La aplicación crea automáticamente la tabla `damac_usuarios` y los usuarios iniciales. No hace falta
importar `api/database.sql` en EasyPanel.

### App en el celular (Expo Go) contra Easypanel

Crear `app/.env`:
```
EXPO_PUBLIC_API_URL=https://<tu-dominio>
```
y correr `npx expo start` en `app/`.

### Probar lo mismo en local con Docker

```bash
docker compose up --build
```
Abrir http://localhost:8080.
