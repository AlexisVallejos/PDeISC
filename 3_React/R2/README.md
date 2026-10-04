# Mis Tareas — TP de React

Aplicación de gestión de tareas desarrollada con React y React Router. Permite crear tareas, ver su detalle, editarlas, marcarlas como completas y eliminarlas con confirmación.

## Funcionalidades

- Filtros para ver todas las tareas, las pendientes o las completadas.
- Búsqueda por título y descripción.
- Resumen de avance calculado desde el array real de tareas.
- Formularios con validación en tiempo real para título y descripción.
- Edición y eliminación desde el detalle de cada tarea.
- Persistencia de tareas y preferencia de tema mediante `localStorage`.
- Tema claro y oscuro, interfaz adaptable y botón para volver arriba.

## Tecnologías

- React 18 y JavaScript.
- React Router DOM para las rutas de la SPA.
- Vite para desarrollo y compilación.
- Bootstrap para utilidades y estructura responsive.
- Lucide React para iconos.

## Ejecutar

```bash
npm install
npm start
```

Vite informa la dirección local al iniciar. Para compilar:

```bash
npm run build
```

## Estructura

```text
src/
├── components/   # navegación, filas, formularios y controles reutilizables
├── context/      # estado compartido de tareas y tema
├── data/         # tareas de ejemplo
├── hooks/        # persistencia reutilizable con localStorage
├── pages/        # inicio, crear, detalle y ruta no encontrada
├── styles/       # estilos globales y paletas clara/oscura
└── utils/        # fechas y validaciones
```

Para recorrer el funcionamiento paso a paso, ver `explicacion.md`.
