# React R4 — Portfolio

Portfolio de una sola página hecho con React + Vite. Presenta datos personales, habilidades, experiencia, logros y
proyectos. El inicio es una **MacBook en 3D que se abre con el scroll**: la tapa gira sobre la bisagra, la pantalla
se enciende con tu foto y al final se acerca para dar paso al titular. Todo el contenido vive en **MySQL** y lo sirve
una API Node; el formulario de contacto guarda los mensajes en la misma base.

```text
R4/
├── api/                    Backend Node.js + Express + MySQL
│   ├── server.js           API y servidor de la web compilada
│   ├── semilla.json        Contenido inicial que se carga en MySQL
│   └── database.sql        Crea la base (para XAMPP)
├── web/                    Frontend React + Vite
│   ├── public/             favicon y foto.jpg (tu foto)
│   └── src/
│       ├── components/     HeroMacbook, Macbook, BarraNav, SobreMi, Habilidades,
│       │                   Experiencia, Logros, Proyectos, Contacto, Pie…
│       ├── hooks/          usePortfolio, useProgresoScroll, useAparecer,
│       │                   useSeccionActiva, useReducirMovimiento, useLocalStorage
│       ├── context/        TemaContext (claro / oscuro)
│       ├── data/           portfolio.json (copia local por si la API no responde)
│       └── styles/         index.css
├── Dockerfile              Un contenedor: API + web (para Easypanel)
├── docker-compose.yml      Prueba local con MySQL
└── .env.example
```

## Cómo cumple la consigna

| Pide | Dónde está |
| --- | --- |
| Una sola página con componentes | `App.jsx` arma la página con un componente por sección |
| Datos, habilidades, logros, experiencias, proyectos | `SobreMi`, `Habilidades`, `Logros`, `Experiencia`, `Proyectos` |
| **Animaciones** | MacBook 3D guiada por el scroll, entradas escalonadas al aparecer, barras de nivel, menú móvil, brillo que sigue al puntero |
| **Hooks** | `useState`, `useEffect`, `useRef`, `useMemo`, `useCallback`, `useContext` y 6 hooks propios en `src/hooks/` |
| **Eventos** | `scroll`, `resize`, `pointermove`/`pointerleave` (inclinación de la MacBook y brillo de tarjetas), `click` (filtros, tema, menú), `submit`/`change`/`blur` (formulario), `keydown` (Escape cierra el menú), `storage` |
| Host con BBDD | Easypanel: servicio MySQL + app Docker. Las tablas `portfolio_*` guardan todo el contenido, los mensajes y las visitas |

## Poner tu foto

Guardá tu foto como `web/public/foto.jpg` (cuadrada, ~800×800). Aparece en la pantalla de la MacBook y en
"Sobre mí". Si no hay foto, se muestran tus iniciales. También podés usar una URL: cambiá la columna `foto`
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
   ADMIN_TOKEN=<una clave larga, opcional>
   ```
6. **Domains**: dominio automático o propio, protocolo HTTP, puerto `3000`, HTTPS activado.
7. **Deploy**. Probar `https://<tu-dominio>/api/health` → `{"ok":true,"db":"conectada"}` y después abrir
   `https://<tu-dominio>/`. El pie de la página debe decir "Contenido servido desde MySQL".

Prueba local equivalente con Docker: `docker compose up --build` → http://localhost:8080.

## Diseño y movimiento

- **Estilo Apple**: fuente del sistema con tracking negativo en títulos grandes, fondos que alternan, barra
  translúcida con desenfoque, tarjetas de 28 px de radio, acento azul y tema claro/oscuro (plata o negro
  espacial para la MacBook).
- **MacBook 3D** hecha con caras de CSS 3D (sin modelos ni librerías): tapa con pantalla, dorso y bordes; base con
  teclado, parlantes, trackpad y frente. El scroll mueve un valor de 0 a 1 que sigue un resorte sin rebote,
  así que el movimiento es suave y se puede invertir en cualquier momento. Las transformaciones se aplican por
  `ref` en cada frame, sin re-renderizar React.
- Con mouse, la MacBook se inclina apenas hacia el puntero; en pantallas táctiles no.
- **Accesibilidad**: con "reducir movimiento" la MacBook queda abierta y quieta y las entradas son fundidos
  cortos. También respeta "reducir transparencia" y "aumentar contraste", y tiene enlace para saltar al
  contenido, foco visible y validación del formulario al salir de cada campo.
