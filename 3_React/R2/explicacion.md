# Explicación del proyecto

## 1. Cómo está organizado

La app separa las pantallas (`src/pages`) de las piezas reutilizables (`src/components`). `App.jsx` declara las rutas y `Layout.jsx` mantiene la barra lateral mientras cambia el contenido central.

- `Inicio.jsx`: resume el progreso, permite buscar y filtrar, y dibuja la lista a partir del array de tareas.
- `CrearTarea.jsx`: muestra el formulario para agregar una tarea.
- `DetalleTarea.jsx`: busca una tarea por su id y permite cambiar su estado, editarla o eliminarla.
- `FormularioTarea.jsx`: comparte la misma validación para crear y editar.
- `TareasContext.jsx`: centraliza las operaciones del array para que todas las páginas vean los mismos cambios.
- `TemaContext.jsx`: cambia el tema y conserva la elección.

## 2. Estado y array de tareas

`TareasContext` obtiene el array desde `useLocalStorage`. Cada tarea tiene un `id`, `titulo`, `descripcion`, `completada` y `fechaCreacion`.

Al crear una tarea, `agregarTarea` calcula el próximo id, agrega la fecha y usa el operador de expansión para producir un nuevo array. Al editar se usa `map`, al borrar se usa `filter` y al cambiar el estado se usa `map` para reemplazar solo el objeto correspondiente. `useLocalStorage` guarda cada nueva versión en el navegador.

## 3. Búsqueda y filtros

`Inicio.jsx` lee el filtro de la URL (`estado=todas`, `estado=pendientes` o `estado=completadas`). `useMemo` recorre el array y conserva las tareas que coinciden con el estado y con el texto buscado. El resultado se representa con `map` y cada fila usa `TareaCard`.

El porcentaje de avance se calcula como tareas completas dividido por el total. El proyecto solo registra la fecha de creación; por eso el indicador cuenta el avance general y no inventa estadísticas semanales ni vencimientos.

## 4. Eventos y DOM

Los botones y formularios responden a eventos de React. El control circular de cada fila ejecuta `cambiarEstadoTarea`; las pestañas actualizan el parámetro de búsqueda de React Router; el campo de búsqueda filtra en el momento mientras se escribe. Los enlaces abren el formulario o el detalle sin recargar toda la página.

## 5. Validaciones

`FormularioTarea.jsx` consulta `validaciones.js` cuando cambian los campos, cuando pierden el foco y antes de guardar. El título y la descripción tienen etiquetas visibles, límites de caracteres y mensajes de error. Si hay errores, el formulario no llama a la función de guardado.

## 6. Tema

El tema se guarda en `localStorage` y `TemaContext` establece `data-tema` en el elemento raíz. `claro.css` y `oscuro.css` definen las variables de color; los componentes reutilizan esas variables para conservar contraste y consistencia en ambos modos.
