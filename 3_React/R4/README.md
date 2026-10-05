# React R4 — Portfolio

Portfolio de una sola página hecho con React + Vite, con el diseño de la referencia (titular con una palabra en
serif itálica, botones tipo píldora, tarjetas de proyecto temáticas, línea de tiempo) y criterios de Apple.
El hero es una **MacBook que se abre con el scroll**: 150 fotogramas dibujados en un `<canvas>` dentro de una
sección `sticky`. Al terminar de abrirse, **la pantalla se enciende con una mini versión del sitio**, deformada con
`matrix3d` para calzar en las cuatro esquinas de la pantalla de cada fotograma. Después vienen Proyectos,
Experiencia, Sobre mí y Contacto. Todo el contenido vive en **MySQL** y lo sirve una API Node.

```text
R4/
├── api/                    Backend Node.js + Express + MySQL
│   ├── server.js           API y servidor de la web compilada
│   ├── semilla.json        Contenido inicial que se carga en MySQL
│   └── database.sql        Crea la base (para XAMPP)
├── web/                    Frontend React + Vite
│   ├── public/             favicon, foto.jpg (tu foto) y macbook/ (los 150 fotogramas)
│   │   └── macbook/        frames-webp (1920×1080) y frames-webp-mobile (960×540)
│   └── src/
│       ├── components/     HeroMacbook, PantallaSitio, Estadisticas, BarraNav, Proyectos,
│       │                   Mockup, Experiencia, LineaTiempo, TarjetaResenas, DialogoResena,
│       │                   SobreMi (bento), Habilidades, Contacto, Pie…
│       ├── hooks/          usePortfolio, useProgresoScroll, useAparecer,
│       │                   useSeccionActiva, useReducirMovimiento
│       ├── data/           portfolio.json (copia local por si la API no responde) y
│       │                   pantalla.json (esquinas de la pantalla en los fotogramas 80–149)
│       ├── utils/          perspectiva.js (homografía → matrix3d), texto.jsx (*énfasis*)
│       └── styles/         index.css
├── Dockerfile              Un contenedor: API + web (para Easypanel)
├── docker-compose.yml      Prueba local con MySQL
└── .env.example
```

## Cómo cumple la consigna

| Pide | Dónde está |
| --- | --- |
| Una sola página con componentes | `App.jsx`: hero → `Proyectos` → `Experiencia` → `SobreMi` → `Contacto` |
| Datos, habilidades, logros, experiencias, proyectos | Hero (datos y cifras), `Proyectos`, `Experiencia` (línea de tiempo + reseñas), `SobreMi` (bento con bio, logros, ubicación y `Habilidades`) |
| **Animaciones** | MacBook que se abre con el scroll y pantalla que se enciende, línea de tiempo que se dibuja con el scroll, cifras que cuentan, diálogo de reseña, punto de la barra que se desliza, entradas escalonadas, barras de nivel, carrusel, hover de tarjetas |
| **Hooks** | `useState`, `useEffect`, `useLayoutEffect`, `useRef`, `useMemo`, `useCallback` y 7 hooks propios en `src/hooks/` (`useAlScrollear`, `useHora`, …) |
| **Eventos** | `scroll`/`resize` (fotograma, carrusel), `load` de cada fotograma, `click` (ver todos, carrusel, menú), `keydown` (flechas del carrusel, Escape del menú), `pointerdown`, `submit`/`change`/`blur` (formulario) |
| Host con BBDD | Easypanel: servicio MySQL + app Docker. Las tablas `portfolio_*` guardan todo el contenido, los mensajes y las visitas |

## Poner tu foto

Guardá tu foto como `web/public/foto.jpg` (vertical, ~1000×1250). Aparece en blanco y negro en la pantalla de la
MacBook y en "Sobre mí". Sin foto se muestran tus iniciales.

Para usar una imagen real en una tarjeta de proyecto, completá la columna `imagen` de `portfolio_proyectos`
(por ejemplo `/proyectos/ahorcado.jpg` dentro de `web/public`). Sin imagen se dibuja un dispositivo con CSS.

Las palabras entre asteriscos del titular y de los títulos (`Interfaces que *mueven* personas.`) se muestran en
serif itálica. Si no hay foto, se muestran tus iniciales. También podés usar una URL: cambiá la columna `foto`
de `portfolio_perfil`.

## Ejecutar en local

```bash
# 1) MySQL (XAMPP): encender MySQL e importar api/database.sql
# 2) API
cd api
npm install
npm run dev          # http://localhost:3000 — crea las tablas y carga semilla.json
# 3) Web (en otra terminal)
cd web
npm install
npm run dev          # http://localhost:5173 — /api va a la API por el proxy de Vite
```

Sin MySQL la web igual funciona: muestra `web/src/data/portfolio.json` y el pie avisa
"Sin conexión a la API: mostrando datos locales".

## Editar el contenido

El contenido se lee de MySQL, así que se edita desde phpMyAdmin o el panel de MySQL de Easypanel
(tablas `portfolio_perfil`, `portfolio_habilidades`, `portfolio_experiencias`, `portfolio_logros`,
`portfolio_proyectos`). `semilla.json` solo se usa la primera vez, cuando las tablas están vacías.
Si lo cambiás, copialo también a `web/src/data/portfolio.json` para que la copia local coincida.

