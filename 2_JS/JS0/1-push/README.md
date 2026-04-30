# Proyecto: Método push()

Este es un proyecto web independiente con Node.js que demuestra el uso del método `push()` de los arrays en JavaScript.

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
Si aparece un error como `SyntaxError: Invalid or unexpected token` dentro de `node_modules/express/...`, normalmente la instalación local de dependencias quedó corrupta.

Pasos recomendados (Windows PowerShell):
1. `cd 2_JS/JS0/1-push`
2. `Remove-Item -Recurse -Force .\node_modules`
3. `Remove-Item -Force .\package-lock.json`
4. `npm install`
5. `node .\server.js`

Notas:
- Ejecutar siempre `npm install` dentro de la carpeta del proyecto antes de levantar el servidor.
- Si usás varios proyectos de `JS0`, repetí la instalación en cada carpeta (`2-pop`, `3-unshift`, etc.).
