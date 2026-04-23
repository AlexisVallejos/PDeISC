# Proyecto 3

## Objetivo

Contar cuantos hijos tiene un componente HTML al presionar un boton.

## Que hace

- Muestra varios tipos de componentes.
- Permite cambiar entre ellos.
- Cuenta la cantidad de hijos del contenedor activo.
- Muestra el resultado en pantalla.

## Archivos principales

- `app.js`: servidor Express en el puerto `3003`.
- `public/index.html`: contiene las vistas y botones.
- `public/css/style.css`: estilos del inspector visual.
- `public/js/script.js`: cambia de seccion y cuenta hijos.

## Funcionamiento

El script toma el componente activo, busca el contenedor con clase `child-list`, calcula la cantidad de elementos hijos con `children.length` y muestra el total.

