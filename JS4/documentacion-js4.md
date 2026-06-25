# Documentacion de los archivos JavaScript de JS4

Este archivo explica los `.js` propios del proyecto `JS4`.

No incluye `node_modules` porque esos archivos pertenecen a librerias externas.

La idea es que puedas entender:

- que hace cada archivo
- que hace cada bloque de codigo
- para que sirve cada linea importante

## 1. [server.js](/C:/Users/Alumnos/Downloads/PDeISC/JS4/server.js)

### Importaciones

```js
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
```

- `express` importa el framework que crea el servidor web.
- `path` ayuda a construir rutas de archivos seguras.
- `fileURLToPath` convierte `import.meta.url` en una ruta normal del sistema.

### Variables base del servidor

```js
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 3400;
```

- `__filename` guarda la ruta completa del archivo actual.
- `__dirname` guarda la carpeta donde esta `server.js`.
- `app = express()` crea la aplicacion Express.
- `PORT` usa el puerto del entorno si existe; si no, usa `3400`.

### Datos del launcher

```js
const launcherItems = [ ... ];
```

- Este array define las tarjetas del launcher.
- Cada objeto representa un punto del trabajo.
- `id` identifica el punto.
- `titulo` y `subtitulo` se muestran en la tarjeta.
- `descripcion` explica brevemente el ejercicio.
- `puerto` indica en que puerto corre.
- `ruta` es el enlace para abrirlo.

### Archivos estaticos

```js
app.use(express.static(__dirname));
```

- Le dice a Express que puede servir archivos estaticos desde la carpeta raiz de `JS4`.
- Gracias a esto puede entregar CSS, HTML y JS del launcher.

### Ruta principal

```js
app.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname, "pages", "index.html"));
});
```

- `app.get("/")` responde cuando alguien entra a la raiz del sitio.
- `_req` es la peticion, pero no se usa.
- `res` es la respuesta.
- `sendFile(...)` manda el archivo `pages/index.html`.

### Ruta API del launcher

```js
app.get("/api/launcher", (_req, res) => {
  res.json(launcherItems);
});
```

- Esta ruta devuelve el array del launcher como JSON.
- El frontend lo usa para dibujar las tarjetas dinamicamente.

### Encendido del servidor

```js
app.listen(PORT, () => {
  console.log(`Launcher JS4 activo en http://localhost:${PORT}`);
});
```

- `listen` hace que el servidor quede esperando conexiones.
- El `console.log` solo muestra un mensaje de confirmacion.

## 2. [scripts/main.js](/C:/Users/Alumnos/Downloads/PDeISC/JS4/scripts/main.js)

Este archivo controla el launcher.

### Referencias al DOM

```js
const launcherGrid = document.getElementById("launcher-grid");
const themeButton = document.getElementById("theme-btn");
const backToTopButton = document.getElementById("back-to-top");
const THEME_KEY = "js4-launcher-theme";
```

- Busca los elementos del HTML por su `id`.
- `THEME_KEY` es la clave usada en `localStorage`.

### Funcion `applyTheme`

```js
function applyTheme(theme) {
  const selectedTheme = theme === "dark" ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", selectedTheme);
  localStorage.setItem(THEME_KEY, selectedTheme);
  const nextLabel =
    selectedTheme === "dark" ? "Activar modo claro" : "Activar modo oscuro";
  themeButton.setAttribute("aria-label", nextLabel);
  themeButton.setAttribute("title", nextLabel);
}
```

- Recibe un tema.
- Si el valor es `"dark"`, deja oscuro; si no, usa claro.
- `document.documentElement` apunta al `<html>`.
- `data-theme` activa los estilos del tema.
- Guarda la preferencia en `localStorage`.
- Actualiza `aria-label` y `title` para accesibilidad.

### Funcion `createCard`

```js
function createCard(item) {
  const column = document.createElement("div");
  column.className = "col-md-6 col-xl-3";
  column.innerHTML = `...`;
  return column;
}
```

- Crea una columna Bootstrap.
- Usa `innerHTML` para construir la tarjeta.
- Inserta titulo, descripcion, puerto y boton para abrir el servidor.
- Devuelve el nodo listo para agregarse al DOM.

### Funcion `loadLauncher`

```js
async function loadLauncher() {
  const response = await fetch("/api/launcher");
  const items = await response.json();
  launcherGrid.innerHTML = "";
  items.forEach((item) => launcherGrid.appendChild(createCard(item)));
}
```

- Pide al backend la lista de puntos.
- Convierte la respuesta en JSON.
- Limpia el contenedor.
- Recorre el array y agrega una tarjeta por cada item.

### Funcion `setupTheme`

```js
function setupTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY) || "light";
  applyTheme(savedTheme);

  themeButton.addEventListener("click", () => {
    const currentTheme = localStorage.getItem(THEME_KEY) || "light";
    applyTheme(currentTheme === "light" ? "dark" : "light");
  });
}
```

- Lee el tema guardado.
- Lo aplica al cargar.
- Agrega el evento `click` al boton de tema.
- Si el tema actual es claro, cambia a oscuro, y al reves.

### Funcion `setupBackToTop`

```js
function setupBackToTop() {
  window.addEventListener("scroll", () => {
    backToTopButton.classList.toggle("show", window.scrollY > 220);
  });

  backToTopButton.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}