Los mensajes del formulario quedan en `portfolio_mensajes`. Con `ADMIN_TOKEN` configurado también se leen en
`GET /api/mensajes` enviando el header `x-admin-token`.

## Reseñas

Las visitas dejan su reseña desde Experiencia → "Dejar una reseña" (nombre, rol opcional, 1 a 5 estrellas y texto).
Se guardan en `portfolio_resenas` **pendientes** y se publican cuando las aprobás, así nadie puede publicar cualquier
cosa en tu portfolio. Con `RESENAS_AUTOAPROBAR=true` se publican al instante.

Para moderar hace falta `ADMIN_TOKEN` en el entorno:

```bash
# ver las pendientes
curl "https://<tu-dominio>/api/resenas?estado=pendientes" -H "x-admin-token: <ADMIN_TOKEN>"
# aprobar (o {"aprobada": false} para ocultar)
curl -X PATCH "https://<tu-dominio>/api/resenas/<id>" -H "x-admin-token: <ADMIN_TOKEN>" \
     -H "Content-Type: application/json" -d '{"aprobada": true}'
# borrar
curl -X DELETE "https://<tu-dominio>/api/resenas/<id>" -H "x-admin-token: <ADMIN_TOKEN>"
```

También se puede desde phpMyAdmin: `UPDATE portfolio_resenas SET aprobada = 1 WHERE id = <id>;`

## Deploy en Easypanel

```
Easypanel
├── portfolio-db   (MySQL)        ← base de datos, solo red interna
└── portfolio-app  (App, Docker)  ← API Node + web React, mismo dominio
       ├── /api/portfolio, /api/mensajes, /api/visitas, /api/health
       └── /  (web compilada)
```

1. Subir `3_React/R4` al repositorio `AlexisVallejos/PDeISC`.
2. En Easypanel: **Create Project** → `portfolio`.
3. **+ Service → MySQL**: nombre `portfolio-db`, database `portfolio`. No exponer el puerto. En
   **Credentials** copiar usuario, contraseña y host interno.
4. **+ Service → App**: nombre `portfolio-app`.
   - Source: **GitHub** → `AlexisVallejos/PDeISC`, branch `main`.
   - Build Path: `/3_React/R4`.
   - Builder: **Dockerfile** (`Dockerfile`).
5. **Environment** (ver `.env.example`):
   ```env
   NODE_ENV=production
   HOST=0.0.0.0
   PORT=3000
   DB_HOST=<host interno de Credentials>
   DB_PORT=3306
   DB_USER=<usuario de Credentials>
   DB_PASSWORD=<contraseña de Credentials>
   DB_NAME=portfolio
   ADMIN_TOKEN=<una clave larga: la usás para leer mensajes y aprobar reseñas>
   RESENAS_AUTOAPROBAR=false
   ```
6. **Domains**: dominio automático o propio, protocolo HTTP, puerto `3000`, HTTPS activado.
7. **Deploy**. Probar `https://<tu-dominio>/api/health` → `{"ok":true,"db":"conectada"}` y después abrir
   `https://<tu-dominio>/`. El pie de la página debe decir "Contenido servido desde MySQL".

Prueba local equivalente con Docker: `docker compose up --build` → http://localhost:8080.

## Diseño y movimiento

- **Modo claro y oscuro**: botón sol/luna en la barra. El cambio se revela como un círculo que crece desde el botón
  (View Transitions) y se recuerda en `localStorage`; la primera vez sigue la apariencia del sistema.
- **Scroll suave** con [Lenis](https://github.com/darkroomengineering/lenis) (`src/utils/scrollSuave.js`): la rueda
  del mouse y el trackpad se deslizan en vez de saltar, y los enlaces del menú llevan a cada sección con el mismo
  movimiento. En el celular queda el scroll nativo y con "reducir movimiento" se desactiva solo.
- **Botón para volver arriba** (como en R1 y R2): aparece pasada la primera pantalla y su anillo muestra cuánto de
  la página llevás recorrido.
- **MacBook de tres cuartos**: los fotogramas tienen **fondo transparente** (`herramientas/quitar-fondo.mjs` separa
  la MacBook del fondo y convierte la sombra en negro semitransparente). Así la capa puede girar en 3D
  (`rotateY` de −6° cerrada a −19° abierta) sin que se vea un rectángulo, se apoya igual sobre gris claro y sobre
  negro, y con el mouse se inclina apenas hacia el puntero.
- **Pantalla que se enciende**: `data/pantalla.json` tiene las 4 esquinas de la pantalla en los fotogramas 80–149;
  `utils/perspectiva.js` calcula la homografía que lleva el mini sitio a esas esquinas.
- **Apple**: respuesta al presionar (escala 0,97), curvas ease-out fuertes, solo `transform`/`opacity`, hover solo
  con mouse, barra translúcida, tracking negativo en títulos grandes.
- **Accesibilidad**: con "reducir movimiento" la MacBook aparece abierta y encendida, sin animar; también respeta
  "reducir transparencia" y "aumentar contraste".
