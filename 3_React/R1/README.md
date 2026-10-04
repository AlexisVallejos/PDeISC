# React R1

R1 tiene una portada con accesos a cada app Vite independiente, siguiendo la distribución de referencia. Todas las pantallas incluyen tema claro/oscuro persistente y navegación para volver al inicio y subir al comienzo de páginas largas.

## Ejecutar

Desde esta carpeta, `npm install` prepara la portada y sus dependencias. Para iniciar la portada: `npm run dev`.

Para abrir un ejercicio por separado, desde su propia carpeta ejecutá `npm install` una vez y después `npm run dev`. También podés iniciarlos desde R1 con `npm run dev:ejercicio1` hasta `npm run dev:ejercicio5`.

Cada proyecto tiene su propio `index.html`, `package.json`, `vite.config.js` y `src/` con sus componentes, estilos y punto de entrada. Todas las pantallas comparten un diseño inspirado en Apple: fuente del sistema, barra superior translúcida con el botón "‹ Inicio", paleta de colores de sistema y respuesta inmediata al presionar. La lista de tareas permite agregar, editar, completar y eliminar elementos, y los conserva en `localStorage`.

```text
R1/
├── Ejercicio1/              # Hola mundo
├── Ejercicio2/              # Tarjetas de presentación
├── Ejercicio3/              # Contador
├── Ejercicio4/              # Lista de tareas
├── Ejercicio5/              # Formulario simple
├── tateti/                  # Juego independiente
├── src/                     # Inicio - R1, con los botones de acceso
├── index.html
└── package.json
```
