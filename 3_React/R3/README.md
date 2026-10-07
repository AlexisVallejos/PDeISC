# R3 · Sistema de usuarios

Un solo proyecto con **tres diseños**. Cada carpeta `sistema-*` contiene dos clientes independientes que cumplen la consigna: uno cambia de pantalla con `useState` y otro con React Router. Los seis usan la misma API Express y la misma base de datos SQL.

## Estructura

```text
R3/
├── portal/                   portada para abrir los tres sistemas
├── api/                      Express, autenticación y base SQL compartida
├── sistema-1/                Control nocturno
│   ├── cliente-usestate/
│   └── cliente-router/
├── sistema-2/                Estudio editorial
│   ├── cliente-usestate/
│   └── cliente-router/
└── sistema-3/                Atelier modular
    ├── cliente-usestate/
    └── cliente-router/
```

## Ejecutar

Se necesita Node.js **24 o superior** para la opción SQLite incluida. La configuración local está en `api/.env` (no se sube a Git). Para usar MySQL, cambiá `DB_DRIVER=mysql` y completá los datos de conexión; `api/.env.example` muestra todas las variables.

La primera vez, copiá `api/.env.example` a `api/.env` y reemplazá `JWT_SECRET` por una cadena larga propia. Los datos del administrador inicial también se definen en ese archivo.

```bash
cd 3_React/R3
cp -n api/.env.example api/.env
npm install
npm --prefix api install
for sistema in sistema-1 sistema-2 sistema-3; do
  npm --prefix "$sistema/cliente-usestate" install
  npm --prefix "$sistema/cliente-router" install
done
npm run seed
npm run dev
```

Abrí **http://localhost:4000/** para elegir un sistema. El administrador inicial usa `ADMIN_EMAIL` y `ADMIN_PASSWORD` de `api/.env`.

| Carpeta | `useState` | React Router |
|---|---:|---:|
| `sistema-1` · Control nocturno | 5173 | 5174 |
| `sistema-2` · Estudio editorial | 5175 | 5176 |
| `sistema-3` · Atelier modular | 5177 | 5178 |

La API y la portada comparten el puerto **4000**. `npm run build` compila la API y los seis clientes.

## Cómo cumple la actividad

| Requisito | Implementación |
|---|---|
| Base de datos SQL y persistencia | `api/database/schema.sqlite.sql` para ejecución local o `api/database/schema.sql` para MySQL; tablas `roles` y `usuarios` |
| `useState` | estado de pantalla en cada `cliente-usestate/src/App.tsx`, además de formularios y modales |
| `useEffect` | restauración de sesión en `AuthContext`, carga de usuarios en `useUsers` y tema |
| `useForm` | `AuthForm`, `ProfileForm` y `UserFormDialog` con `react-hook-form` |
| `localStorage` | preferencia de tema en `ThemeContext` de cada cliente |
| Context | `AuthContext` y `ThemeContext` |
| React Router | rutas y guardas en cada `cliente-router/` |
| API + React, fetch / Axios | Axios en `src/services/api.ts` llama a Express; la consigna permite cualquiera de las dos opciones |
| Protección de datos | bcrypt, cookie `httpOnly` con JWT de 8 horas, consultas parametrizadas, validación en API, roles comprobados en BBDD, `helmet`, CORS y límite de intentos |

## Diseño y movimiento

Los seis clientes comparten `src/styles/apple.css`, que se importa al final de `main.tsx` y toma los colores de cada sistema:

- feedback al presionar (`:active`), hover solo con mouse, sin el destello gris al tocar en el celular
- diálogos y menús que se materializan con una curva de resorte y crecen desde su disparador; el fondo se atenúa y desenfoca
- barra superior translúcida (`backdrop-filter`) con el contenido pasando por debajo
- cambio claro/oscuro con fundido (View Transitions) y `theme-color` que sigue al tema
- ilustraciones y fondos sin imágenes PNG: cada sistema dibuja su arte en `src/components/common/Artwork.tsx` (SVG/CSS), nítido en cualquier pantalla y con colores de tema claro y oscuro
- respeta `prefers-reduced-motion` (quedan fundidos cortos), `prefers-reduced-transparency` y `prefers-contrast`

La sesión permanece en una cookie protegida y el tema en `localStorage`. Los administradores gestionan usuarios; los usuarios comunes pueden actualizar su propio perfil.
