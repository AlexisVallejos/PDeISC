# Proyecto: Método shift()

Este es un proyecto web independiente con Node.js que demuestra el uso del método `shift()` de los arrays en JavaScript.

## Estructura
- `public/`: Archivos estáticos
  - `css/`: Estilos
  - `img/`: Imágenes
  - `js/`: Lógica en JavaScript
  - `index.html`: Página principal
- `server.js`: Servidor web con Express

## Cómo ejecutar
1. `npm install`
2. `node server.js`
3. Abrir `http://localhost:3000` en el navegador.


## Solución de problemas
Si aparece un error de dependencias como `ERR_INVALID_PACKAGE_CONFIG` o `SyntaxError: Invalid or unexpected token` dentro de `node_modules`, la instalación local quedó corrupta.

Pasos recomendados (Windows PowerShell):
1. `Remove-Item -Recurse -Force .\node_modules`
2. `Remove-Item -Force .\package-lock.json`
3. `npm install`
4. `node .\server.js`

Repetí estos pasos dentro de cada carpeta de proyecto (`1-push`, `2-pop`, etc.) porque cada una maneja su propia instalación.
