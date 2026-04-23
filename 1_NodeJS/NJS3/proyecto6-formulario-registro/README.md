# Proyecto 6

## Objetivo

Crear un formulario de registro que muestre los datos de forma dinamica.

## Que hace

- Pide nombre, mail y edad.
- Usa radio para genero.
- Usa select para provincia.
- Usa checkbox para intereses.
- Muestra los datos ingresados dentro de la misma pagina.

## Archivos principales

- `app.js`: servidor Express en el puerto `3006`.
- `public/index.html`: estructura del formulario.
- `public/css/style.css`: estilos del formulario y resultado.
- `public/js/script.js`: captura datos y los muestra.

## Funcionamiento

El formulario escucha el evento `submit`. JavaScript evita la recarga de pagina, recoge los datos con `FormData` y genera una salida dinamica en el contenedor de resultados.

