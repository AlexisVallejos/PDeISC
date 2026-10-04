# JS6 — Ahorcado 3D

Juego del ahorcado con un muñeco en 3D (Three.js). Hay dos modos: **Al azar** (el servidor elige una palabra de una categoría) y **Dos jugadores** (una persona escribe la palabra y la otra la adivina). El servidor conserva la palabra secreta y valida cada intento, y MySQL guarda los puntajes ganados. La tabla se consulta desde la API y se descarga en PDF.

## Cómo se juega

- Se juega con el teclado en pantalla o con el teclado físico. Probar `A` también descubre `Á` (la `Ñ` es una letra aparte).
- Cada error dibuja una parte del muñeco (empieza como silueta transparente). Con 6 errores se cae el taburete y se pierde; si se adivina la palabra, el muñeco salta y festeja.
- **Pista**: revela una letra a cambio de una vida (no disponible con la última vida). **Rendirse** termina la partida y muestra la palabra.
- Las estadísticas (ganadas, racha y mejor racha) se guardan en el navegador.
- La escena 3D se puede girar arrastrando. Si Three.js no carga (sin internet o sin WebGL), el juego sigue funcionando con los corazones del HUD.

## Requisitos

- Node.js 20 o superior.
- MySQL 8 en ejecución.

## Puesta en marcha

1. Desde una consola MySQL, ejecutar `SOURCE /ruta/al/proyecto/2_JS/JS6/database/schema.sql;`.
2. Copiar `.env.example` como `.env` y completar las credenciales MySQL.
3. En esta carpeta ejecutar `npm install` y después `npm start`.
4. Abrir `http://localhost:3606`.

Al arrancar, el servidor crea la base `Score` y la tabla `score` si no existen (el usuario MySQL necesita permiso para crearlas). No crea usuarios ni cambia contraseñas.

Si MySQL no responde, el servidor avisa en la consola y guarda el ranking en `data/puntajes.json` para que el juego funcione igual. Para volver a MySQL hay que levantarlo y reiniciar el servidor.

## Estructura

```text
JS6/
├── Context/tema.js
├── database/schema.sql
├── modules/                 # juego, banco de palabras, validaciones, rutas, MySQL, puntajes y PDF
├── pages/index.html
├── scripts/main.js
├── scripts/modules/         # Fetch, render, teclado, estadísticas y escena 3D (escena3d.js)
├── styles/base.css          # estructura y componentes
├── styles/light.css         # colores del tema claro
├── styles/dark.css          # colores del tema oscuro
└── server.js
```

## API

- `GET /api/categorias` devuelve las categorías del modo al azar.
- `POST /api/partidas` con `{ "palabra": "..." }` (dos jugadores) o `{ "modo": "azar", "categoria": "animales" }` crea una partida sin devolver la palabra.
- `POST /api/partidas/:id/letras` con `{ "letra": "A" }` registra un intento.
- `POST /api/partidas/:id/pista` revela una letra y descuenta un intento.
- `POST /api/partidas/:id/rendirse` termina la partida como perdida.
- `POST /api/puntajes` con `{ "nombre": "...", "partidaId": "..." }` guarda una partida ganada.
- `GET /api/puntajes` devuelve los primeros 100 resultados.
- `GET /api/puntajes/pdf` devuelve la tabla actual como PDF.

La tabla `score` contiene los campos solicitados: `id`, `tiempo`, `puntos`, `fecha` y `nombre`.