```

- Escucha el scroll de la ventana.
- Si el usuario bajo mas de `220px`, muestra el boton.
- Al hacer click, vuelve arriba suavemente.

### Inicializacion

```js
loadLauncher();
setupTheme();
setupBackToTop();
```

- Ejecuta la carga de tarjetas.
- Activa el sistema de tema.
- Activa el boton de subir.

## 3. [tools/start-all.js](/C:/Users/Alumnos/Downloads/PDeISC/JS4/tools/start-all.js)

Este archivo sirve para arrancar todos los servidores juntos.

### Importacion

```js
import { spawn } from "node:child_process";
```

- `spawn` lanza procesos hijos desde Node.

### Lista de servidores

```js
const servers = [
  { label: "launcher", file: "server.js" },
  ...
];
```

- Cada objeto indica un nombre corto y el archivo que hay que ejecutar.

### Recorrido de la lista

```js
servers.forEach((server) => {
```

- Recorre todos los servidores uno por uno.

### Lanzamiento de procesos

```js
  const child = spawn(process.execPath, [server.file], {
    stdio: "inherit",
    shell: true
  });
```

- `process.execPath` apunta al ejecutable de Node actual.
- `[server.file]` indica que archivo ejecutar.
- `stdio: "inherit"` hace que la salida se vea en la misma consola.
- `shell: true` permite ejecutarlo usando el shell del sistema.

### Manejo de errores

```js
  child.on("error", (error) => {
    console.error(`No se pudo iniciar ${server.label}:`, error.message);
  });
});
```

- Si falla el arranque de un proceso, muestra un mensaje con el nombre del servidor.

## 4. [modules/shared/serverFactory.js](/C:/Users/Alumnos/Downloads/PDeISC/JS4/modules/shared/serverFactory.js)

Este es uno de los archivos mas importantes porque concentra la logica comun del backend.

### Importaciones

```js
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
```

- Son las mismas utilidades base para crear servidores y rutas.

### Rutas base del archivo

```js
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SHARED_PUBLIC = path.join(__dirname, "public");
```

- `SHARED_PUBLIC` apunta a `modules/shared/public`.
- Esa carpeta contiene CSS y JS que usan todos los puntos.

### Expresiones regulares

```js
const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ' ]{3,}$/;
const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
```

- `nameRegex` valida nombre con letras, espacios y apostrofes.
- `emailRegex` valida un formato razonable de email.

### Funcion `validateName`

```js
export function validateName(nombre = "") {
```

- Se exporta para que otros archivos la usen.
- Si no recibe nada, usa una cadena vacia.

```js
  const limpio = nombre.trim();
```

- Quita espacios extras al principio y al final.

```js
  if (!limpio) {
    return "El nombre es obligatorio.";
  }
```

- Si esta vacio, devuelve un mensaje de error.

```js
  if (limpio.length < 3) {
    return "El nombre debe tener al menos 3 caracteres.";
  }
```

- Verifica longitud minima.

```js
  if (!nameRegex.test(limpio)) {
    return "El nombre solo puede tener letras, espacios y apostrofes.";
  }
```

- Usa la expresion regular para validar el contenido.

```js
  return "";
}
```

- Si no hay error, devuelve cadena vacia.

### Funcion `validateEmail`

Hace algo similar para el email.

```js
  if (!limpio) {
    return "El email es obligatorio.";
  }
```

- Exige que el campo no este vacio.

```js
  if (!emailRegex.test(limpio)) {
    return "El email no tiene un formato valido.";
  }
```

- Valida la estructura general del email.

```js
  if (limpio.includes("..")) {
    return "El email no puede tener puntos consecutivos.";
  }
