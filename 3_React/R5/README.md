# R5 · R3 con ingreso por redes

R5 conserva la estructura del ejercicio R3: **tres sistemas visuales**, cada uno con un cliente que navega con `useState`, otro con React Router y otro en **Next.js** con escenas 3D y movimiento. Los nueve clientes comparten una API Express y una base SQL. Se agregó ingreso con Google, Facebook Login (Meta), GitHub, X, Discord y Twitch sin quitar el acceso por correo y contraseña.

## Estructura

```text
R5/
├── portal/                    portada de los tres sistemas
├── api/                       autenticación, OAuth, usuarios y SQL
├── sistema-1/                 Control nocturno
│   ├── cliente-usestate/
│   ├── cliente-router/
│   └── cliente-next/          Next.js + globo 3D
├── sistema-2/                 Estudio editorial
│   ├── cliente-usestate/
│   ├── cliente-router/
│   └── cliente-next/          Next.js + collage 3D
└── sistema-3/                 Atelier modular
    ├── cliente-usestate/
    ├── cliente-router/
    └── cliente-next/          Next.js + piezas 3D
```

La API conserva registro, sesión con cookie `httpOnly`, perfil, roles, búsqueda y alta, edición y baja de usuarios. Cada cliente conserva validaciones, tema claro/oscuro persistente y confirmaciones. Los botones sociales consultan a la API cuáles proveedores tienen credenciales; los demás muestran «Próximamente».

## Arranque local

Requiere Node.js 24 o superior para SQLite. También puede usarse MySQL cambiando `DB_DRIVER` en `api/.env`.

```bash
cd 3_React/R5
cp api/.env.example api/.env
npm install
npm --prefix api install
for sistema in sistema-1 sistema-2 sistema-3; do
  npm --prefix "$sistema/cliente-usestate" install
  npm --prefix "$sistema/cliente-router" install
  npm --prefix "$sistema/cliente-next" install
done
npm run seed
npm run dev
```

Antes de `npm run seed`, cambiá `JWT_SECRET`, `ADMIN_EMAIL` y `ADMIN_PASSWORD` en `api/.env`. La portada se abre en **http://localhost:4005/**. `npm run dev:next` levanta solo la API y los tres clientes Next. `npm run build` compila la API y los nueve clientes; `npm test` ejecuta las pruebas OAuth con SQLite temporal y proveedores simulados.

| Sistema | `useState` | React Router | Next.js |
|---|---:|---:|---:|
| Control nocturno | 5181 | 5182 | 5187 |
| Estudio editorial | 5183 | 5184 | 5188 |
| Atelier modular | 5185 | 5186 | 5189 |

## Clientes Next.js

Cada `cliente-next/` usa Next.js 16 (App Router) con las mismas reglas, endpoints y validaciones que los otros clientes. Las rutas son `/ingresar`, `/registro`, `/perfil`, `/usuarios` (solo administradores) y `/auth/[proveedor]/callback`. `src/proxy.ts` hace un chequeo optimista: sin la cookie `r5_session` manda a `/ingresar` antes de renderizar; la sesión y el rol los confirma siempre la API. El panel vive en un layout compartido, así la escena 3D no se vuelve a montar al cambiar de sección.

Cada sistema tiene su propia técnica 3D y sus propios componentes de [React Bits](https://reactbits.dev), elegidos para que los tres no se parezcan:

| Sistema | 3D | React Bits | Por qué |
|---|---|---|---|
| Control nocturno | Globo de 4.200 puntos con *shader* propio, anillo orbital y satélite (React Three Fiber) | DecryptedText, ShinyText, SpotlightCard, Magnet, CountUp | Estética de consola: texto que se «descifra», luz que sigue al puntero sobre vidrio oscuro y métricas que cuentan. |
| Estudio editorial | Collage de recortes de papel a distintas profundidades (CSS `perspective` + resortes de Motion), sin WebGL | VariableProximity, SplitText, CurvedLoop, Noise | Es una revista: la tipografía es la protagonista. Fraunces es variable y engorda cerca del puntero; el grano de papel es estático. |
| Atelier modular | Piezas de «arcilla» brillante que flotan, crecen al pasar el puntero y giran al tocarlas (React Three Fiber + drei) | GooeyNav, TiltedCard, SquishSwitch, Counter, ClickSpark | Interfaz lúdica y táctil: navegación líquida, tarjetas que se inclinan, interruptor elástico y chispas al hacer clic. |

Otros candidatos comparados y descartados: Galaxy y Particles (competían con el globo), Lanyard y ModelViewer (pesados para una pantalla de ingreso), FluidGlass (sumaba three.js al sistema editorial), Dock y PillNav (PillNav depende de React Router) y MagicBento (agrega otra librería de íconos).

El movimiento sigue las pautas de diseño de Apple sin copiar su estética: resortes sin rebote por defecto, respuesta al presionar, diálogos que se «materializan» (desenfoque + escala), hoja inferior en el celular del Atelier, vidrio esmerilado con versión sólida para `prefers-reduced-transparency` y versiones quietas para `prefers-reduced-motion`. three.js se carga aparte con `next/dynamic` y solo en el navegador; el tema se aplica con un script previo para que no parpadee.

Los componentes de React Bits están en `src/components/reactbits/` de cada cliente. Se modificaron solo tres detalles, marcados con `R5:` en el código: CountUp parte del valor actual, CurvedLoop no ocupa toda la pantalla y TiltedCard estira su contenido a toda la tarjeta.

## Configurar ingreso social

Completá en `api/.env` el ID y secreto del proveedor que quieras habilitar. Facebook y Meta son un único proveedor: **Facebook Login**. En la consola de cada proveedor registrá esta URL de retorno (sustituyendo `<proveedor>`):

```text
http://localhost:4005/api/auth/oauth/return/<proveedor>
```

Valores de `<proveedor>`: `google`, `facebook`, `github`, `x`, `discord`, `twitch`. Los nueve clientes usan esa única URL por proveedor. La API conserva en el `state` el cliente de origen, comprueba el retorno y redirige a su pantalla de callback. La API canjea el código y recibe los datos del proveedor; los secretos quedan en el servidor.

El proveedor debe compartir un correo verificado. Si ya existe un usuario con ese correo, se vincula la identidad; si no, se crea con rol `usuario`. Una cuenta nacida con una red puede definir una contraseña desde el perfil para usar también el ingreso tradicional.

## Base de datos y pruebas

`api/database/schema.sqlite.sql` y `schema.sql` incluyen `usuarios`, `roles` e `identidades_oauth`. El borrado de un usuario elimina sus identidades vinculadas. La base SQLite se crea en `api/database/r5.sqlite` y queda fuera de Git. Para MySQL, configurá `DB_DRIVER=mysql`, `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD` y `DB_NAME` antes de `npm run seed`.

Las pruebas locales simulan las respuestas de los seis proveedores y prueban creación, vinculación, rechazo sin correo, seguridad de `state`, PKCE de X y retorno al cliente correcto. El ingreso contra cuentas reales requiere credenciales propias y configuración en cada proveedor.
