# Proyecto 5

## Objetivo

Insertar distintos objetos HTML usando `innerHTML`.

## Que hace

- Agrega una tarjeta.
- Agrega una lista.
- Agrega una tabla.
- Agrega un mini formulario.
- Agrega un aviso.
- Limpia el contenido creado.

## Archivos principales

- `app.js`: servidor Express en el puerto `3005`.
- `public/index.html`: contiene los botones y el area de vista previa.
- `public/css/style.css`: estilos del constructor visual.
- `public/js/script.js`: guarda plantillas HTML y las inserta.

## Funcionamiento

Cada boton tiene asociado un tipo de plantilla. El script toma esa plantilla desde un objeto JavaScript y la inserta dentro del contenedor con `innerHTML`.

