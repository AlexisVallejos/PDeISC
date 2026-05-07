# Proyecto 2: Inventario Deportivo Dinámico

Aplicación web que registra artículos deportivos (deporte, herramienta, marca, precio, etc) y los muestra dinámicamente en pantalla. Cada ítem se guarda en un array usando **distintos métodos de almacenaje**:

- `push()` - Agrega al final.
- `unshift()` - Agrega al inicio.
- `splice()` - Inserta en el medio.
- Asignación por índice `arr[arr.length] = ...` - Inserción manual.

## Campos del formulario (8+)
1. Deporte
2. Herramienta / Artículo
3. Marca
4. Modelo
5. Precio
6. Stock
7. Talle / Tamaño
8. Color
9. Material
10. Fecha de ingreso

## Estructura
- `public/`
  - `css/style.css`
  - `js/inventario.js`
  - `index.html`
- `server.js` - Puerto **4002**

## Cómo ejecutar
1. `node server.js`
2. Abrir `http://localhost:4002`.