```

- Agrega una segunda regla de seguridad.

### Funcion `createExerciseServer`

```js
export function createExerciseServer({ port, title, exerciseRoot, registerRoutes }) {
```

- Recibe un objeto de configuracion.
- `port`: puerto del servidor.
- `title`: nombre del punto.
- `exerciseRoot`: carpeta del ejercicio.
- `registerRoutes`: funcion opcional para agregar rutas propias.

```js
  const app = express();
  const publicRoot = path.join(exerciseRoot, "public");
```

- Crea la app Express.
- Calcula la carpeta `public` de ese punto.

```js
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
```

- Activa lectura de JSON.
- Activa lectura de formularios tradicionales.

```js
  app.use("/shared", express.static(SHARED_PUBLIC));
  app.use(express.static(publicRoot));
```

- Sirve archivos compartidos en `/shared`.
- Sirve archivos propios del ejercicio desde su `public`.

```js
  app.get("/", (_req, res) => {
    res.sendFile(path.join(publicRoot, "index.html"));
  });
```

- Siempre entrega el `index.html` del punto al entrar a `/`.

```js
  if (registerRoutes) {
    registerRoutes(app);
  }
```

- Si el ejercicio necesita API propia, la agrega aca.

```js
  app.listen(port, () => {
    console.log(`${title} corriendo en http://localhost:${port}`);
  });
}
```

- Inicia el servidor y muestra un mensaje.

## 5. [modules/shared/public/common.js](/C:/Users/Alumnos/Downloads/PDeISC/JS4/modules/shared/public/common.js)

Este archivo concentra utilidades de frontend reutilizables.

### Funcion `initializeThemeAndTop`

```js
export function initializeThemeAndTop({ themeButtonId, topButtonId, themeKey }) {
```

- Recibe los ids de botones y la clave de `localStorage`.
- Esto permite reutilizar la misma logica en todos los puntos.

```js
  const themeButton = document.getElementById(themeButtonId);
  const topButton = document.getElementById(topButtonId);
```

- Busca los botones en el DOM.

### Funcion interna `applyTheme`

- Decide si el tema es claro u oscuro.
- Actualiza `data-theme`.
- Guarda el tema.
- Cambia atributos accesibles del boton.

### Aplicacion del tema guardado

```js
  applyTheme(localStorage.getItem(themeKey) || "light");
```

- Cuando la pagina abre, recupera el tema guardado.

### Evento del boton tema

```js
  themeButton.addEventListener("click", () => {
```

- Cambia el tema al hacer click.

### Evento del scroll

```js
  window.addEventListener("scroll", () => {
    topButton.classList.toggle("show", window.scrollY > 240);
  });
```

- Muestra u oculta el boton subir.

### Evento del boton subir

```js
  topButton.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
```

- Hace scroll suave hacia arriba.

### Funcion `renderStatus`

```js
export function renderStatus(container, message, type = "info") {
  container.className = `status-box status-${type}`;
  container.textContent = message;
}
```

- Cambia el mensaje de un contenedor.
- Tambien le pone la clase correcta segun el tipo:
  `info`, `success` o `error`.

### Funcion `createColumn`

```js
function createColumn(content) {
```

- No se exporta porque solo se usa dentro de este archivo.
- Crea una columna Bootstrap y le agrega el contenido recibido.

### Funcion `renderPeople`

```js
export function renderPeople(container, items, label = "Registro") {
```

- Sirve para renderizar usuarios o alumnos.
- `container` es donde dibuja.
- `items` es el array de datos.
- `label` es el texto de la tarjeta.

```js
  container.innerHTML = "";
```

- Limpia el contenido anterior.

```js
  if (!items.length) {
```

- Si el array esta vacio, muestra un estado vacio.

```js
  items.forEach((item) => {
```

- Si hay datos, crea una tarjeta por cada objeto.

## 6. [modules/ejercicio01_fetch/server.js](/C:/Users/Alumnos/Downloads/PDeISC/JS4/modules/ejercicio01_fetch/server.js)

```js
import path from "path";
import { fileURLToPath } from "url";
import { createExerciseServer } from "../shared/serverFactory.js";
```

- Importa utilidades de ruta.
- Importa la fabrica de servidores compartida.

```js
const __dirname = path.dirname(fileURLToPath(import.meta.url));
```

- Obtiene la carpeta actual del ejercicio.

```js
createExerciseServer({
  port: 3401,
  title: "Punto 1 - Fetch y Axios",
  exerciseRoot: __dirname
});
```

- Arranca el servidor del punto 1.
- Usa el puerto `3401`.
- No agrega rutas extra porque este punto solo consume una API externa.

## 7. [modules/ejercicio01_fetch/public/script.js](/C:/Users/Alumnos/Downloads/PDeISC/JS4/modules/ejercicio01_fetch/public/script.js)

### Importacion de helpers

- `initializeThemeAndTop` maneja tema y boton subir.
- `renderPeople` dibuja resultados.
- `renderStatus` muestra mensajes.

### Referencias al DOM

- Guarda los elementos principales: estado, resultados y botones.

### Funcion `mapUsers`

```js
function mapUsers(users) {
  return users.map((user) => ({
    title: user.name,
    subtitle: user.email
  }));
}
```

- Transforma la respuesta de la API a un formato mas simple para renderizar.

### Funcion `loadWithFetch`

- Muestra un estado de carga.
- Usa `fetch(USERS_URL)`.
- Verifica `response.ok`.
- Convierte la respuesta a JSON.
- Mapea los usuarios.
- Muestra el total y los renderiza.

### Funcion `loadWithAxios`

- Hace lo mismo, pero usando `window.axios.get(...)`.

### Eventos de botones

- Limpian resultados anteriores.
- Llaman a la funcion correspondiente.
- Si hay error, lo muestran en el `statusBox`.

### Inicializacion final

- Activa tema y boton subir.

## 8. [modules/ejercicio02_formulario/server.js](/C:/Users/Alumnos/Downloads/PDeISC/JS4/modules/ejercicio02_formulario/server.js)

Este es el backend del punto 2.

### Importaciones

- Usa `createExerciseServer` para montar el servidor.
- Usa `validateName` y `validateEmail` para validar datos.

### Configuracion base

- Define `__dirname`.
- Llama a `createExerciseServer`.

### `registerRoutes(app)`

```js
registerRoutes(app) {
```

- Esta funcion agrega rutas propias al servidor del punto.

### Ruta POST

```js
app.post("/api/usuarios", (req, res) => {
```

- Recibe nombre y email enviados desde el frontend.

```js
  const { nombre, email } = req.body;
```

- Extrae los dos campos del cuerpo de la peticion.

```js
  const errores = {
    nombre: validateName(nombre),
    email: validateEmail(email)
  };
```

- Valida ambos campos usando funciones compartidas.

```js
  if (Object.values(errores).some(Boolean)) {
```

- Si algun valor del objeto contiene texto, entonces hay error.

```js
    return res.status(400).json({
      ok: false,
      mensaje: "Hay errores de validacion.",
      errores
    });
```

- Devuelve error `400` con detalle por campo.

```js
  return res.status(201).json({
    ok: true,
    usuario: {
      id: Date.now(),
      nombre: nombre.trim(),
      email: email.trim().toLowerCase()
    }
  });
```

- Si todo esta bien:
  crea un `id`,
  limpia espacios,
  pasa el email a minusculas
  y responde con `201`.

## 9. [modules/ejercicio02_formulario/public/script.js](/C:/Users/Alumnos/Downloads/PDeISC/JS4/modules/ejercicio02_formulario/public/script.js)

Este es el archivo mas largo porque controla dos formularios y varias validaciones.

### Objetos `forms`, `statusBoxes`, `fieldMap`, `messageMap`

- `forms` guarda los dos formularios: `axios` y `fetch`.
- `statusBoxes` guarda el contenedor de mensajes de cada panel.
- `fieldMap` agrupa inputs por panel.
- `messageMap` agrupa los textos de error por panel.

Esto permite reutilizar la misma logica para ambos paneles.

### Botones

```js
const axiosButton = document.getElementById("send-axios");
const fetchButton = document.getElementById("send-fetch");
```

- Guardan los botones de envio.

### Expresiones regulares

- `nameRegex` valida nombres.
- `emailRegex` valida emails.

### `validateName`

- Repite la logica del backend del lado del navegador.
- Esto da feedback inmediato al usuario.

### `validateEmail`

- Comprueba:
  - que no este vacio
  - que tenga forma de email
  - que no tenga `..`

### `setFieldState`

```js
function setFieldState(methodKey, fieldName, message) {
```

- `methodKey` indica si estamos en el panel `axios` o `fetch`.
- Busca el input correcto y su mensaje.
- Muestra el error.
- Marca el input como valido o invalido con clases CSS.

### `validateAll`

- Valida nombre y email del panel elegido.
- Llama a `setFieldState` para que el usuario vea los errores.
- Devuelve un objeto con:
  - `isValid`
  - `errors`

### `getPayload`

- Devuelve un objeto listo para enviar al backend.

### `resetFormState`

- Resetea el formulario elegido.
- Limpia estilos y mensajes.

### `applyBackendErrors`

- Si el backend devuelve errores, los refleja en el panel correcto.

### `attachLiveValidation`

- Agrega eventos `input` a nombre y email.
- Cada vez que el usuario escribe, valida en tiempo real.

### `submitWithAxios`

- Hace un `POST` con Axios.
- Devuelve la respuesta parseada.

### `submitWithFetch`

- Hace un `POST` con `fetch`.
- Envia JSON.
- Convierte la respuesta a JSON.
- Si el backend respondio mal, construye un error manual.

### `handleSubmit`

Es la funcion central.

Paso a paso:

1. valida el panel elegido
2. si falla, muestra error y corta
3. muestra un mensaje de carga
4. decide si envia con Axios o Fetch
5. si sale bien, muestra el ID recibido
6. si sale mal, pinta errores del backend y muestra mensaje

### Prevencion del submit normal

```js
Object.values(forms).forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
  });
});
```

- Evita que el navegador recargue la pagina al enviar.

### Eventos de botones

- El boton de Axios llama a `handleSubmit("axios", "axios.post()")`.
- El boton de Fetch llama a `handleSubmit("fetch", "fetch POST")`.

### Activacion final

- Se activa la validacion en vivo para los dos paneles.
- Se activa tema y boton subir.

## 10. [modules/ejercicio03_busqueda/server.js](/C:/Users/Alumnos/Downloads/PDeISC/JS4/modules/ejercicio03_busqueda/server.js)

Es muy corto porque solo usa la infraestructura compartida.

- Importa utilidades.
- Calcula `__dirname`.
- Crea el servidor del punto 3 en el puerto `3403`.

## 11. [modules/ejercicio03_busqueda/public/script.js](/C:/Users/Alumnos/Downloads/PDeISC/JS4/modules/ejercicio03_busqueda/public/script.js)

### Variables base

- `USERS_URL` es la API publica.
- Guarda referencias a boton, input, estado y resultados.

### Cache local

```js
let cachedUsers = [];
```

- Almacena usuarios ya descargados.
- Evita volver a consultar la API en cada letra.

### `mapUsers`

- Convierte los usuarios al formato usado por `renderPeople`.

### `filterUsers`

```js
function filterUsers(term) {
```

- Normaliza el texto de busqueda.
- Si esta vacio, devuelve todos.
- Si no, usa `filter()` sobre `cachedUsers`.

### Evento del boton `loadButton`

- Muestra estado de carga.
- Limpia resultados.
- Consulta la API.
- Guarda usuarios en `cachedUsers`.
- Habilita el input de busqueda.
- Hace foco en el input.

### Evento del `searchInput`

- Cada vez que el usuario escribe:
  - filtra usuarios
  - actualiza mensaje
  - vuelve a renderizar el DOM

### Inicializacion

- Activa tema y boton subir.

## 12. [modules/ejercicio04_alumnos/server.js](/C:/Users/Alumnos/Downloads/PDeISC/JS4/modules/ejercicio04_alumnos/server.js)

### Array `alumnos`

```js
const alumnos = [
  ...
];
```

- Guarda datos fijos de alumnos para la API propia.

### Servidor del punto 4

- Usa `createExerciseServer`.
- Corre en `3404`.

### Ruta propia

```js
app.get("/api/alumnos", (_req, res) => {
  res.json(alumnos);
});
```

- Devuelve el array como JSON.

## 13. [modules/ejercicio04_alumnos/public/script.js](/C:/Users/Alumnos/Downloads/PDeISC/JS4/modules/ejercicio04_alumnos/public/script.js)

### Referencias base

- Guarda boton, estado y contenedor de resultados.

### Evento del boton

```js
loadButton.addEventListener("click", async () => {
```

- Al hacer click:
  - muestra mensaje de carga
  - limpia resultados
  - consulta `/api/alumnos`
  - transforma el resultado al formato de tarjetas
  - muestra total de alumnos
  - renderiza el DOM

### Manejo de error

- Si falla la consulta, muestra mensaje de error.

### Inicializacion

- Activa tema y boton subir.

## Resumen final

Los archivos JavaScript de `JS4` se reparten asi:

- `server.js`: launcher general
- `scripts/main.js`: frontend del launcher
- `tools/start-all.js`: arranque multiple
- `modules/shared/serverFactory.js`: backend compartido
- `modules/shared/public/common.js`: frontend compartido
- `modules/ejercicioXX/server.js`: arranque individual de cada punto
- `modules/ejercicioXX/public/script.js`: logica del frontend de cada punto

Si quieres, en el siguiente paso te puedo generar una segunda version mas tipo "defensa oral", con frases cortas para explicar cada archivo frente al profesor.
