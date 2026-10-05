# React R2 · Mis Tareas

Lista de tareas con React Router y `localStorage`, con un diseño inspirado en Recordatorios de Apple.

## Ejecutar

Desde esta carpeta: `npm install` y después `npm run dev`. Para generar la versión final: `npm run build`.

## Funciones

- Listado con filtros **Todas / Pendientes / Completadas** (en la URL: `/?estado=pendientes`) y búsqueda por título o descripción.
- Marcar una tarea como completa desde la lista o el detalle, y **Completar todas / Desmarcar todas**.
- Crear (`/crear`), ver (`/tareas/:id`), editar y eliminar tareas, con alerta de confirmación.
- Validación en línea: título de 3 a 80 caracteres y descripción de 10 a 300, con contador.
- Resumen de avance con anillo de progreso.
- Tema claro/oscuro: la primera vez sigue al sistema; después se recuerda la elección.
- Las tareas se guardan en `localStorage` y se sincronizan entre pestañas.
- Página 404 y aviso cuando una tarea no existe.

## Diseño

- Fuente del sistema, títulos grandes con tracking negativo y colores semánticos de iOS (fondos agrupados, etiquetas, separadores).
- Barra lateral y barra superior translúcidas (`backdrop-filter`); en el celular la lateral se reemplaza por una barra superior.
- Listas "inset grouped" con separadores que arrancan en el texto, control segmentado con pastilla deslizante y alerta al estilo iOS.
- Respuesta inmediata al presionar y movimiento sin rebote.
- Respeta `prefers-reduced-motion`, `prefers-reduced-transparency` y `prefers-contrast`; áreas táctiles de 44 px y navegación con teclado.

```text
R2/
├── src/
│   ├── components/   # Layout, barras, fila de tarea, formulario, alerta, control segmentado
│   ├── context/      # TareasContext y TemaContext
│   ├── hooks/        # useLocalStorage, useTituloPagina
│   ├── pages/        # Inicio, DetalleTarea, CrearTarea, NoEncontrada
│   ├── styles/       # index.css (todo el diseño)
│   └── utils/        # fecha, filtros, validaciones
├── public/favicon.svg
├── index.html
└── package.json
```
