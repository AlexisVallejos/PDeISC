# Explicación del TP JS6

## Organización

`server.js` levanta Express y conecta los módulos. `pages` contiene el HTML, `styles` tiene la estructura (`base.css`) y los colores de cada tema, `scripts` maneja eventos, Fetch, DOM y la escena 3D, `modules` resuelve la API y el acceso a datos, `database/schema.sql` crea MySQL y `Context` persiste la preferencia visual.

## Flujo de una partida

1. En modo "Dos jugadores" se escribe una palabra secreta: HTML y JavaScript verifican que tenga de 3 a 20 letras y el servidor repite la validación. En modo "Al azar" el servidor elige una palabra de `modules/palabras.js`.
2. Fetch envía el pedido a `POST /api/partidas`. El servidor crea una instancia de `Partida`, guarda esa instancia en un `Map` y responde con guiones y un identificador. La palabra no se manda de vuelta.
3. Cada letra (del teclado en pantalla o del físico) se envía a `POST /api/partidas/:id/letras`. El servidor la guarda sin tilde, así `A` descubre `Á`; la `Ñ` se respeta. El objeto `Set` evita contar letras repetidas y el array que forma la vista permite mostrar cada posición de la palabra.
4. Una respuesta correcta descubre posiciones. Una incorrecta resta uno de los seis intentos. La pista revela una letra al azar y también resta un intento. El servidor determina si se ganó o perdió y, recién al terminar, manda la palabra completa.
5. Si se gana, el formulario solicita un nombre y Fetch manda el identificador al servidor. Este vuelve a comprobar el estado real antes de insertar `tiempo`, `puntos` y `nombre` en MySQL; `fecha` se completa con el valor predeterminado de la tabla.
6. La interfaz vuelve a pedir la tabla ordenada a MySQL. El botón PDF solicita la misma tabla y el servidor arma el archivo descargable.

## Puntaje y validaciones

Una partida ganada empieza en 100 puntos y resta 10 por cada error, con un mínimo de 10. El tiempo se calcula en segundos en el servidor. No se aceptan letras repetidas ni partidas que no hayan sido ganadas al guardar el score.

La validación aparece en HTML, se ejecuta en JavaScript con feedback y se repite en el backend. La consulta de inserción usa parámetros preparados. La tabla se construye con `textContent` para no interpretar el nombre como HTML.

## Escena 3D

`scripts/modules/escena3d.js` usa Three.js (cargado por CDN con un import map). La horca, el taburete y el muñeco se arman con geometrías simples. Cada parte del muñeco tiene sus propios materiales: al empezar quedan transparentes y con cada error una parte se vuelve sólida con un rebote. Las animaciones cambian números de un objeto `estado` y el loop (`renderer.setAnimationLoop`) arma la pose en cada cuadro. El loop se pausa cuando la pestaña no está visible y respeta `prefers-reduced-motion`. `main.js` importa la escena de forma dinámica: si falla, el juego sigue funcionando.

## Qué explicar en la defensa

- `Map` relaciona el identificador con el objeto de partida; `Set` conserva las letras ya usadas.
- Fetch intercambia JSON con Express. La palabra secreta queda en el servidor.
- MySQL persiste los resultados aunque se reinicie Node; las partidas activas viven en memoria y se pierden al reiniciar.
- El índice ayuda al orden de la tabla: más puntos primero y menor tiempo después.
