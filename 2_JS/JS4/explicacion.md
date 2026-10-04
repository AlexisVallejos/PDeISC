# Explicacion del trabajo practico

## 1. Nueva organizacion

JS4 ahora sigue la misma idea general de JS0:

- un `server.js` principal funciona como lanzador
- cada punto tiene su propio `server.js`
- cada punto tiene su propia carpeta `public`
- hay una carpeta compartida para reutilizar codigo comun

La estructura activa queda asi:

- `server.js`: lanzador principal en el puerto `3400`
- `pages/`, `scripts/`, `styles/`: interfaz del lanzador
- `modules/shared/serverFactory.js`: ayudante para crear servidores de ejercicios
- `modules/shared/public/common.css`: estilos base compartidos
- `modules/shared/public/common.js`: tema, boton subir y render comun
- `modules/ejercicio01_fetch/`: servidor e interfaz del punto 1
- `modules/ejercicio02_formulario/`: servidor e interfaz del punto 2
- `modules/ejercicio03_busqueda/`: servidor e interfaz del punto 3
- `modules/ejercicio04_alumnos/`: servidor e interfaz del punto 4
- `tools/start-all.js`: arranca todos los servidores juntos

## 2. Puertos de trabajo

Cada parte corre aislada:

- lanzador: `http://localhost:3400`
- punto 1: `http://localhost:3401`
- punto 2: `http://localhost:3402`
- punto 3: `http://localhost:3403`
- punto 4: `http://localhost:3404`

Esto permite evaluar cada ejercicio de forma independiente.

## 3. Como funciona el lanzador

El lanzador muestra tarjetas con los cuatro puntos.

Cada tarjeta indica:

- nombre del ejercicio
- descripcion corta
- puerto
- boton para abrir ese servidor

Asi no hace falta mezclar todo dentro de una sola pagina.

## 4. Servidor compartido

En `modules/shared/serverFactory.js` se centraliza la infraestructura:

- Express
- `express.json()`
- archivos estaticos
- carpeta `public`
- carpeta compartida `/shared`

Tambien se dejaron funciones reutilizables para validar:

- nombre
- email

De esta forma los servidores de cada punto quedan cortos y claros.

## 5. Punto 1

`modules/ejercicio01_fetch/server.js` levanta el servidor del primer punto.

Su interfaz vive en:

- `public/index.html`
- `public/script.js`
- `public/style.css`

La pagina consulta `https://jsonplaceholder.typicode.com/users` y muestra:

- nombre
- email

Hay dos botones:

- uno usa `fetch()`
- otro usa `axios`

## 6. Punto 2

`modules/ejercicio02_formulario/server.js` solo sirve la pagina del formulario.

El envio real va a:

- `https://jsonplaceholder.typicode.com/users`

La validacion sigue ocurriendo en dos niveles:

- primero en JavaScript del navegador
- despues se envian los datos a la API externa simulada

Si esta todo bien, la interfaz muestra `ID recibido: 11 (simulada)`.

## 7. Punto 3

`modules/ejercicio03_busqueda/server.js` corre el buscador independiente.

La pagina:

1. consulta la API publica una sola vez
2. guarda los usuarios en un array local
3. usa `filter()` mientras el usuario escribe
4. actualiza el DOM en tiempo real

No vuelve a pedir datos en cada tecla.

## 8. Punto 4

`modules/ejercicio04_alumnos/server.js` crea una API propia.

Expone:

- `POST /api/alumnos`

La interfaz de ese mismo punto usa `fetch()` para consultar esa ruta y mostrar los alumnos.

## 9. Tema y boton subir

Todos los puntos usan `modules/shared/public/common.js`.

Ese archivo resuelve:

- modo claro y oscuro con `localStorage`
- boton para volver arriba
- cambio visual del boton segun el tema
- mensajes de estado

Asi se mantiene la misma experiencia en todos los servidores.

## 10. Validaciones

En el punto 2 se cumplen tres niveles:

### HTML

- `required`
- `type="email"`
- `minlength`
- `pattern`

### JavaScript

Los errores aparecen debajo de cada input mientras el usuario escribe.

### Backend

Express vuelve a validar antes de responder.

## 11. Scripts de ejecucion

En `package.json` quedaron scripts separados:

- `npm start`
- `npm run start:punto1`
- `npm run start:punto2`
- `npm run start:punto3`
- `npm run start:punto4`
- `npm run start:all`

Esto copia la idea de JS0, donde cada ejercicio puede arrancarse por separado.

## 12. Resumen

La app ya no esta pensada como una sola pagina gigante.

Ahora trabaja como un conjunto de ejercicios independientes con:

- lanzador principal
- servidores separados
- interfaz propia por punto
- servidor propio donde hace falta
- codigo compartido solo para lo comun

Ese enfoque queda mas alineado con la estructura de los otros trabajos.
