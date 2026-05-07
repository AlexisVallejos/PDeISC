# Proyecto 1: Registro Dinámico de Pacientes (Hospital)

Aplicación web sin recargas que registra pacientes de un hospital usando **3 formas distintas de leer formularios** en JavaScript:

1. **`document.getElementById()`** + acceso a `.value` (clásica).
2. **`document.querySelector()`** + acceso a `.value` (selectores CSS).
3. **`FormData`** + iteración sobre el objeto del formulario (moderna).

## Estructura
- `public/`
  - `css/style.css` - Estilos
  - `js/registro.js` - Lógica del registro y los 3 métodos de lectura
  - `index.html` - Página principal
- `server.js` - Servidor estático en el puerto **4001**

## Cómo ejecutar
1. `node server.js`
2. Abrir `http://localhost:4001` en el navegador.

## Notas
- No se recarga la página: cada paciente se agrega vía DOM dinámico.
- Cada formulario muestra en pantalla qué método de lectura se usó.
